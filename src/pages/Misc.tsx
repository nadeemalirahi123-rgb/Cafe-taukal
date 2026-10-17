import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ChefHat, Bike, PackageCheck } from "lucide-react";
import { useData } from "../store/useStore";
import { rs } from "../lib/utils";

export function NotFound() {
  const nav = useNavigate();
  return (
    <section className="grid min-h-screen place-items-center bg-ink px-5 text-center text-cream">
      <div>
        <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="font-display text-[22vw] font-bold leading-none gold-text sm:text-[150px]">404</motion.p>
        <h1 className="font-display text-2xl sm:text-3xl">This plate isn't on our menu</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-cream/60">
          The page you were looking for has been moved or never existed. Let's get you back to the good stuff.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button onClick={() => nav("/")} className="rounded-full bg-gold px-7 py-3 font-semibold text-ink">Back to Home</button>
          <button onClick={() => nav("/menu")} className="rounded-full border border-gold/50 px-7 py-3 font-semibold text-gold">See the Menu</button>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { s: "Pending", icon: CheckCircle2, t: "Order received" },
  { s: "Preparing", icon: ChefHat, t: "In the kitchen" },
  { s: "Delivered", icon: PackageCheck, t: "Delivered / Served" },
];

export function TrackOrder() {
  const { id } = useParams();
  const nav = useNavigate();
  const order = useData((s) => s.orders.find((o) => String(o.id) === id));
  if (!order)
    return (
      <section className="grid min-h-[70vh] place-items-center bg-cream px-5 pt-32 text-center dark:bg-ink">
        <div>
          <h1 className="font-display text-3xl">Order not found</h1>
          <p className="mt-2 text-sm opacity-70">We couldn't find order #{id} on this device.</p>
          <button onClick={() => nav("/menu")} className="mt-6 rounded-full bg-gold px-7 py-3 font-semibold text-ink">Order again</button>
        </div>
      </section>
    );
  const active = STEPS.findIndex((s) => s.s === order.status);
  return (
    <section className="bg-cream px-5 pb-20 pt-36 dark:bg-ink">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Order Tracking</p>
        <h1 className="mt-2 font-display text-4xl">Order #{order.id}</h1>
        <p className="mt-1 text-sm opacity-60">{new Date(order.createdAt).toLocaleString()} · {order.type}</p>

        <div className="mt-10 flex items-center">
          {STEPS.map((s, i) => (
            <div key={s.s} className="flex flex-1 items-center">
              <div className="text-center">
                <div className={`grid h-12 w-12 place-items-center rounded-full border-2 ${i <= active ? "border-gold bg-gold text-ink" : "border-gold/30 text-gold/40"}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <p className={`mt-2 w-24 text-xs ${i <= active ? "text-gold" : "opacity-50"}`}>{s.t}</p>
              </div>
              {i < STEPS.length - 1 && <div className={`mx-1 h-0.5 flex-1 ${i < active ? "bg-gold" : "bg-gold/20"}`} />}
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-gold/20 bg-white/70 p-6 dark:bg-white/5">
          <div className="flex items-center gap-2 text-sm text-gold"><Bike className="h-4 w-4" /> Estimated 35 minutes within Mirpurkhas city</div>
          <div className="mt-4 grid gap-1 text-sm">
            {order.items.map((i) => (
              <div key={i.id} className="flex justify-between"><span>{i.qty}x {i.name}</span><span>{rs(i.qty * i.price)}</span></div>
            ))}
          </div>
          <div className="mt-3 flex justify-between border-t border-gold/20 pt-3 font-semibold text-gold">
            <span>Total</span><span>{rs(order.total)}</span>
          </div>
        </div>
        <button onClick={() => nav("/menu")} className="mt-8 rounded-full bg-gold px-7 py-3 font-semibold text-ink">Order something else</button>
      </div>
    </section>
  );
}
