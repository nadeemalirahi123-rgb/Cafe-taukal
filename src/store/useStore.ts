import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuItem } from "../data/menu";

export type CartLine = { id: number; name: string; price: number; image: string; qty: number };

type CartState = {
  items: CartLine[];
  open: boolean;
  add: (item: MenuItem, qty?: number) => void;
  remove: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clear: () => void;
  setOpen: (v: boolean) => void;
  count: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      open: false,
      add: (item, qty = 1) =>
        set((s) => {
          const found = s.items.find((i) => i.id === item.id);
          if (found)
            return { items: s.items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i)) };
          return {
            items: [...s.items, { id: item.id, name: item.name, price: item.price, image: item.image, qty }],
          };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items: qty <= 0 ? s.items.filter((i) => i.id !== id) : s.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [] }),
      setOpen: (v) => set({ open: v }),
      count: () => get().items.reduce((a, b) => a + b.qty, 0),
      subtotal: () => get().items.reduce((a, b) => a + b.qty * b.price, 0),
    }),
    { name: "taukal-cart", partialize: (s) => ({ items: s.items }) as never }
  )
);

type UIState = {
  dark: boolean;
  lang: "en" | "ur";
  toggleDark: () => void;
  setLang: (l: "en" | "ur") => void;
  cookieOk: boolean;
  acceptCookie: () => void;
  admin: string | null;
  login: (u: string) => void;
  logout: () => void;
};

export const useUI = create<UIState>()(
  persist(
    (set) => ({
      dark: true,
      lang: "en",
      toggleDark: () => set((s) => ({ dark: !s.dark })),
      setLang: (lang) => set({ lang }),
      cookieOk: false,
      acceptCookie: () => set({ cookieOk: true }),
      admin: null,
      login: (u) => set({ admin: u }),
      logout: () => set({ admin: null }),
    }),
    { name: "taukal-ui" }
  )
);

export type Order = {
  id: number;
  name: string;
  phone: string;
  type: string;
  address?: string;
  table?: string;
  notes?: string;
  items: CartLine[];
  total: number;
  status: "Pending" | "Preparing" | "Delivered";
  createdAt: string;
};

export type Booking = {
  id: number;
  name: string;
  phone: string;
  room: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  createdAt: string;
};

type DataState = {
  orders: Order[];
  bookings: Booking[];
  addOrder: (o: Omit<Order, "id" | "createdAt" | "status">) => Order;
  setStatus: (id: number, s: Order["status"]) => void;
  addBooking: (b: Omit<Booking, "id" | "createdAt">) => Booking;
};

export const useData = create<DataState>()(
  persist(
    (set, get) => ({
      orders: [],
      bookings: [],
      addOrder: (o) => {
        const id = 1024 + get().orders.length;
        const order: Order = { ...o, id, status: "Pending", createdAt: new Date().toISOString() };
        set((s) => ({ orders: [order, ...s.orders] }));
        return order;
      },
      setStatus: (id, status) =>
        set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) })),
      addBooking: (b) => {
        const id = 501 + get().bookings.length;
        const booking: Booking = { ...b, id, createdAt: new Date().toISOString() };
        set((s) => ({ bookings: [booking, ...s.bookings] }));
        return booking;
      },
    }),
    { name: "taukal-data" }
  )
);
