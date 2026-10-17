import pg from "pg";

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === "false" ? false : { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30_000,
});

export const q = (text, params) => pool.query(text, params);
