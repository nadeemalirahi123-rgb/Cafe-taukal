import { Router } from "express";
import { q } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const { rows } = await q("SELECT * FROM rooms ORDER BY price");
    res.json(rows);
  } catch (e) { next(e); }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { name, name_ur, description, price, max_guests, size_label, amenities, images } = req.body;
    const { rows } = await q(
      `INSERT INTO rooms (name,name_ur,description,price,max_guests,size_label,amenities,images)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [name, name_ur || null, description || null, price, max_guests || 2, size_label || null, amenities || [], images || []]
    );
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const { price, available, description } = req.body;
    const { rows } = await q(
      `UPDATE rooms SET price=COALESCE($2,price), available=COALESCE($3,available),
         description=COALESCE($4,description) WHERE id=$1 RETURNING *`,
      [req.params.id, price, available, description]
    );
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await q("DELETE FROM rooms WHERE id=$1", [req.params.id]);
    res.status(204).end();
  } catch (e) { next(e); }
});

export default router;
