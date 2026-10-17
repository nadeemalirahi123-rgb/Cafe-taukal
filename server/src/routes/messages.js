import { Router } from "express";
import { q } from "../db.js";
import { requireAuth, validate } from "../middleware/auth.js";

const router = Router();

const schema = (b) => {
  const e = [];
  if (!b.name || b.name.trim().length < 3) e.push("name required");
  if (!b.message || b.message.trim().length < 10) e.push("message too short");
  if (b.email && !/^\S+@\S+\.\S+$/.test(b.email)) e.push("invalid email");
  return e;
};

router.post("/", validate(schema), async (req, res, next) => {
  try {
    const { name, phone, email, subject, message } = req.body;
    const { rows } = await q(
      "INSERT INTO messages (name,phone,email,subject,message) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [name, phone || null, email || null, subject || "General Enquiry", message]
    );
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

router.get("/", requireAuth, async (_req, res, next) => {
  try {
    const { rows } = await q("SELECT * FROM messages ORDER BY created_at DESC LIMIT 200");
    res.json(rows);
  } catch (e) { next(e); }
});

export default router;
