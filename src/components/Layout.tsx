import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu as MenuIcon, X, ShoppingBag, Sun, Moon, Phone, MapPin, Clock,
  ArrowUp, Camera, ThumbsUp, Play, Send, Flame,
} from "lucide-react";
import { useCart, useUI } from "../store/useStore";
import { useToast, openWhatsApp, call, T } from "../lib/utils";
import { MAP_LINK } from "../data/content";
import CartDrawer from "./CartDrawer";

const NAV = [
  { key: "home", path: "/" },
  { key: "menu", path: "/menu" },
  { key: "rooms", path: "/rooms" },
  { key: "gallery", path: "/gallery" },
  { key: "about", path: "/about" },
  { key: "contact", path: "/contact" },
] as const;

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} aria-label="Cafe Taukal home" className="flex items-center gap-3 group">
      <span className="grid h-11 w-11 place-items-center rounded-full border border-gold/60 bg-gradient-to-br from-gold/30 to-transparent font-display text-lg font-bold text-gold transition group-hover:scale-105">
        T
      </span>
      <span className="text-left leading-tight">
        <span className="block font-display text-lg font-bold tracking-wide text-white drop-shadow md:text-xl">
          Cafe <span className="gold-text">Taukal</span>
        </span>
        <span className="block text-[10px] uppercase tracking-[0.3em] text-gold/80">Restaurant &amp; Hotel</span>
      </span>
    </button>
  );
}

function Navbar() {
  const nav = useNavigate();
  const loc = useLocation();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { dark, toggleDark, lang, setLang } = useUI();
  const count = useCart((s) => s.items.reduce((a, b) => a + b.qty, 0));
  const setCartOpen = useCart((s) => s.setOpen);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [loc.pathname]);

  const go = (p: string) => nav(p);
  const t = T[lang];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="bg-gradient-to-r from-maroon via-ink to-maroon px-4 py-1.5 text-center text-[11px] font-medium tracking-wide text-cream/90 sm:text-xs">
        <Flame className="mr-1 inline h-3.5 w-3.5 text-gold" />
        Free delivery across Mirpurkhas on orders above Rs 2000 • Kitchen open till 1:00 AM
      </div>
      <nav
        className={`transition-all duration-500 ${
          solid ? "bg-ink/95 shadow-lg shadow-black/30 backdrop-blur-xl" : "bg-gradient-to-b from-black/70 to-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <Logo onClick={() => go("/")} />
          <div className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <button
                key={n.key}
                onClick={() => go(n.path)}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition ${
                  loc.pathname === n.path ? "text-gold" : "text-cream/80 hover:text-gold"
                }`}
              >
                {t[n.key]}
                {loc.pathname === n.path && (
                  <motion.span layoutId="navdot" className="absolute inset-x-4 -bottom-0.5 h-px bg-gold" />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "en" ? "ur" : "en")}
              aria-label="Toggle language"
              className="hidden h-9 rounded-full border border-gold/40 px-3 text-xs font-semibold text-gold transition hover:bg-gold/10 sm:block"
            >
              {lang === "en" ? "اردو" : "EN"}
            </button>
            <button
              onClick={toggleDark}
              aria-label="Toggle dark mode"
              className="grid h-9 w-9 place-items-center rounded-full border border-gold/40 text-gold transition hover:bg-gold/10"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              className="relative grid h-9 w-9 place-items-center rounded-full border border-gold/40 text-gold transition hover:bg-gold/10"
            >
              <ShoppingBag className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-gold text-[10px] font-bold text-ink">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => go("/menu")}
              className="hidden rounded-full bg-gold px-5 py-2 text-sm font-semibold text-ink shadow-lg shadow-gold/20 transition hover:bg-gold-soft md:block"
            >
              {t.order}
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              className="grid h-9 w-9 place-items-center rounded-full border border-gold/40 text-gold lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-gold/15 bg-ink/98 lg:hidden"
            >
              <div className="grid gap-1 px-4 py-4">
                {NAV.map((n) => (
                  <button
                    key={n.key}
                    onClick={() => go(n.path)}
                    className="rounded-xl px-4 py-3 text-left text-sm font-medium text-cream/85 transition hover:bg-gold/10 hover:text-gold"
                  >
                    {t[n.key]}
                  </button>
                ))}
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button onClick={() => go("/menu")} className="rounded-xl bg-gold py-3 text-sm font-semibold text-ink">
                    {t.order}
                  </button>
                  <button onClick={() => go("/rooms")} className="rounded-xl border border-gold/50 py-3 text-sm font-semibold text-gold">
                    {t.book}
                  </button>
                </div>
                <button
                  onClick={() => setLang(lang === "en" ? "ur" : "en")}
                  className="mt-1 rounded-xl border border-gold/30 py-2 text-xs font-semibold text-gold sm:hidden"
                >
                  {lang === "en" ? "اردو میں دیکھیں" : "View in English"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

function Footer() {
  const nav = useNavigate();
  const push = useToast((s) => s.push);
  const [email, setEmail] = useState("");
  return (
    <footer className="border-t border-gold/20 bg-ink text-cream/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
        <div>
          <Logo onClick={() => nav("/")} />
          <p className="mt-4 text-sm leading-relaxed">
            Since 2009, Chandni Chowk's home of charcoal BBQ, slow-cooked desi cuisine, late-night chai and comfortable rooms for travellers.
          </p>
          <div className="mt-5 flex gap-2">
            {[Camera, ThumbsUp, Play].map((Icon, i) => (
              <button
                key={i}
                aria-label="Social link"
                onClick={() => window.open("https://www.instagram.com", "_blank", "noopener")}
                className="grid h-9 w-9 place-items-center rounded-full border border-gold/30 text-gold transition hover:bg-gold hover:text-ink"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg text-gold">Quick Links</h4>
          <div className="mt-4 grid gap-2 text-sm">
            {NAV.map((n) => (
              <button key={n.key} onClick={() => nav(n.path)} className="text-left capitalize transition hover:text-gold">
                {n.key === "home" ? "Home" : n.key}
              </button>
            ))}
            <button onClick={() => nav("/admin")} className="text-left transition hover:text-gold">
              Admin Panel
            </button>
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg text-gold">Visit Us</h4>
          <div className="mt-4 grid gap-3 text-sm">
            <button onClick={() => window.open(MAP_LINK, "_blank", "noopener")} className="flex gap-2 text-left transition hover:text-gold">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> Chandni Chowk, Mirpurkhas, Sindh
            </button>
            <button onClick={call} className="flex gap-2 text-left transition hover:text-gold">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> 0343 8276211
            </button>
            <span className="flex gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> Daily 11:00 AM – 1:00 AM
              <br />
            </span>
            <span className="pl-6 text-xs text-cream/50">Reception open 24 hours for room guests</span>
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg text-gold">Newsletter</h4>
          <p className="mt-4 text-sm">Deals, new dishes and Ramadan specials — once a month, no spam.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!/^\S+@\S+\.\S+$/.test(email)) return push("Enter a valid email address", "error");
              setEmail("");
              push("Subscribed! Welcome to the Taukal family.");
            }}
            className="mt-4 flex overflow-hidden rounded-full border border-gold/30 bg-white/5"
          >
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
              placeholder="you@email.com"
              className="w-full bg-transparent px-4 py-2.5 text-sm text-cream outline-none placeholder:text-cream/40"
            />
            <button type="submit" aria-label="Subscribe" className="grid w-12 place-items-center bg-gold text-ink">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/5 px-5 py-5 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} Cafe Taukal, Mirpurkhas. All rights reserved. Crafted with care in Sindh.
      </div>
    </footer>
  );
}

function Floating() {
  const [top, setTop] = useState(false);
  useEffect(() => {
    const f = () => setTop(window.scrollY > 500);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {top && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll to top"
            className="grid h-11 w-11 place-items-center rounded-full border border-gold/40 bg-ink/80 text-gold backdrop-blur"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
      <button
        onClick={() => openWhatsApp("Assalam-o-Alaikum Cafe Taukal! I would like to place an order.")}
        aria-label="Order on WhatsApp"
        className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-semibold text-white shadow-xl shadow-[#25D366]/30 transition hover:scale-105"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
          <path d="M20.5 3.5A11.9 11.9 0 0 0 2.1 18L1 23l5.2-1.1A12 12 0 1 0 20.5 3.5Zm-8.4 18.1a10 10 0 0 1-5.1-1.4l-.4-.2-3 .6.6-3-.2-.4a10 10 0 1 1 8.1 4.4Zm5.5-7.4c-.3-.2-1.8-.9-2-1s-.5-.1-.7.2-.8 1-1 1.2-.4.2-.7 0a8.2 8.2 0 0 1-2.4-1.5 9 9 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6.3-.5v-.5c0-.2-.7-1.7-1-2.3s-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.8.4 3.4 3.4 0 0 0-1.1 2.6A6 6 0 0 0 7.9 13a13.5 13.5 0 0 0 5.2 4.6c.7.3 1.3.5 1.7.6a4.1 4.1 0 0 0 1.9.1 3.1 3.1 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.2-.3-.3-.6-.4Z" />
        </svg>
        <span className="hidden text-sm sm:block">WhatsApp Order</span>
      </button>
    </div>
  );
}

function Toasts() {
  const toasts = useToast((s) => s.toasts);
  return (
    <div className="fixed left-1/2 top-24 z-[70] flex -translate-x-1/2 flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-full px-5 py-2.5 text-sm font-medium shadow-xl ${
              t.kind === "error" ? "bg-maroon text-white" : "bg-gold text-ink"
            }`}
          >
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function CookieBanner() {
  const { cookieOk, acceptCookie } = useUI();
  if (cookieOk) return null;
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-4 left-4 z-40 max-w-sm rounded-2xl border border-gold/30 bg-ink/95 p-4 text-sm text-cream/80 shadow-2xl backdrop-blur"
    >
      We use cookies to remember your cart and preferences. No tracking, no nonsense.
      <button onClick={acceptCookie} className="mt-3 w-full rounded-full bg-gold py-2 text-xs font-semibold text-ink">
        Got it
      </button>
    </motion.div>
  );
}

export default function Layout() {
  const dark = useUI((s) => s.dark);
  const lang = useUI((s) => s.lang);
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  useEffect(() => {
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
    document.documentElement.lang = lang === "ur" ? "ur" : "en";
  }, [lang]);
  useEffect(() => window.scrollTo({ top: 0 }), [pathname]);

  return (
    <div className="min-h-screen bg-cream text-ink dark:bg-ink dark:text-cream">
      <Navbar />
      <main className="min-h-[60vh]">
        <Outlet />
      </main>
      <Footer />
      <Floating />
      <Toasts />
      <CookieBanner />
      <CartDrawer />
    </div>
  );
}
