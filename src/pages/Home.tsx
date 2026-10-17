import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Flame, Clock, BedDouble, Utensils, Quote, MapPin, Phone } from "lucide-react";
import { MENU, CATEGORIES } from "../data/menu";
import { ROOMS, GALLERY, TESTIMONIALS, MAP_EMBED, MAP_LINK } from "../data/content";
import { Reveal, SectionTitle, SmartImage } from "../components/UI";
import { rs, call, openWhatsApp } from "../lib/utils";
import { useCart } from "../store/useStore";

const HERO = [
  { img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1800&q=75", t: "Charcoal BBQ,", t2: "Perfected Since 2009" },
  { img: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1800&q=75", t: "Slow-Cooked Desi,", t2: "The Way Sindh Loves It" },
  { img: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1800&q=75", t: "Rest Easy,", t2: "Rooms Above the Kitchen" },
];

function Hero() {
  const nav = useNavigate();
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % HERO.length), 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="relative flex h-[100svh] min-h-[620px] items-center justify-center overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.img
          key={i}
          src={HERO[i].img}
          alt="Cafe Taukal signature dishes"
          initial={{ opacity: 0, scale: 1.18 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.2 }, scale: { duration: 7, ease: "linear" } }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-ink" />
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mb-5 text-[11px] font-semibold uppercase tracking-[0.45em] text-gold sm:text-xs">
          Chandni Chowk • Mirpurkhas • Sindh
        </motion.p>
        <h1 className="font-display text-4xl font-bold leading-[1.1] text-cream sm:text-6xl md:text-7xl">
          <AnimatePresence mode="wait">
            <motion.span key={i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.6 }} className="block">
              {HERO[i].t}
              <span className="mt-2 block gold-text">{HERO[i].t2}</span>
            </motion.span>
          </AnimatePresence>
        </h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-cream/75 sm:text-lg">
          A restaurant, a cafe and a hotel under one roof. Smoky kababs, bubbling karahi, late-night chai and clean, comfortable rooms — all a WhatsApp message away.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button onClick={() => nav("/menu")}
            className="w-full rounded-full bg-gold px-9 py-4 font-semibold text-ink shadow-2xl shadow-gold/25 transition hover:scale-[1.03] hover:bg-gold-soft sm:w-auto">
            Order Now
          </button>
          <button onClick={() => nav("/rooms")}
            className="w-full rounded-full border border-gold/60 px-9 py-4 font-semibold text-gold backdrop-blur transition hover:bg-gold/10 sm:w-auto">
            Book a Room
          </button>
        </motion.div>
        <div className="mt-10 flex justify-center gap-2">
          {HERO.map((_, k) => (
            <button key={k} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)}
              className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-gold" : "w-3 bg-cream/30"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutPreview() {
  const nav = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  return (
    <section ref={ref} className="bg-cream py-20 dark:bg-ink sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2 md:px-8">
        <motion.div style={{ y }} className="relative">
          <div className="overflow-hidden rounded-[2rem] border border-gold/20 shadow-2xl">
            <SmartImage src="https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1000&q=75"
              alt="Chef grilling seekh kababs over charcoal" className="h-[420px] w-full object-cover" />
          </div>
          <div className="absolute -bottom-8 right-4 hidden w-48 overflow-hidden rounded-2xl border-4 border-cream shadow-xl dark:border-ink sm:block">
            <SmartImage src="https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=500&q=70"
              alt="Doodh patti chai" className="h-36 w-full object-cover" />
          </div>
        </motion.div>
        <Reveal>
          <SectionTitle center={false} kicker="Our Story"
            title={<>From a roadside chai stall to <span className="gold-text">Mirpurkhas' favourite table</span></>}
            sub="It started in 2009 with one kettle, six stools and Taukal Sahab's promise: never compromise on the masala. Seventeen years later that same promise fills a 120-seat family hall, a charcoal pit that never cools, and eighteen rooms for guests who come from across Sindh." />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Flame, t: "Charcoal Pit", d: "Real wood coal, never gas" },
              { icon: Utensils, t: "Fresh Daily", d: "Meat cut every morning" },
              { icon: BedDouble, t: "18 Rooms", d: "Reception open 24/7" },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-gold/20 bg-white/60 p-4 dark:bg-white/5">
                <c.icon className="mb-2 h-6 w-6 text-gold" />
                <p className="text-sm font-semibold">{c.t}</p>
                <p className="text-xs opacity-65">{c.d}</p>
              </div>
            ))}
          </div>
          <button onClick={() => nav("/about")} className="mt-8 rounded-full border border-gold px-7 py-3 text-sm font-semibold text-gold transition hover:bg-gold hover:text-ink">
            Read our full story
          </button>
        </Reveal>
      </div>
    </section>
  );
}

function Signature() {
  const items = MENU.filter((m) => m.bestseller);
  const add = useCart((s) => s.add);
  const setOpen = useCart((s) => s.setOpen);
  const scroller = useRef<HTMLDivElement>(null);
  const slide = (dir: number) => scroller.current?.scrollBy({ left: dir * 330, behavior: "smooth" });
  return (
    <section className="relative overflow-hidden bg-coal py-20 text-cream sm:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex items-end justify-between gap-6">
          <SectionTitle center={false} light kicker="Signature Dishes"
            title={<>The plates people <span className="gold-text">drive across town for</span></>}
            sub="Our most-ordered dishes, cooked to order and packed hot for delivery." />
          <div className="mb-12 hidden gap-2 sm:flex">
            <button aria-label="Previous" onClick={() => slide(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-gold/40 text-gold hover:bg-gold/10"><ChevronLeft className="h-5 w-5" /></button>
            <button aria-label="Next" onClick={() => slide(1)} className="grid h-11 w-11 place-items-center rounded-full border border-gold/40 text-gold hover:bg-gold/10"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>
        <div ref={scroller} className="no-scrollbar flex snap-x gap-5 overflow-x-auto pb-4">
          {items.map((m, idx) => (
            <Reveal key={m.id} delay={idx * 0.06}>
              <article className="group w-[280px] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                <div className="h-48 overflow-hidden">
                  <SmartImage src={m.image} alt={m.name} className="h-48 w-full object-cover transition duration-700 group-hover:scale-110" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl">{m.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-cream/60">{m.desc}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-semibold text-gold">{rs(m.price)}</span>
                    <button onClick={() => { add(m); setOpen(true); }}
                      className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-ink transition hover:bg-gold-soft">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Categories() {
  const nav = useNavigate();
  const imgs: Record<string, string> = {
    "BBQ": "photo-1544025162-d76694265947",
    "Desi Food": "photo-1565557623262-b51c2513a641",
    "Fast Food": "photo-1568901346375-23c9450c58cd",
    "Cafe & Drinks": "photo-1544787219-7f47ccb76574",
    "Desserts": "photo-1601050690117-94f5f6fa8bd7",
    "Deals": "photo-1504674900247-0877df9cc836",
  };
  return (
    <section className="bg-cream py-20 dark:bg-ink sm:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionTitle kicker="Explore the Menu" title={<>Six kitchens, <span className="gold-text">one address</span></>}
          sub="Tap a category to jump straight into ordering." />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c} delay={i * 0.05}>
              <button onClick={() => nav(`/menu?cat=${encodeURIComponent(c)}`)}
                className="group relative block h-40 w-full overflow-hidden rounded-3xl sm:h-52">
                <SmartImage src={`https://images.unsplash.com/${imgs[c]}?auto=format&fit=crop&w=700&q=70`} alt={c}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
                <span className="absolute bottom-4 left-5 text-left">
                  <span className="block font-display text-xl text-cream sm:text-2xl">{c}</span>
                  <span className="text-xs text-gold">{MENU.filter((m) => m.category === c).length} items →</span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({ to, label, suffix = "" }: { to: number; label: string; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver((e) => e[0].isIntersecting && setSeen(true), { threshold: 0.4 });
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  useEffect(() => {
    if (!seen) return;
    let f = 0;
    const id = setInterval(() => {
      f += 1;
      setN(Math.round(to * Math.min(1, f / 45)));
      if (f >= 45) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  }, [seen, to]);
  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-4xl font-bold text-gold sm:text-5xl">{n.toLocaleString()}{suffix}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-cream/60">{label}</p>
    </div>
  );
}

function Stats() {
  return (
    <section className="relative overflow-hidden bg-fixed py-20"
      style={{ backgroundImage: "url(https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=70)", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="absolute inset-0 bg-ink/90" />
      <div className="relative mx-auto grid max-w-5xl grid-cols-2 gap-10 px-5 md:grid-cols-4">
        <Counter to={17} label="Years Serving" suffix="+" />
        <Counter to={180000} label="Happy Customers" suffix="+" />
        <Counter to={120} label="Dishes on Menu" />
        <Counter to={18} label="Hotel Rooms" />
      </div>
    </section>
  );
}

function RoomsPreview() {
  const nav = useNavigate();
  return (
    <section className="bg-cream py-20 dark:bg-ink sm:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionTitle kicker="Stay With Us" title={<>Rooms that feel like <span className="gold-text">a quiet guest house</span></>}
          sub="Air-conditioned, spotlessly clean and minutes from Mirpurkhas' main bazaar. Room service straight from our kitchen." />
        <div className="grid gap-6 md:grid-cols-3">
          {ROOMS.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.08}>
              <article className="group overflow-hidden rounded-3xl border border-gold/20 bg-white/60 shadow-sm dark:bg-white/5">
                <div className="h-56 overflow-hidden">
                  <SmartImage src={r.images[0]} alt={r.name} className="h-56 w-full object-cover transition duration-700 group-hover:scale-110" />
                </div>
                <div className="p-6">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-2xl">{r.name}</h3>
                    <span className="text-sm font-semibold text-gold">{rs(r.price)}<span className="text-xs opacity-60">/night</span></span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed opacity-70">{r.desc}</p>
                  <button onClick={() => nav("/rooms")} className="mt-5 w-full rounded-full border border-gold py-3 text-sm font-semibold text-gold transition hover:bg-gold hover:text-ink">
                    View &amp; Book
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(t);
  }, []);
  const t = TESTIMONIALS[i];
  return (
    <section className="bg-coal py-20 text-cream sm:py-28">
      <div className="mx-auto max-w-4xl px-5 text-center md:px-8">
        <SectionTitle light kicker="Guest Reviews" title={<>What Mirpurkhas <span className="gold-text">says about us</span></>} />
        <div className="relative min-h-[230px]">
          <AnimatePresence mode="wait">
            <motion.blockquote key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="glass rounded-3xl p-8">
              <Quote className="mx-auto mb-4 h-8 w-8 text-gold" />
              <p className="font-display text-lg leading-relaxed sm:text-2xl">“{t.text}”</p>
              <div className="mt-5 flex items-center justify-center gap-1">
                {Array.from({ length: t.rating }).map((_, k) => <Star key={k} className="h-4 w-4 fill-gold text-gold" />)}
              </div>
              <footer className="mt-3 text-sm text-cream/70">{t.name} — {t.city}</footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
        <div className="mt-6 flex justify-center gap-2">
          {TESTIMONIALS.map((_, k) => (
            <button key={k} aria-label={`Review ${k + 1}`} onClick={() => setI(k)}
              className={`h-2 rounded-full transition-all ${k === i ? "w-7 bg-gold" : "w-2 bg-cream/30"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryPreview() {
  const nav = useNavigate();
  return (
    <section className="bg-cream py-20 dark:bg-ink sm:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionTitle kicker="Gallery" title={<>A look <span className="gold-text">inside Taukal</span></>} />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {GALLERY.slice(0, 8).map((g, i) => (
            <Reveal key={g.id} delay={i * 0.04}>
              <button onClick={() => nav("/gallery")} className={`group block w-full overflow-hidden rounded-2xl ${i % 5 === 0 ? "h-56" : "h-40"}`}>
                <SmartImage src={g.src} alt={g.alt} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const nav = useNavigate();
  return (
    <section className="relative overflow-hidden py-24"
      style={{ backgroundImage: "url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=70)", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-maroon/70" />
      <div className="relative mx-auto max-w-3xl px-5 text-center text-cream">
        <h2 className="font-display text-3xl font-bold sm:text-5xl">Reserve a table, or let us <span className="gold-text">come to you</span></h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-cream/70 sm:text-base">
          Family cabins, rooftop seating and event bookings available. Delivery across Mirpurkhas city in about 35 minutes.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button onClick={() => openWhatsApp("Assalam-o-Alaikum! I'd like to reserve a table at Cafe Taukal.")}
            className="rounded-full bg-gold px-8 py-4 font-semibold text-ink transition hover:bg-gold-soft">
            Reserve on WhatsApp
          </button>
          <button onClick={call} className="rounded-full border border-gold/60 px-8 py-4 font-semibold text-gold transition hover:bg-gold/10">
            <Phone className="mr-2 inline h-4 w-4" /> 0343 8276211
          </button>
          <button onClick={() => nav("/contact")} className="rounded-full border border-cream/25 px-8 py-4 font-semibold text-cream/85 transition hover:bg-white/10">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
}

function MapSection() {
  return (
    <section className="bg-cream pb-20 pt-16 dark:bg-ink">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <SectionTitle center={false} kicker="Find Us" title={<>Chandni Chowk, <span className="gold-text">Mirpurkhas</span></>} />
            <div className="grid gap-3 text-sm">
              <p className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-gold" /> Chandni Chowk, Mirpurkhas, Sindh, Pakistan</p>
              <p className="flex gap-2"><Clock className="h-4 w-4 shrink-0 text-gold" /> Daily 11:00 AM – 1:00 AM</p>
              <p className="flex gap-2"><Phone className="h-4 w-4 shrink-0 text-gold" /> 0343 8276211</p>
            </div>
            <button onClick={() => window.open(MAP_LINK, "_blank", "noopener")}
              className="mt-6 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink">Get Directions</button>
          </div>
          <div className="overflow-hidden rounded-3xl border border-gold/20 md:col-span-2">
            <iframe title="Cafe Taukal location map" src={MAP_EMBED} loading="lazy" className="h-[340px] w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <Signature />
      <Categories />
      <Stats />
      <RoomsPreview />
      <Testimonials />
      <GalleryPreview />
      <CTA />
      <MapSection />
    </>
  );
}
