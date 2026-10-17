import { useNavigate } from "react-router-dom";
import { Heart, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { TEAM, TIMELINE } from "../data/content";
import { PageHero, Reveal, SectionTitle, SmartImage } from "../components/UI";

const VALUES = [
  { icon: Heart, t: "Hospitality First", d: "Every guest is treated like family — from a single cup of chai to a full wedding booking." },
  { icon: Leaf, t: "Fresh, Never Frozen", d: "Meat and vegetables are sourced every morning from Mirpurkhas' local market." },
  { icon: ShieldCheck, t: "Honest Pricing", d: "No hidden charges. What you see on the menu is what you pay at the counter." },
  { icon: Sparkles, t: "Clean Kitchen", d: "Open kitchen policy — walk in and see how your food is prepared." },
];

export default function About() {
  const nav = useNavigate();
  return (
    <>
      <PageHero title="Our Story" sub="Seventeen years of charcoal, chai and Sindhi hospitality at Chandni Chowk."
        image="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=75" />

      <section className="bg-cream py-20 dark:bg-ink">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2 md:px-8">
          <Reveal>
            <div className="overflow-hidden rounded-[2rem] border border-gold/20">
              <SmartImage src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=75"
                alt="Cafe Taukal dining hall" className="h-[460px] w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <SectionTitle center={false} kicker="Who We Are"
              title={<>Built on charcoal smoke and <span className="gold-text">a stubborn recipe</span></>}
              sub="Cafe Taukal began as a chai stall where travellers stopped on the way to Umerkot. Word spread about the kababs, then the karahi, then the rooms. Today three kitchens run side by side — tandoor, desi and cafe — serving over 400 guests a day while the original chai recipe hasn't changed a gram." />
            <p className="text-sm leading-relaxed opacity-75">
              We cook with the same principle Taukal Sahab started with: buy fresh in the morning, grind the masala in-house, and never serve a plate you wouldn't put in front of your own family. That is why the same families have been eating here for three generations.
            </p>
            <button onClick={() => nav("/menu")} className="mt-7 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-ink">
              Taste the menu
            </button>
          </Reveal>
        </div>
      </section>

      <section className="bg-coal py-20 text-cream">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <SectionTitle light kicker="Milestones" title={<>Our <span className="gold-text">journey</span></>} />
          <div className="relative border-l border-gold/30 pl-8">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.05}>
                <div className="relative mb-10">
                  <span className="absolute -left-[41px] top-1 grid h-5 w-5 place-items-center rounded-full border-2 border-gold bg-ink">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  </span>
                  <p className="font-display text-2xl text-gold">{t.year}</p>
                  <h3 className="mt-1 text-lg font-semibold">{t.title}</h3>
                  <p className="mt-1 text-sm text-cream/65">{t.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-20 dark:bg-ink">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionTitle kicker="What We Stand For" title={<>Four promises, <span className="gold-text">every single plate</span></>} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.t} delay={i * 0.06}>
                <div className="h-full rounded-3xl border border-gold/20 bg-white/70 p-6 dark:bg-white/5">
                  <v.icon className="mb-3 h-7 w-7 text-gold" />
                  <h3 className="font-display text-xl">{v.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed opacity-70">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-coal py-20 text-cream">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionTitle light kicker="The Team" title={<>The people behind <span className="gold-text">the smoke</span></>} />
          <div className="grid gap-6 md:grid-cols-3">
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.08}>
                <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                  <div className="h-72 overflow-hidden">
                    <SmartImage src={m.img} alt={m.name} className="h-72 w-full object-cover transition duration-700 group-hover:scale-110" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl">{m.name}</h3>
                    <p className="text-xs uppercase tracking-wider text-gold">{m.role}</p>
                    <p className="mt-2 text-sm text-cream/65">{m.bio}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
