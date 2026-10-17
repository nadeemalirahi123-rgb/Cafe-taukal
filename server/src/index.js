import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { pool } from "./db.js";
import authRoutes from "./routes/auth.js";
import menuRoutes from "./routes/menu.js";
import orderRoutes from "./routes/orders.js";
import roomRoutes from "./routes/rooms.js";
import bookingRoutes from "./routes/bookings.js";
import galleryRoutes from "./routes/gallery.js";
import messageRoutes from "./routes/messages.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: (process.env.CLIENT_ORIGIN || "*").split(","), credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("tiny"));
app.use(rateLimit({ windowMs: 60_000, max: 120, standardHeaders: true, legacyHeaders: false }));

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, db: "up", time: new Date().toISOString() });
  } catch {
    res.status(500).json({ ok: false, db: "down" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/messages", messageRoutes);

app.use((_req, res) => res.status(404).json({ error: "Route not found" }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Cafe Taukal API running on :${port}`));
