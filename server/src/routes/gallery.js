import { Router } from "express";
import { q } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { uploadImage } from "../cloudinary.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { category } = req.query;
    const { rows } = await q(
      `SELECT * FROM gallery WHERE ($1::text IS NULL OR category=$1) ORDER BY created_at DESC`,
      [category && category !== "All" ? category : null]
    );
    res.json(rows);
  } catch (e) { next(e); }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { title, category, image } = req.body;
    if (!image || !category) return res.status(422).json({ error: "image and category required" });
    const image_url = image.startsWith("data:") ? await uploadImage(image, "taukal/gallery") : image;
    const { rows } = await q(
      "INSERT INTO gallery (title,category,image_url) VALUES ($1,$2,$3) RETURNING *",
      [title || null, category, image_url]
    );
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await q("DELETE FROM gallery WHERE id=$1", [req.params.id]);
    res.status(204).end();
  } catch (e) { next(e); }
});

export default router;
