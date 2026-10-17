import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, LogOut, TrendingUp, ShoppingBag, BedDouble, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { useData, useUI, type Order } from "../store/useStore";
import { MENU, type MenuItem } from "../data/menu";
import { ROOMS } from "../data/content";
import { rs, useToast } from "../lib/utils";

const DEMO = { user: "admin", pass: "taukal2026" };

function Login() {
  const login = useUI((s) => s.login);
  const push = useToast((s) => s.push);
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  return (
    <section className="grid min-h-screen place-items-center bg-ink px-5 pt-24 text-cream">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (u === DEMO.user && p === DEMO.pass) { login(u); push("Welcome back, admin"); }
          else push("Invalid credentials", "error");
        }}
        className="w-full max-w-sm rounded-3xl border border-gold/25 bg-white/5 p-8"
      >
        <Lock className="mx-auto mb-4 h-10 w-10 text-gold" />
        <h1 className="text-center font-display text-2xl">Admin Panel</h1>
        <p className="mt-1 text-center text-xs text-cream/50">Demo credentials: admin / taukal2026</p>
        <input value={u} onChange={(e) => setU(e.target.value)} placeholder="Username" aria-label="Username"
          className="mt-6 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none focus:border-gold" />
        <input value={p} onChange={(e) => setP(e.target.value)} type="password" placeholder="Password" aria-label="Password"
          className="mt-3 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none focus:border-gold" />
        <button className="mt-5 w-full rounded-full bg-gold py-3 font-semibold text-ink">Sign In</button>
      </form>
    </section>
  );
}

export default function Admin() {
  const { admin, logout } = useUI();
  const { orders, bookings, setStatus } = useData();
  const push = useToast((s) => s.push);
  const nav = useNavigate();
  const [tab, setTab] = useState<"dash" | "orders" | "menu" | "rooms" | "bookings">("dash");
  const [items, setItems] = useState<MenuItem[]>(MENU);
  const [form, setForm] = useState({ name: "", price: "", category: "BBQ", desc: "", image: "" });

  if (!admin) return <Login />;

  const today = new Date().toDateString();
  const todays = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
  const revenue = orders.reduce((a, b) => a + b.total, 0);

  const tabs = [
    ["dash", "Dashboard"], ["orders", "Orders"], ["menu", "Menu Items"], ["rooms", "Rooms"], ["bookings", "Bookings"],
  ] as const;

  return (
    <section className="min-h-screen bg-ink px-5 pb-20 pt-32 text-cream md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl">Cafe Taukal <span className="gold-text">Control Room</span></h1>
            <p className="text-sm text-cream/50">Signed in as {admin}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => nav("/")} className="rounded-full border border-gold/40 px-5 py-2 text-sm text-gold">View Site</button>
            <button onClick={logout} className="flex items-center gap-2 rounded-full bg-maroon px-5 py-2 text-sm text-cream"><LogOut className="h-4 w-4" />Logout</button>
          </div>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition ${tab === k ? "bg-gold text-ink" : "border border-white/15 text-cream/70"}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === "dash" && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShoppingBag, t: "Today's Orders", v: todays.length },
              { icon: TrendingUp, t: "Total Revenue", v: rs(revenue) },
              { icon: BedDouble, t: "Bookings", v: bookings.length },
              { icon: ImageIcon, t: "Menu Items", v: items.length },
            ].map((c) => (
              <div key={c.t} className="rounded-3xl border border-gold/20 bg-white/5 p-6">
                <c.icon className="mb-3 h-6 w-6 text-gold" />
                <p className="font-display text-3xl text-gold">{c.v}</p>
                <p className="text-xs uppercase tracking-wider text-cream/50">{c.t}</p>
              </div>
            ))}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:col-span-2 lg:col-span-4">
              <h3 className="font-display text-xl text-gold">Recent Activity</h3>
              {orders.length === 0 ? (
                <p className="mt-3 text-sm text-cream/50">No orders placed yet from this device.</p>
              ) : (
                <div className="mt-3 grid gap-2 text-sm">
                  {orders.slice(0, 5).map((o) => (
                    <div key={o.id} className="flex justify-between border-b border-white/5 py-2">
                      <span>#{o.id} · {o.name} · {o.type}</span>
                      <span className="text-gold">{rs(o.total)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div className="mt-8 grid gap-4">
            {orders.length === 0 && <p className="text-sm text-cream/50">No orders yet.</p>}
            {orders.map((o) => (
              <div key={o.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">#{o.id} — {o.name} <span className="text-xs text-cream/50">({o.phone})</span></p>
                    <p className="text-xs text-cream/50">{o.type} · {new Date(o.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    {(["Pending", "Preparing", "Delivered"] as Order["status"][]).map((s) => (
                      <button key={s} onClick={() => setStatus(o.id, s)}
                        className={`rounded-full px-3 py-1.5 text-xs ${o.status === s ? "bg-gold text-ink" : "border border-white/15 text-cream/60"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-3 text-sm text-cream/70">
                  {o.items.map((i) => <span key={i.id} className="mr-3">{i.qty}x {i.name}</span>)}
                  <strong className="ml-2 text-gold">{rs(o.total)}</strong>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "menu" && (
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!form.name || !form.price) return push("Name and price required", "error");
                setItems([{ id: Date.now(), name: form.name, urdu: "", category: form.category, price: +form.price, desc: form.desc, image: form.image || MENU[0].image }, ...items]);
                setForm({ name: "", price: "", category: "BBQ", desc: "", image: "" });
                push("Menu item added");
              }}
              className="h-fit rounded-3xl border border-gold/20 bg-white/5 p-6"
            >
              <h3 className="mb-4 font-display text-xl text-gold">Add Menu Item</h3>
              {[["name", "Dish name"], ["price", "Price (PKR)"], ["desc", "Description"], ["image", "Image URL (Cloudinary)"]].map(([k, ph]) => (
                <input key={k} value={(form as never as Record<string, string>)[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                  placeholder={ph} aria-label={ph}
                  className="mb-3 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-gold" />
              ))}
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mb-4 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none">
                {["BBQ", "Desi Food", "Fast Food", "Cafe & Drinks", "Desserts", "Deals"].map((c) => <option key={c} className="text-ink">{c}</option>)}
              </select>
              <button className="flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3 text-sm font-semibold text-ink"><Plus className="h-4 w-4" />Add Item</button>
            </form>
            <div className="grid gap-3 lg:col-span-2">
              {items.map((m) => (
                <div key={m.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <img src={m.image} alt={m.name} loading="lazy" className="h-14 w-14 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{m.name}</p>
                    <p className="text-xs text-cream/50">{m.category}</p>
                  </div>
                  <span className="text-sm text-gold">{rs(m.price)}</span>
                  <button aria-label="Delete item" onClick={() => { setItems(items.filter((x) => x.id !== m.id)); push("Item removed"); }} className="text-red-400"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "rooms" && (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {ROOMS.map((r) => (
              <div key={r.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                <img src={r.images[0]} alt={r.name} loading="lazy" className="h-40 w-full object-cover" />
                <div className="p-5">
                  <h3 className="font-display text-lg">{r.name}</h3>
                  <p className="text-sm text-gold">{rs(r.price)} / night</p>
                  <p className="mt-1 text-xs text-cream/50">Available · {r.guests} guests max</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "bookings" && (
          <div className="mt-8 grid gap-3">
            {bookings.length === 0 && <p className="text-sm text-cream/50">No bookings yet.</p>}
            {bookings.map((b) => (
              <div key={b.id} className="flex flex-wrap justify-between gap-2 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm">
                <span>#{b.id} · {b.name} ({b.phone})</span>
                <span className="text-cream/60">{b.room} · {b.checkIn} → {b.checkOut} · {b.guests} guests</span>
                <strong className="text-gold">{rs(b.total)}</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
