import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { q } from "../db.js";

const router = Router();
const loginLimit = rateLimit({ windowMs: 15 * 60_000, max: 10 });

router.post("/register", async (req, res, next) => {
  try {
    if (req.headers["x-setup-key"] !== process.env.SETUP_KEY)
      return res.status(403).json({ error: "Forbidden" });
    const { username, email, password } = req.body;
    if (!username || !password || password.length < 8)
      return res.status(422).json({ error: "Username and 8+ char password required" });
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await q(
      "INSERT INTO users (username,email,password_hash) VALUES ($1,$2,$3) RETURNING id,username,role",
      [username, email || null, hash]
    );
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

router.post("/login", loginLimit, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { rows } = await q("SELECT * FROM users WHERE username=$1", [username]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password || "", user.password_hash)))
      return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: "12h" });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (e) { next(e); }
});

export default router;
