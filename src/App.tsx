import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import Home from "./pages/Home";

const MenuPage = lazy(() => import("./pages/MenuPage"));
const Rooms = lazy(() => import("./pages/Rooms"));
const Gallery = lazy(() => import("./pages/Gallery"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));
const Misc = lazy(() => import("./pages/Misc").then((m) => ({ default: m.NotFound })));
const Track = lazy(() => import("./pages/Misc").then((m) => ({ default: m.TrackOrder })));

function Preloader() {
  return (
    <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[100] grid place-items-center bg-ink">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7 }}
          className="mx-auto grid h-24 w-24 place-items-center rounded-full border-2 border-gold/50 font-display text-4xl font-bold text-gold"
        >
          T
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-5 font-display text-xl text-cream">Cafe <span className="gold-text">Taukal</span></motion.p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.4em] text-gold/70">Restaurant &amp; Hotel</p>
        <div className="mx-auto mt-6 h-0.5 w-40 overflow-hidden rounded bg-white/10">
          <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ repeat: Infinity, duration: 1.1 }}
            className="h-full w-1/2 bg-gold" />
        </div>
      </div>
    </motion.div>
  );
}

const Fallback = () => (
  <div className="grid min-h-screen place-items-center bg-ink">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
  </div>
);

export default function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1700);
    return () => clearTimeout(t);
  }, []);
  return (
    <BrowserRouter>
      <AnimatePresence>{loading && <Preloader />}</AnimatePresence>
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/track/:id" element={<Track />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Misc />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
