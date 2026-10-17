import { useState } from "react";
import { MapPin, Phone, Clock, Mail, Send } from "lucide-react";
import { PageHero, Reveal, SectionTitle } from "../components/UI";
import { MAP_EMBED, MAP_LINK } from "../data/content";
import { call, openWhatsApp, useToast } from "../lib/utils";

export default function Contact() {
  const push = useToast((s) => s.push);
  const [f, setF] = useState({ name: "", phone: "", email: "", subject: "General Enquiry", message: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (f.name.trim().length < 3) er.name = "Please enter your name";
    if (!/^03\d{2}[- ]?\d{7}$/.test(f.phone.trim())) er.phone = "Valid Pakistani mobile required";
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) er.email = "Invalid email";
    if (f.message.trim().length < 10) er.message = "Tell us a little more (10+ characters)";
    setErr(er);
    if (Object.keys(er).length) return push("Please correct the form", "error");
    openWhatsApp(`📩 *Message - Cafe Taukal Website*\nName: ${f.name}\nPhone: ${f.phone}\nEmail: ${f.email || "-"}\nSubject: ${f.subject}\n------------------\n${f.message}`);
    setSent(true);
    push("Message ready on WhatsApp — hit send!");
  };

  const cls = (k: string) =>
    `w-full rounded-xl border bg-white/70 px-4 py-3 text-sm outline-none focus:border-gold dark:bg-white/5 ${err[k] ? "border-red-400" : "border-gold/25"}`;

  return (
    <>
      <PageHero title="Contact Us" sub="Questions, catering, bulk orders or event bookings — we reply fast."
        image="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=75" />

      <section className="bg-cream py-20 dark:bg-ink">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-5 md:px-8">
          <div className="md:col-span-2">
            <SectionTitle center={false} kicker="Reach Us" title={<>We're always <span className="gold-text">on the line</span></>} />
            <div className="grid gap-4">
              {[
                { icon: MapPin, t: "Address", d: "Chandni Chowk, Mirpurkhas, Sindh, Pakistan", action: () => window.open(MAP_LINK, "_blank", "noopener") },
                { icon: Phone, t: "Phone & WhatsApp", d: "0343 8276211", action: call },
                { icon: Clock, t: "Opening Hours", d: "Restaurant: 11:00 AM – 1:00 AM daily · Hotel reception: 24 hours" },
                { icon: Mail, t: "Email", d: "orders@cafetaukal.pk" },
              ].map((c) => (
                <Reveal key={c.t}>
                  <button onClick={c.action} disabled={!c.action}
                    className="flex w-full gap-4 rounded-2xl border border-gold/20 bg-white/70 p-5 text-left transition hover:border-gold dark:bg-white/5">
                    <c.icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <span>
                      <span className="block text-sm font-semibold">{c.t}</span>
                      <span className="block text-sm opacity-70">{c.d}</span>
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            {sent ? (
              <div className="grid h-full place-items-center rounded-3xl border border-gold/25 bg-white/70 p-10 text-center dark:bg-white/5">
                <div>
                  <Send className="mx-auto mb-4 h-12 w-12 text-gold" />
                  <h3 className="font-display text-2xl">Shukriya, {f.name.split(" ")[0]}!</h3>
                  <p className="mt-2 text-sm opacity-70">Your message is waiting in WhatsApp. Send it and our team will respond within the hour.</p>
                  <button onClick={() => { setSent(false); setF({ name: "", phone: "", email: "", subject: "General Enquiry", message: "" }); }}
                    className="mt-6 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink">Send another message</button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-4 rounded-3xl border border-gold/20 bg-white/70 p-6 dark:bg-white/5 sm:grid-cols-2 sm:p-8">
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wider text-gold">Name</label>
                  <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={cls("name")} placeholder="Muhammad Ali" />
                  {err.name && <p className="mt-1 text-xs text-red-500">{err.name}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wider text-gold">Phone</label>
                  <input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className={cls("phone")} placeholder="03438276211" />
                  {err.phone && <p className="mt-1 text-xs text-red-500">{err.phone}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wider text-gold">Email (optional)</label>
                  <input value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className={cls("email")} placeholder="you@email.com" />
                  {err.email && <p className="mt-1 text-xs text-red-500">{err.email}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wider text-gold">Subject</label>
                  <select value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })} className={cls("subject")}>
                    {["General Enquiry", "Table Reservation", "Room Booking", "Catering / Events", "Feedback"].map((s) => (
                      <option key={s} className="text-ink">{s}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs uppercase tracking-wider text-gold">Message</label>
                  <textarea rows={5} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} className={cls("message")}
                    placeholder="How can we help you?" />
                  {err.message && <p className="mt-1 text-xs text-red-500">{err.message}</p>}
                </div>
                <button type="submit" className="rounded-full bg-gold py-3.5 font-semibold text-ink transition hover:bg-gold-soft sm:col-span-2">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
        <div className="mx-auto mt-14 max-w-7xl px-5 md:px-8">
          <div className="overflow-hidden rounded-3xl border border-gold/20">
            <iframe title="Cafe Taukal map" src={MAP_EMBED} loading="lazy" className="h-[400px] w-full" />
          </div>
        </div>
      </section>
    </>
  );
}
