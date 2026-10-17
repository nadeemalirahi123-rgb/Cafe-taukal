import { Router } from "express";
import { pool, q } from "../db.js";
import { requireAuth, validate } from "../middleware/auth.js";

const router = Router();

const orderSchema = (b) => {
  const e = [];
  if (!b.name || b.name.trim().length < 3) e.push("name must be at least 3 characters");
  if (!/^03\d{2}[- ]?\d{7}$/.test(String(b.phone || "").trim())) e.push("phone must be a valid Pakistani mobile");
  if (!Array.isArray(b.items) || b.items.length === 0) e.push("items cannot be empty");
  if (!["Delivery", "Takeaway", "Dine-in"].includes(b.type)) e.push("invalid order type");
  if (b.type === "Delivery" && (!b.address || b.address.length < 8)) e.push("address required for delivery");
  if (b.type === "Dine-in" && !b.table) e.push("table number required for dine-in");
  return e;
};

// POST /api/orders  → create order + items in one transaction
router.post("/", validate(orderSchema), async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { name, phone, type, address, table, notes, items } = req.body;
    const subtotal = items.reduce((a, i) => a + Number(i.price) * Number(i.qty), 0);
    const delivery_fee = type === "Delivery" && subtotal < 2000 ? 120 : 0;
    const total = subtotal + delivery_fee;

    await client.query("BEGIN");
    const { rows } = await client.query(
      `INSERT INTO orders (customer_name,phone,order_type,address,table_no,notes,subtotal,delivery_fee,total)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [name, phone, type, address || null, table || null, notes || null, subtotal, delivery_fee, total]
    );
    const order = rows[0];
    for (const i of items) {
      await client.query(
        `INSERT INTO order_items (order_id,menu_item_id,item_name,unit_price,quantity,line_total)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [order.id, i.id || null, i.name, i.price, i.qty, i.price * i.qty]
      );
    }
    await client.query("COMMIT");
    res.status(201).json({ ...order, items });
  } catch (e) {
    await client.query("ROLLBACK");
    next(e);
  } finally {
    client.release();
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { rows } = await q("SELECT * FROM orders WHERE id=$1", [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: "Order not found" });
    const items = await q("SELECT * FROM order_items WHERE order_id=$1", [req.params.id]);
    res.json({ ...rows[0], items: items.rows });
  } catch (e) { next(e); }
});

router.get("/", requireAuth, async (_req, res, next) => {
  try {
    const { rows } = await q("SELECT * FROM orders ORDER BY created_at DESC LIMIT 200");
    res.json(rows);
  } catch (e) { next(e); }
});

router.patch("/:id/status", requireAuth, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["Pending", "Preparing", "Delivered", "Cancelled"].includes(status))
      return res.status(422).json({ error: "Invalid status" });
    const { rows } = await q("UPDATE orders SET status=$2 WHERE id=$1 RETURNING *", [req.params.id, status]);
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.get("/stats/today", requireAuth, async (_req, res, next) => {
  try {
    const { rows } = await q(
      `SELECT COUNT(*)::int AS orders, COALESCE(SUM(total),0)::float AS revenue
         FROM orders WHERE created_at::date = CURRENT_DATE`
    );
    res.json(rows[0]);
  } catch (e) { next(e); }
});

export default router;
