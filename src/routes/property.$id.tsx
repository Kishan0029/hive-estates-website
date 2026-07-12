import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { formatINR, getProperty, PROPERTIES, type Property } from "@/lib/data";
import { PropertyGrid, Section } from "@/components/Section";

export const Route = createFileRoute("/property/$id")({
  loader: ({ params }): Property => {
    const p = getProperty(params.id);
    if (!p) throw notFound();
    return p;
  },

  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Hive Estate` },
          { name: "description", content: loaderData.description.slice(0, 160) },
          { property: "og:title", content: loaderData.title },
          { property: "og:image", content: loaderData.image },
        ]
      : [{ title: "Property not found" }, { name: "robots", content: "noindex" }],
  }),
  component: Detail,
});

function Detail() {
  const p = Route.useLoaderData() as Property;

  const [main, setMain] = useState(p.gallery[0]);
  const [emi, setEmi] = useState({ amount: p.price, rate: 8.5, years: 20 });
  const similar = PROPERTIES.filter((x) => x.id !== p.id && x.listing === p.listing).slice(0, 4);

  const monthly = calcEmi(emi.amount, emi.rate, emi.years);

  return (
    <div className="container-p mx-auto max-w-7xl mt-6">
      {/* GALLERY */}
      <div className="grid gap-3 md:grid-cols-[1fr_320px]">
        <div className="aspect-[16/10] overflow-hidden rounded-xl bg-muted">
          <img src={main} alt={p.title} className="h-full w-full object-cover" />
        </div>
        <div className="grid grid-cols-4 md:grid-cols-2 gap-2">
          {p.gallery.map((g) => (
            <button key={g} onClick={() => setMain(g)} className={`aspect-square overflow-hidden rounded-lg bg-muted border-2 ${main === g ? "border-accent" : "border-transparent"}`}>
              <img src={g} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      {/* HEADER */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {p.verified && <span className="rounded-md bg-success text-success-foreground text-xs font-semibold px-2 py-1">✓ VERIFIED</span>}
            {p.featured && <span className="rounded-md bg-accent text-accent-foreground text-xs font-semibold px-2 py-1">FEATURED</span>}
            <span className="rounded-md bg-secondary text-secondary-foreground text-xs font-semibold px-2 py-1">{p.status}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">{p.title}</h1>
          <p className="text-muted-foreground mt-1">{p.locality}, {p.city}</p>

          <div className="mt-5 flex items-baseline gap-4">
            <span className="font-display text-3xl font-bold text-primary">{formatINR(p.price)}{p.listing === "rent" && <span className="text-sm text-muted-foreground font-normal">/month</span>}</span>
            {p.pricePerSqft && <span className="text-sm text-muted-foreground">₹{p.pricePerSqft}/sqft</span>}
          </div>

          {/* KEY SPECS */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["Area", `${p.area} sqft`],
              ["Bedrooms", p.bhk ? `${p.bhk} BHK` : "—"],
              ["Bathrooms", p.bathrooms ?? "—"],
              ["Parking", p.parking ?? 0],
              ["Facing", p.facing ?? "—"],
              ["Furnishing", p.furnishing ?? "—"],
              ["Age", p.age ?? "—"],
              ["Type", p.type],
            ].map(([k, v]) => (
              <div key={k as string} className="rounded-lg border border-border bg-card p-3">
                <div className="text-[11px] uppercase text-muted-foreground tracking-wide">{k}</div>
                <div className="font-semibold mt-1">{v}</div>
              </div>
            ))}
          </div>

          {/* DESCRIPTION */}
          <section className="mt-8">
            <h2 className="text-lg font-bold mb-2">About this property</h2>
            <p className="text-sm text-foreground/80 leading-relaxed">{p.description}</p>
          </section>

          {/* AMENITIES */}
          <section className="mt-8">
            <h2 className="text-lg font-bold mb-3">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {p.amenities.map((a) => (
                <span key={a} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm">✓ {a}</span>
              ))}
            </div>
          </section>

          {/* NEARBY */}
          <section className="mt-8">
            <h2 className="text-lg font-bold mb-3">What's nearby</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Schools", "KLE School (0.8 km), Gogte School (1.2 km)"],
                ["Hospitals", "KLES Hospital (2 km), Belgaum Institute (1.5 km)"],
                ["Shopping", "Big Bazaar (1.1 km), City Market (0.9 km)"],
                ["Connectivity", "Railway Station (3 km), Bus Stand (2 km)"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-border bg-card p-4">
                  <div className="font-semibold text-sm">{k}</div>
                  <div className="text-xs text-muted-foreground mt-1">{v}</div>
                </div>
              ))}
            </div>
          </section>

          {/* EMI */}
          <section className="mt-8 rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">EMI Calculator</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <Slider label={`Loan Amount: ${formatINR(emi.amount)}`} min={500000} max={p.price * 1.2} value={emi.amount} onChange={(v) => setEmi({ ...emi, amount: v })} step={100000} />
              <Slider label={`Interest: ${emi.rate}%`} min={6} max={12} step={0.1} value={emi.rate} onChange={(v) => setEmi({ ...emi, rate: v })} />
              <Slider label={`Tenure: ${emi.years} yrs`} min={5} max={30} value={emi.years} onChange={(v) => setEmi({ ...emi, years: v })} />
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-sm text-muted-foreground">Monthly EMI:</span>
              <span className="font-display text-2xl font-bold text-primary">₹ {monthly.toLocaleString("en-IN")}</span>
            </div>
          </section>
        </div>

        {/* SIDEBAR */}
        <aside className="lg:sticky lg:top-20 lg:self-start rounded-xl border border-border bg-card p-6 shadow-card space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Posted by</div>
            <div className="font-semibold">{p.postedBy} · {p.builder}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{p.postedDate}</div>
          </div>
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            <input placeholder="Your Name" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            <input placeholder="Phone Number" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            <input placeholder="Email" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            <textarea rows={3} placeholder="I'm interested in this property..." className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            <button className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground">Contact Owner</button>
          </form>
          <div className="grid grid-cols-2 gap-2">
            <a href="tel:+919000000000" className="rounded-md bg-secondary py-2 text-center text-sm font-semibold text-secondary-foreground">Call</a>
            <a href="https://wa.me/919000000000" className="rounded-md bg-success py-2 text-center text-sm font-semibold text-success-foreground">WhatsApp</a>
          </div>
          <Link to="/contact" className="block text-center text-xs text-accent font-semibold hover:underline">Schedule a visit →</Link>
        </aside>
      </div>

      <Section title="Similar Properties" viewAll={`/${p.listing}`}>
        <PropertyGrid items={similar} />
      </Section>
    </div>
  );
}

function Slider({ label, min, max, value, onChange, step = 1 }: { label: string; min: number; max: number; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <label className="block">
      <div className="text-xs font-semibold text-muted-foreground mb-1">{label}</div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-accent" />
    </label>
  );
}

function calcEmi(p: number, r: number, y: number) {
  const n = y * 12;
  const m = r / 12 / 100;
  return Math.round((p * m * Math.pow(1 + m, n)) / (Math.pow(1 + m, n) - 1));
}
