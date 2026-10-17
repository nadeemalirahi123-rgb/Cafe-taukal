import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, CheckCircle2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart, useData, type Order } from "../store/useStore";
import { rs, openWhatsApp, orderMessage, useToast } from "../lib/utils";
import { DELIVERY_FEE, FREE_DELIVERY_OVER } from "../data/menu";

type Form = { name: string; phone: string; address: string; type: string; table: string; notes: string };

export default function CartDrawer() {
  const { items, open, setOpen, setQty, remove, clear, subtotal } = useCart();
  const addOrder = useData((s) => s.addOrder);
  const push = useToast((s) => s.push);
  const nav = useNavigate();
  const [step, setStep] = useState<"cart" | "checkout" | "done">("cart");
  const [placed, setPlaced] = useState<Order | null>(null);
  const [f, setF] = useState<Form>({ name: "", phone: "", address: "", type: "Delivery", table: "", notes: "" });
  const [err, setErr] = useState<Record<string, string>>({});

  const sub = subtotal();
  const fee = f.type === "Delivery" && sub > 0 && sub < FREE_DELIVERY_OVER ? DELIVERY_FEE : 0;
  const total = sub + fee;

  const close = () => {
    setOpen(false);
    setTimeout(() => {
      if (step === "done") setStep("cart");
    }, 300);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (f.name.trim().length < 3) e.name = "Please enter your full name";
    if (!/^03\d{2}[- ]?\d{7}$/.test(f.phone.trim())) e.phone = "Enter a valid number e.g. 03438276211";
    if (f.type === "Delivery" && f.address.trim().length < 8) e.address = "Full delivery address required";
    if (f.type === "Dine-in" && !f.table.trim()) e.table = "Table number required";
    setErr(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = () => {
    if (!validate()) return push("Please fix the highlighted fields", "error");
    const order = addOrder({
      name: f.name, phone: f.phone, type: f.type, address: f.address, table: f.table,
      notes: f.notes, items, total,
    });
    setPlaced(order);
    openWhatsApp(orderMessage(order));
    clear();
    setStep("done");
    push(`Order #${order.id} placed — WhatsApp opened`);
  };

  const field = (k: keyof Form, label: string, placeholder: string, type = "text") => (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gold/80">{label}</label>
      <input
        type={type}
        value={f[k]}
        onChange={(e) => setF({ ...f, [k]: e.target.value })}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-white/5 px-4 py-2.5 text-sm outline-none transition focus:border-gold ${
          err[k] ? "border-red-400" : "border-white/15"
        }`}
      />
      {err[k] && <p className="mt-1 text-xs text-red-400">{err[k]}</p>}
    </div>
  );

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col border-l border-gold/20 bg-ink text-cream"
            role="dialog" aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h3 className="font-display text-xl text-gold">
                {step === "cart" ? "Your Order" : step === "checkout" ? "Checkout" : "Order Confirmed"}
              </h3>
              <button onClick={close} aria-label="Close cart" className="grid h-9 w-9 place-items-center rounded-full border border-white/15">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {step === "cart" && (
                items.length === 0 ? (
                  <div className="grid h-full place-items-center text-center text-cream/50">
                    <div>
                      <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-gold/50" />
                      <p>Your cart is empty.</p>
                      <button onClick={() => { close(); nav("/menu"); }} className="mt-4 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-ink">
                        Browse the menu
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {items.map((i) => (
                      <div key={i.id} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                        <img src={i.image} alt={i.name} loading="lazy" className="h-16 w-16 rounded-xl object-cover" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{i.name}</p>
                          <p className="text-xs text-gold">{rs(i.price)}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <button aria-label="Decrease" onClick={() => setQty(i.id, i.qty - 1)} className="grid h-7 w-7 place-items-center rounded-full border border-white/20"><Minus className="h-3 w-3" /></button>
                            <span className="w-6 text-center text-sm">{i.qty}</span>
                            <button aria-label="Increase" onClick={() => setQty(i.id, i.qty + 1)} className="grid h-7 w-7 place-items-center rounded-full border border-white/20"><Plus className="h-3 w-3" /></button>
                            <button aria-label="Remove" onClick={() => remove(i.id)} className="ml-auto text-red-400"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-gold">{rs(i.price * i.qty)}</span>
                      </div>
                    ))}
                  </div>
                )
              )}

              {step === "checkout" && (
                <div className="grid gap-4">
                  {field("name", "Full Name", "Muhammad Ali")}
                  {field("phone", "Phone", "03438276211", "tel")}
                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gold/80">Order Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Delivery", "Takeaway", "Dine-in"].map((t) => (
                        <button key={t} onClick={() => setF({ ...f, type: t })}
                          className={`rounded-xl border py-2 text-xs font-semibold transition ${f.type === t ? "border-gold bg-gold text-ink" : "border-white/15 text-cream/70"}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  {f.type === "Delivery" && field("address", "Delivery Address", "House #, Street, Area, Mirpurkhas")}
                  {f.type === "Dine-in" && field("table", "Table Number", "e.g. 12")}
                  {field("notes", "Notes (optional)", "Extra spicy, no onions…")}
                  <div className="rounded-xl border border-gold/30 bg-gold/10 p-3 text-xs text-cream/80">
                    Payment: <strong className="text-gold">Cash on Delivery</strong> — pay the rider or at the counter.
                  </div>
                </div>
              )}

              {step === "done" && placed && (
                <div className="grid gap-4 text-center">
                  <CheckCircle2 className="mx-auto h-14 w-14 text-gold" />
                  <h4 className="font-display text-2xl">Shukriya, {placed.name.split(" ")[0]}!</h4>
                  <p className="text-sm text-cream/70">
                    Order <strong className="text-gold">#{placed.id}</strong> received. We've opened WhatsApp with your order details — just hit send to confirm with our kitchen.
                  </p>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-sm">
                    {placed.items.map((i) => (
                      <div key={i.id} className="flex justify-between py-1 text-cream/80">
                        <span>{i.qty}x {i.name}</span><span>{rs(i.qty * i.price)}</span>
                      </div>
                    ))}
                    <div className="mt-2 flex justify-between border-t border-white/10 pt-2 font-semibold text-gold">
                      <span>Total</span><span>{rs(placed.total)}</span>
                    </div>
                  </div>
                  <button onClick={() => { close(); nav("/track/" + placed.id); }} className="rounded-full bg-gold py-3 text-sm font-semibold text-ink">
                    Track Order
                  </button>
                  <button onClick={() => openWhatsApp(orderMessage(placed))} className="rounded-full border border-gold/40 py-3 text-sm font-semibold text-gold">
                    Re-open WhatsApp
                  </button>
                </div>
              )}
            </div>

            {step !== "done" && items.length > 0 && (
              <div className="border-t border-white/10 px-5 py-4">
                <div className="mb-1 flex justify-between text-sm text-cream/70"><span>Subtotal</span><span>{rs(sub)}</span></div>
                <div className="mb-1 flex justify-between text-sm text-cream/70">
                  <span>Delivery</span><span>{fee === 0 ? "Free" : rs(fee)}</span>
                </div>
                <div className="mb-3 flex justify-between text-lg font-semibold text-gold"><span>Total</span><span>{rs(total)}</span></div>
                {step === "cart" ? (
                  <button onClick={() => setStep("checkout")} className="w-full rounded-full bg-gold py-3 font-semibold text-ink transition hover:bg-gold-soft">
                    Proceed to Checkout
                  </button>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => setStep("cart")} className="rounded-full border border-white/20 py-3 text-sm">Back</button>
                    <button onClick={placeOrder} className="col-span-2 rounded-full bg-gold py-3 font-semibold text-ink transition hover:bg-gold-soft">
                      Place Order
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
