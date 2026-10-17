import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Authentication required" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export const validate = (schemaFn) => (req, res, next) => {
  const errors = schemaFn(req.body || {});
  if (errors.length) return res.status(422).json({ error: "Validation failed", details: errors });
  next();
};
