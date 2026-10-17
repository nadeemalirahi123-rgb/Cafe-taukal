import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";

export function Reveal({ children, delay = 0, y = 28 }: { children: ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SmartImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <span className="relative block h-full w-full overflow-hidden">
      {!loaded && <span className="shimmer absolute inset-0 block" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`${className} transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </span>
  );
}

export function SectionTitle({
  kicker, title, sub, light = false, center = true,
}: { kicker?: string; title: ReactNode; sub?: string; light?: boolean; center?: boolean }) {
  return (
    <div className={`${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} mb-12`}>
      {kicker && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-gold">{kicker}</p>
      )}
      <h2 className={`font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl ${light ? "text-cream" : ""}`}>
        {title}
      </h2>
      {sub && <p className={`mt-4 text-sm leading-relaxed sm:text-base ${light ? "text-cream/70" : "opacity-70"}`}>{sub}</p>}
    </div>
  );
}

export function PageHero({ title, sub, image }: { title: string; sub: string; image: string }) {
  return (
    <section className="relative flex h-[58vh] min-h-[380px] items-center justify-center overflow-hidden">
      <motion.img
        initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: "easeOut" }}
        src={image} alt={title} className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/90" />
      <div className="relative z-10 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.8 }}
          className="font-display text-4xl font-bold text-cream sm:text-5xl md:text-6xl"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}
          className="mx-auto mt-4 max-w-xl text-sm text-cream/75 sm:text-base"
        >
          {sub}
        </motion.p>
      </div>
    </section>
  );
}
