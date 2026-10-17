/**
 * Thin API client for the Express backend (server/).
 * The UI works fully offline (localStorage) and silently upgrades to the API
 * whenever VITE_API_URL is reachable — so the site never breaks for a customer.
 */
const BASE = (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL || "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const token = localStorage.getItem("taukal-token");
    const res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers || {}),
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null; // offline-first fallback
  }
}

export const api = {
  menu: () => request("/menu"),
  rooms: () => request("/rooms"),
  gallery: (cat?: string) => request(`/gallery${cat && cat !== "All" ? `?category=${cat}` : ""}`),
  createOrder: (body: unknown) => request("/orders", { method: "POST", body: JSON.stringify(body) }),
  getOrder: (id: number | string) => request(`/orders/${id}`),
  createBooking: (body: unknown) => request("/bookings", { method: "POST", body: JSON.stringify(body) }),
  sendMessage: (body: unknown) => request("/messages", { method: "POST", body: JSON.stringify(body) }),
  login: async (username: string, password: string) => {
    const r = await request<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    if (r?.token) localStorage.setItem("taukal-token", r.token);
    return r;
  },
};
