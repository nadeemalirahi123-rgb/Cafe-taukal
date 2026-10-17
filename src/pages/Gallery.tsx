import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { GALLERY, GALLERY_CATS } from "../data/content";
import { PageHero, SmartImage } from "../components/UI";

export default function Gallery() {
  const [cat, setCat] = useState("All");
  const [idx, setIdx] = useState<number | null>(null);
  const list = GALLERY.filter((g) => cat === "All" || g.cat === cat);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (idx === null) return;
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowRight") setIdx((i) => ((i as number) + 1) % list.length);
      if (e.key === "ArrowLeft") setIdx((i) => ((i as number) - 1 + list.length) % list.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, list.length]);

  return (
    <>
      <PageHero title="Gallery" sub="Charcoal smoke, warm interiors, happy families and rooms ready for guests."
        image="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1600&q=75" />

      <section className="bg-cream py-14 dark:bg-ink">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {GALLERY_CATS.map((c) => (
              <button key={c} onClick={() => { setCat(c); setIdx(null); }}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  cat === c ? "bg-gold text-ink" : "border border-gold/30 text-gold hover:bg-gold/10"}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
            {list.map((g, i) => (
              <motion.button key={g.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: (i % 8) * 0.04 }} onClick={() => setIdx(i)}
                aria-label={`Open ${g.alt}`}
                className="group mb-4 block w-full overflow-hidden rounded-2xl">
                <SmartImage src={g.src} alt={g.alt} className="w-full object-cover transition duration-700 group-hover:scale-110" />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {idx !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] grid place-items-center bg-black/95 p-4" role="dialog" aria-label="Image viewer">
            <button aria-label="Close" onClick={() => setIdx(null)} className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/20 text-cream"><X /></button>
            <button aria-label="Previous" onClick={() => setIdx((i) => ((i as number) - 1 + list.length) % list.length)}
              className="absolute left-4 grid h-12 w-12 place-items-center rounded-full border border-white/20 text-cream"><ChevronLeft /></button>
            <button aria-label="Next" onClick={() => setIdx((i) => ((i as number) + 1) % list.length)}
              className="absolute right-4 grid h-12 w-12 place-items-center rounded-full border border-white/20 text-cream"><ChevronRight /></button>
            <motion.img key={idx} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              src={list[idx].src} alt={list[idx].alt} className="max-h-[82vh] max-w-full rounded-2xl object-contain" />
            <p className="absolute bottom-6 text-sm text-cream/70">{list[idx].alt} — {idx + 1}/{list.length}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
