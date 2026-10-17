import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Users, Maximize, Check, CalendarDays } from "lucide-react";
import { ROOMS, type Room } from "../data/content";
import { PageHero, Reveal, SectionTitle, SmartImage } from "../components/UI";
import { rs, openWhatsApp, bookingMessage, useToast } from "../lib/utils";
import { useData } from "../store/useStore";

function Slider({ room }: { room: Room }) {
  const [i, setI] = useState(0);
  const n = room.images.length;
  return (
    <div className="relative h-64 overflow-hidden md:h-full md:min-h-[320px]">
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
          <SmartImage src={room.images[i]} alt={`${room.name} view ${i + 1}`} className="h-full w-full object-cover" />
        </motion.div>
      </AnimatePresence>
      <button aria-label="Previous image" onClick={() => setI((p) => (p - 1 + n) % n)}
        className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-cream"><ChevronLeft className="h-5 w-5" /></button>
      <button aria-label="Next image" onClick={() => setI((p) => (p + 1) % n)}
        className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-cream"><ChevronRight className="h-5 w-5" /></button>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {room.images.map((_, k) => <span key={k} className={`h-1.5 rounded-full ${k === i ? "w-6 bg-gold" : "w-1.5 bg-white/60"}`} />)}
      </div>
    </div>
  );
}

export default function Rooms() {
  const addBooking = useData((s) => s.addBooking);
  const push = useToast((s) => s.push);
  const today = new Date().toISOString().slice(0, 10);
  const [b, setB] = useState({ room: ROOMS[0].name, checkIn: today, checkOut: "", guests: 2, name: "", phone: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [done, setDone] = useState<number | null>(null);

  const nights = b.checkIn && b.checkOut ? Math.max(1, Math.round((+new Date(b.checkOut) - +new Date(b.checkIn)) / 86400000)) : 1;
  const rate = ROOMS.find((r) => r.name === b.room)?.price || 0;
  const total = rate * nights;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (b.name.trim().length < 3) er.name = "Enter your full name";
    if (!/^03\d{2}[- ]?\d{7}$/.test(b.phone.trim())) er.phone = "Enter a valid phone e.g. 03438276211";
    if (!b.checkOut || new Date(b.checkOut) <= new Date(b.checkIn)) er.checkOut = "Check-out must be after check-in";
    setErr(er);
    if (Object.keys(er).length) return push("Please check the booking form", "error");
    const booking = addBooking({ ...b, total });
    openWhatsApp(bookingMessage(booking));
    setDone(booking.id);
    push(`Booking #${booking.id} created — confirm on WhatsApp`);
  };

  const inputCls = (k: string) =>
    `w-full rounded-xl border bg-white/70 px-4 py-3 text-sm outline-none focus:border-gold dark:bg-white/5 ${err[k] ? "border-red-400" : "border-gold/25"}`;

  return (
    <>
      <PageHero title="Rooms & Suites" sub="Eighteen air-conditioned rooms above the restaurant — rest, room service and reception open 24 hours."
        image="https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=75" />

      <section className="bg-cream py-20 dark:bg-ink">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionTitle kicker="Accommodation" title={<>Choose your <span className="gold-text">stay</span></>}
            sub="All rates include taxes, Wi-Fi and complimentary morning chai." />
          <div className="grid gap-8">
            {ROOMS.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.06}>
                <article className="grid overflow-hidden rounded-3xl border border-gold/20 bg-white/70 shadow-sm dark:bg-white/5 md:grid-cols-2">
                  <Slider room={r} />
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-3xl">{r.name} <span className="text-base opacity-50">{r.urdu}</span></h3>
                      <p className="font-display text-2xl font-bold text-gold">{rs(r.price)}<span className="text-sm opacity-60">/night</span></p>
                    </div>
                    <div className="mt-3 flex gap-5 text-sm opacity-70">
                      <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-gold" />Up to {r.guests} guests</span>
                      <span className="flex items-center gap-1.5"><Maximize className="h-4 w-4 text-gold" />{r.size}</span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed opacity-75">{r.desc}</p>
                    <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
                      {r.amenities.map((a) => (
                        <span key={a} className="flex items-center gap-2 opacity-80"><Check className="h-4 w-4 text-gold" />{a}</span>
                      ))}
                    </div>
                    <button onClick={() => { setB({ ...b, room: r.name }); document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" }); }}
                      className="mt-7 w-full rounded-full bg-gold py-3.5 font-semibold text-ink transition hover:bg-gold-soft">
                      Book {r.name}
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="booking" className="bg-coal py-20 text-cream">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <SectionTitle light kicker="Reservation" title={<>Book your <span className="gold-text">room</span></>}
            sub="Fill the form and we'll confirm availability on WhatsApp within minutes." />
          {done ? (
            <div className="rounded-3xl border border-gold/30 bg-white/5 p-8 text-center">
              <CalendarDays className="mx-auto mb-4 h-12 w-12 text-gold" />
              <h3 className="font-display text-2xl">Booking #{done} received</h3>
              <p className="mt-2 text-sm text-cream/70">We've opened WhatsApp with your details — send the message so our reception can lock your room.</p>
              <button onClick={() => setDone(null)} className="mt-6 rounded-full border border-gold px-6 py-3 text-sm font-semibold text-gold">
                Make another booking
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 sm:grid-cols-2 sm:p-8">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs uppercase tracking-wider text-gold/80">Room Type</label>
                <select value={b.room} onChange={(e) => setB({ ...b, room: e.target.value })} className={inputCls("room") + " text-ink dark:text-cream"}>
                  {ROOMS.map((r) => <option key={r.id} className="text-ink">{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wider text-gold/80">Check-in</label>
                <input type="date" min={today} value={b.checkIn} onChange={(e) => setB({ ...b, checkIn: e.target.value })} className={inputCls("checkIn")} />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wider text-gold/80">Check-out</label>
                <input type="date" min={b.checkIn} value={b.checkOut} onChange={(e) => setB({ ...b, checkOut: e.target.value })} className={inputCls("checkOut")} />
                {err.checkOut && <p className="mt-1 text-xs text-red-400">{err.checkOut}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wider text-gold/80">Guests</label>
                <input type="number" min={1} max={8} value={b.guests} onChange={(e) => setB({ ...b, guests: +e.target.value })} className={inputCls("guests")} />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wider text-gold/80">Phone</label>
                <input value={b.phone} onChange={(e) => setB({ ...b, phone: e.target.value })} placeholder="03438276211" className={inputCls("phone")} />
                {err.phone && <p className="mt-1 text-xs text-red-400">{err.phone}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs uppercase tracking-wider text-gold/80">Full Name</label>
                <input value={b.name} onChange={(e) => setB({ ...b, name: e.target.value })} placeholder="Muhammad Ali" className={inputCls("name")} />
                {err.name && <p className="mt-1 text-xs text-red-400">{err.name}</p>}
              </div>
              <div className="flex items-center justify-between rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm sm:col-span-2">
                <span>{nights} night{nights > 1 ? "s" : ""} × {rs(rate)}</span>
                <strong className="text-gold">{rs(total)}</strong>
              </div>
              <button type="submit" className="rounded-full bg-gold py-3.5 font-semibold text-ink transition hover:bg-gold-soft sm:col-span-2">
                Confirm Booking
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
