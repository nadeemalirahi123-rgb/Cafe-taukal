-- Cafe Taukal — PostgreSQL schema
-- Run:  psql "$DATABASE_URL" -f server/db/schema.sql

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(60) UNIQUE NOT NULL,
  email         VARCHAR(140) UNIQUE,
  password_hash TEXT NOT NULL,
  role          VARCHAR(20) NOT NULL DEFAULT 'admin',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id       SERIAL PRIMARY KEY,
  name     VARCHAR(60) UNIQUE NOT NULL,
  name_ur  VARCHAR(80),
  sort     INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS menu_items (
  id           SERIAL PRIMARY KEY,
  category_id  INT REFERENCES categories(id) ON DELETE SET NULL,
  name         VARCHAR(120) NOT NULL,
  name_ur      VARCHAR(140),
  description  TEXT,
  price        NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  image_url    TEXT,
  is_veg       BOOLEAN DEFAULT FALSE,
  is_spicy     BOOLEAN DEFAULT FALSE,
  bestseller   BOOLEAN DEFAULT FALSE,
  available    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TYPE order_type_enum   AS ENUM ('Delivery','Takeaway','Dine-in');
CREATE TYPE order_status_enum AS ENUM ('Pending','Preparing','Delivered','Cancelled');

CREATE TABLE IF NOT EXISTS orders (
  id            SERIAL PRIMARY KEY,
  customer_name VARCHAR(120) NOT NULL,
  phone         VARCHAR(20)  NOT NULL,
  order_type    order_type_enum NOT NULL DEFAULT 'Delivery',
  address       TEXT,
  table_no      VARCHAR(10),
  notes         TEXT,
  subtotal      NUMERIC(10,2) NOT NULL,
  delivery_fee  NUMERIC(10,2) NOT NULL DEFAULT 0,
  total         NUMERIC(10,2) NOT NULL,
  payment       VARCHAR(30) NOT NULL DEFAULT 'Cash on Delivery',
  status        order_status_enum NOT NULL DEFAULT 'Pending',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id            SERIAL PRIMARY KEY,
  order_id      INT REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id  INT REFERENCES menu_items(id) ON DELETE SET NULL,
  item_name     VARCHAR(120) NOT NULL,
  unit_price    NUMERIC(10,2) NOT NULL,
  quantity      INT NOT NULL CHECK (quantity > 0),
  line_total    NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS rooms (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(80) NOT NULL,
  name_ur      VARCHAR(100),
  description  TEXT,
  price        NUMERIC(10,2) NOT NULL,
  max_guests   INT DEFAULT 2,
  size_label   VARCHAR(40),
  amenities    TEXT[],
  images       TEXT[],
  available    BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS bookings (
  id          SERIAL PRIMARY KEY,
  room_id     INT REFERENCES rooms(id) ON DELETE SET NULL,
  guest_name  VARCHAR(120) NOT NULL,
  phone       VARCHAR(20) NOT NULL,
  check_in    DATE NOT NULL,
  check_out   DATE NOT NULL,
  guests      INT NOT NULL DEFAULT 1,
  nights      INT NOT NULL DEFAULT 1,
  total       NUMERIC(10,2) NOT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'Pending',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (check_out > check_in)
);

CREATE TABLE IF NOT EXISTS gallery (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(140),
  category   VARCHAR(40) NOT NULL,
  image_url  TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(120) NOT NULL,
  phone      VARCHAR(20),
  email      VARCHAR(140),
  subject    VARCHAR(120),
  message    TEXT NOT NULL,
  handled    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_created  ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status   ON orders(status);
CREATE INDEX IF NOT EXISTS idx_menu_category   ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates  ON bookings(check_in, check_out);

INSERT INTO categories (name, name_ur, sort) VALUES
  ('BBQ','باربی کیو',1), ('Desi Food','دیسی کھانا',2), ('Fast Food','فاسٹ فوڈ',3),
  ('Cafe & Drinks','کیفے و مشروبات',4), ('Desserts','میٹھا',5), ('Deals','ڈیلز',6)
ON CONFLICT (name) DO NOTHING;
