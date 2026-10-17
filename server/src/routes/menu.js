import { Router } from "express";
import { q } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { uploadImage } from "../cloudinary.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const { rows } = await q(
      `SELECT m.*, c.name AS category
         FROM menu_items m LEFT JOIN categories c ON c.id = m.category_id
        WHERE ($1::text IS NULL OR c.name = $1)
          AND ($2::text IS NULL OR m.name ILIKE '%'||$2||'%' OR m.description ILIKE '%'||$2||'%')
        ORDER BY m.bestseller DESC, m.id`,
      [category || null, search || null]
    );
    res.json(rows);
  } catch (e) { next(e); }
});

router.get("/categories", async (_req, res, next) => {
  try {
    const { rows } = await q("SELECT * FROM categories ORDER BY sort");
    res.json(rows);
  } catch (e) { next(e); }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { category_id, name, name_ur, description, price, image, is_veg, is_spicy, bestseller } = req.body;
    if (!name || price == null) return res.status(422).json({ error: "name and price are required" });
    const image_url = image?.startsWith("data:") ? await uploadImage(image) : image || null;
    const { rows } = await q(
      `INSERT INTO menu_items (category_id,name,name_ur,description,price,image_url,is_veg,is_spicy,bestseller)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [category_id || null, name, name_ur || null, description || null, price, image_url, !!is_veg, !!is_spicy, !!bestseller]
    );
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const { name, description, price, available, image_url } = req.body;
    const { rows } = await q(
      `UPDATE menu_items SET name=COALESCE($2,name), description=COALESCE($3,description),
         price=COALESCE($4,price), available=COALESCE($5,available), image_url=COALESCE($6,image_url)
       WHERE id=$1 RETURNING *`,
      [req.params.id, name, description, price, available, image_url]
    );
    if (!rows[0]) return res.status(404).json({ error: "Item not found" });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await q("DELETE FROM menu_items WHERE id=$1", [req.params.id]);
    res.status(204).end();
  } catch (e) { next(e); }
});

export default router;
