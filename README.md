# Cafe Taukal — Restaurant & Hotel Website

Chandni Chowk, Mirpurkhas, Sindh · WhatsApp orders: **0343 8276211**

Premium, production-ready website with online ordering (WhatsApp hand-off), room booking,
gallery, admin panel, dark/light mode and an EN / اردو toggle with RTL support.

## Folder structure

```
.
├── index.html                 SEO meta, Open Graph, JSON-LD (Restaurant schema), fonts
├── public/
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── App.tsx                Router + preloader + code splitting
│   ├── index.css              Tailwind v4 theme (gold / charcoal / cream / maroon)
│   ├── components/
│   │   ├── Layout.tsx         Announcement bar, sticky navbar, footer, WhatsApp FAB,
│   │   │                      scroll-to-top, toasts, cookie banner
│   │   ├── CartDrawer.tsx     Cart → checkout → WhatsApp → success screen
│   │   └── UI.tsx             Reveal, SmartImage (skeleton loader), SectionTitle, PageHero
│   ├── data/                  menu.ts (PKR menu), content.ts (rooms, gallery, team, timeline)
│   ├── lib/                   utils.ts (WhatsApp builders, toasts, i18n), api.ts (REST client)
│   ├── store/useStore.ts      Zustand: cart, UI prefs, orders/bookings (localStorage persisted)
│   └── pages/                 Home, MenuPage, Rooms, Gallery, About, Contact, Admin, Misc (404 + Track)
└── server/
    ├── package.json
    ├── .env.example
    ├── db/schema.sql          PostgreSQL schema + seed categories
    └── src/
        ├── index.js           Express app: helmet, CORS, rate limit, error handler
        ├── db.js              pg Pool
        ├── cloudinary.js      base64 → Cloudinary upload
        ├── middleware/auth.js JWT guard + validation helper
        └── routes/            auth, menu, orders, rooms, bookings, gallery, messages
```

## Navigation rule
No `<a>` tags anywhere. All internal navigation uses React Router `useNavigate()` on `<button>`s,
section scrolling uses `scrollIntoView()`, and external actions (WhatsApp, tel:, Google Maps) use
`window.open()` / `window.location.href`.

## Order flow
1. Customer adds items → cart persists in `localStorage`.
2. Checkout validates name, Pakistani phone, address (delivery) or table (dine-in).
3. Order is POSTed to `/api/orders` (transactional insert into `orders` + `order_items`).
4. WhatsApp opens automatically with the formatted, `encodeURIComponent`-escaped order message to
   `https://wa.me/923438276211`.
5. Success screen shows the summary plus a **Track Order** button (`/track/:id`).

Room bookings follow the same pattern via `/api/bookings` + a WhatsApp booking message.

## Local setup

```bash
# Frontend
npm install
cp .env.example .env
npm run dev            # http://localhost:5173

# Backend
cd server
npm install
cp .env.example .env   # fill DATABASE_URL, JWT_SECRET, Cloudinary keys
psql "$DATABASE_URL" -f db/schema.sql
npm run dev            # http://localhost:5000
```

Create the first admin (one time):

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" -H "x-setup-key: $SETUP_KEY" \
  -d '{"username":"admin","password":"a-strong-password"}'
```

Demo admin login in the UI (offline mode): **admin / taukal2026** at `/admin`.

## Deployment
- **Frontend → Vercel:** import the repo, build `npm run build`, output `dist`, env `VITE_API_URL=https://<api>/api`. Add a rewrite of `/(.*)` → `/index.html` for SPA routing.
- **Backend → Render / Railway:** root `server`, build `npm install`, start `npm start`, add all env vars from `server/.env.example`.
- **Database → Neon / Supabase:** create a Postgres database, copy the pooled connection string into `DATABASE_URL`, run `db/schema.sql`.
- **Images → Cloudinary:** add cloud name / key / secret; admin uploads are optimised to `quality:auto, format:auto`.

## Performance & accessibility
Lazy-loaded routes and images, skeleton shimmer placeholders, `loading="lazy"` + `decoding="async"`,
`aria-label`s on every icon button, keyboard-navigable lightbox (←/→/Esc), AA contrast on gold-on-charcoal.
