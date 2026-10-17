import { create } from "zustand";
import { WHATSAPP } from "../data/menu";
import type { CartLine, Order, Booking } from "../store/useStore";

export const rs = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;

export const openWhatsApp = (msg: string) =>
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");

export const call = () => {
  window.location.href = "tel:+923438276211";
};

export const orderMessage = (o: Order) => {
  const lines = o.items
    .map((i: CartLine) => `${i.qty}x ${i.name} - Rs ${i.qty * i.price}`)
    .join("\n");
  return `🍽️ *New Order - Cafe Taukal*
Order #: ${o.id}
Name: ${o.name}
Phone: ${o.phone}
Type: ${o.type}
${o.type === "Dine-in" ? `Table: ${o.table || "-"}` : `Address: ${o.address || "-"}`}
------------------
${lines}
------------------
Total: Rs ${o.total}
Notes: ${o.notes || "-"}`;
};

export const bookingMessage = (b: Booking) => `🏨 *New Room Booking - Cafe Taukal*
Booking #: ${b.id}
Name: ${b.name}
Phone: ${b.phone}
Room: ${b.room}
Check-in: ${b.checkIn}
Check-out: ${b.checkOut}
Guests: ${b.guests}
------------------
Estimated Total: Rs ${b.total}`;

type Toast = { id: number; msg: string; kind: "success" | "error" };
type ToastState = { toasts: Toast[]; push: (msg: string, kind?: Toast["kind"]) => void; drop: (id: number) => void };

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  push: (msg, kind = "success") => {
    const id = Date.now() + Math.random();
    set((s) => ({ toasts: [...s.toasts, { id, msg, kind }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3200);
  },
  drop: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const T = {
  en: {
    order: "Order Now",
    book: "Book a Room",
    home: "Home",
    menu: "Menu",
    rooms: "Rooms",
    gallery: "Gallery",
    about: "About",
    contact: "Contact",
  },
  ur: {
    order: "آرڈر کریں",
    book: "کمرہ بک کریں",
    home: "ہوم",
    menu: "مینیو",
    rooms: "کمرے",
    gallery: "گیلری",
    about: "ہمارے بارے میں",
    contact: "رابطہ",
  },
} as const;
