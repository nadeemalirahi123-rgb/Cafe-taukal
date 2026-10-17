import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Flame, Leaf, Minus, Plus, Star } from "lucide-react";
import { MENU, CATEGORIES } from "../data/menu";
import { PageHero, SmartImage } from "../components/UI";
import { rs, useToast } from "../lib/utils";
import { useCart } from "../store/useStore";

export default function MenuPage() {
  const [params, setParams] = useSearchParams();
  const cat = params.get("cat") || "All";
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "veg" | "spicy" | "best">("all");
  const [qty, setQty] = useState<Record<number, number>>({});
  const add = useCart((s) => s.add);
  const setOpen = useCart((s) => s.setOpen);
  const push = useToast((s) => s.push);

  const list = useMemo(
    () =>
      MENU.filter((m) => (cat === "All" ? true : m.category === cat))
        .filter((m) => (q ? (m.name + m.desc + m.urdu).toLowerCase().includes(q.toLowerCase()) : true))
        .filter((m) =>
          filter === "veg" ? m.veg : filter === "spicy" ? m.spicy : filter === "best" ? m.bestseller : true
        ),
    [cat, q, filter]
  );

  const setCat = (c: string) => setParams(c === "All" ? {} : { cat: c });
  const g = (id: number) => qty[id] ?? 1;

  return (
    <>
      <PageHero title="Menu & Online Order" sub="Freshly cooked to order. Add to cart, checkout in 30 seconds and confirm on WhatsApp."
        image="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=75" />

      <section className="sticky top-[86px] z-30 border-y border-gold/20 bg-cream/95 py-4 backdrop-blur dark:bg-ink/95">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
              <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search the menu"
                placeholder="Search tikka, karahi, chai…"
                className="w-full rounded-full border border-gold/25 bg-white/70 py-3 pl-11 pr-4 text-sm outline-none focus:border-gold dark:bg-white/5" />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {(["all", "best", "spicy", "veg"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold capitalize transition ${
                    filter === f ? "border-gold bg-gold text-ink" : "border-gold/30 text-gold"}`}>
                  {f === "all" ? "All items" : f === "best" ? "Bestsellers" : f === "veg" ? "Vegetarian" : "Spicy"}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
            {["All", ...CATEGORIES].map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition ${
                  cat === c ? "bg-maroon text-cream" : "bg-black/5 hover:bg-gold/15 dark:bg-white/5"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-12 dark:bg-ink">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="mb-6 text-sm opacity-60">{list.length} items found</p>
          {list.length === 0 ? (
            <p className="py-20 text-center opacity-60">No dishes match your search. Try “karahi” or “chai”.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((m, i) => (
                <motion.article key={m.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.45, delay: (i % 6) * 0.05 }}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-gold/20 bg-white/70 shadow-sm dark:bg-white/5">
                  <div className="relative h-52 overflow-hidden">
                    <SmartImage src={m.image} alt={m.name} className="h-52 w-full object-cover transition duration-700 group-hover:scale-110" />
                    <div className="absolute left-3 top-3 flex gap-1.5">
                      {m.bestseller && <span className="flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold text-ink"><Star className="h-3 w-3" />Bestseller</span>}
                      {m.spicy && <span className="flex items-center gap-1 rounded-full bg-maroon px-2.5 py-1 text-[10px] font-bold text-cream"><Flame className="h-3 w-3" />Spicy</span>}
                      {m.veg && <span className="flex items-center gap-1 rounded-full bg-green-700 px-2.5 py-1 text-[10px] font-bold text-white"><Leaf className="h-3 w-3" />Veg</span>}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-xl">{m.name}</h3>
                      <span className="text-sm opacity-60">{m.urdu}</span>
                    </div>
                    <p className="mt-2 flex-1 text-sm leading-relaxed opacity-70">{m.desc}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-display text-xl font-bold text-gold">{rs(m.price)}</span>
                      <div className="flex items-center gap-2 rounded-full border border-gold/30 px-2 py-1">
                        <button aria-label="Decrease quantity" onClick={() => setQty({ ...qty, [m.id]: Math.max(1, g(m.id) - 1) })}><Minus className="h-4 w-4" /></button>
                        <span className="w-5 text-center text-sm">{g(m.id)}</span>
                        <button aria-label="Increase quantity" onClick={() => setQty({ ...qty, [m.id]: g(m.id) + 1 })}><Plus className="h-4 w-4" /></button>
                      </div>
                    </div>
                    <button onClick={() => { add(m, g(m.id)); push(`${m.name} added to cart`); setOpen(true); }}
                      className="mt-4 w-full rounded-full bg-gold py-3 text-sm font-semibold text-ink transition hover:bg-gold-soft">
                      Add to Cart
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
