import { Router } from "express";
import { q } from "../db.js";
import { requireAuth, validate } from "../middleware/auth.js";

const router = Router();

const schema = (b) => {
  const e = [];
  if (!b.name || b.name.trim().length < 3) e.push("name required");
  if (!/^03\d{2}[- ]?\d{7}$/.test(String(b.phone || "").trim())) e.push("valid phone required");
  if (!b.checkIn || !b.checkOut || new Date(b.checkOut) <= new Date(b.checkIn)) e.push("invalid dates");
  if (!b.roomId) e.push("roomId required");
  return e;
};

router.post("/", validate(schema), async (req, res, next) => {
  try {
    const { roomId, name, phone, checkIn, checkOut, guests } = req.body;
    const room = (await q("SELECT * FROM rooms WHERE id=$1", [roomId])).rows[0];
    if (!room) return res.status(404).json({ error: "Room not found" });

    const clash = await q(
      `SELECT 1 FROM bookings WHERE room_id=$1 AND status <> 'Cancelled'
        AND daterange(check_in, check_out, '[)') && daterange($2::date, $3::date, '[)') LIMIT 1`,
      [roomId, checkIn, checkOut]
    );
    if (clash.rowCount) return res.status(409).json({ error: "Room is already booked for these dates" });

    const nights = Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000);
    const total = Number(room.price) * nights;
    const { rows } = await q(
      `INSERT INTO bookings (room_id,guest_name,phone,check_in,check_out,guests,nights,total)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [roomId, name, phone, checkIn, checkOut, guests || 1, nights, total]
    );
    res.status(201).json({ ...rows[0], room: room.name });
  } catch (e) { next(e); }
});

router.get("/", requireAuth, async (_req, res, next) => {
  try {
    const { rows } = await q(
      `SELECT b.*, r.name AS room FROM bookings b LEFT JOIN rooms r ON r.id=b.room_id
        ORDER BY b.created_at DESC LIMIT 200`
    );
    res.json(rows);
  } catch (e) { next(e); }
});

router.patch("/:id/status", requireAuth, async (req, res, next) => {
  try {
    const { rows } = await q("UPDATE bookings SET status=$2 WHERE id=$1 RETURNING *", [req.params.id, req.body.status]);
    res.json(rows[0]);
  } catch (e) { next(e); }
});

export default router;
