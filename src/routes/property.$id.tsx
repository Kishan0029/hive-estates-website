import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { formatINR, getProperty, isVastuCompliant, PROPERTIES, telHref, waHrefFor, HIVE_PHONE_DISPLAY, type Property } from "@/lib/data";
import { PropertyGrid, Section } from "@/components/Section";
import { HiveVerifiedBadge } from "@/components/PropertyCard";

export const Route = createFileRoute("/property/$id")({
  loader: ({ params }): Property => {
    const p = getProperty(params.id);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} (${loaderData.id}) — Hive Estate` },
          { name: "description", content: loaderData.description.slice(0, 160) },
          { property: "og:title", content: `${loaderData.title} — Hive Estate` },
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
  const similar = PROPERTIES.filter((x) => x.id !== p.id && x.category === p.category).slice(0, 4);
  const monthly = calcEmi(emi.amount, emi.rate, emi.years);
  const vastu = isVastuCompliant(p.facing);

  return (
    <div className="container-p mx-auto max-w-7xl mt-6">
      {/* Listing number + verified banner */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="rounded-md bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 tracking-wide">
          Listing #{p.id}
        </span>
        <HiveVerifiedBadge large />
        {p.featured && <span className="rounded-md bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5">FEATURED</span>}
        {p.premium && <span className="rounded-md bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5">PREMIUM</span>}
        <span className="rounded-md bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1.5">{p.status}</span>
      </div>

      {/* GALLERY */}
      <div className="grid gap-3 md:grid-cols-[1fr_320px]">
        <div className="aspect-[16/10] overflow-hidden rounded-xl bg-muted">
          <img src={main} alt={p.title} className="h-full w-full object-cover" />
        </div>
        <div className="grid grid-cols-4 md:grid-cols-2 gap-2">
          {p.gallery.map((g) => (
            <button key={g} onClick={() => setMain(g)} className={`aspect-square overflow-hidden rounded-lg bg-muted border-2 ${main === g ? "border-primary" : "border-transparent"}`}>
              <img src={g} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{p.title}</h1>
          <p className="text-muted-foreground mt-1">{p.locality}, {p.city} · {p.subType}</p>

          <div className="mt-5 flex items-baseline gap-4">
            <span className="font-display text-3xl font-bold text-primary">{formatINR(p.price)}</span>
            {p.pricePerSqft && <span className="text-sm text-muted-foreground">₹{p.pricePerSqft}/sqft</span>}
          </div>

          {/* KEY SPECS */}
          {p.category === "home" ? (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                ["Area", `${p.area} sqft`],
                ["Bedrooms", p.bhk ? `${p.bhk} BHK` : "—"],
                ["Bathrooms", p.bathrooms ?? "—"],
                ["Parking", p.parking ?? 0],
                ["Facing", p.facing],
                ["Furnishing", p.furnishing ?? "—"],
                ["Age", p.age ?? "—"],
                ["Type", p.subType],
              ].map(([k, v]) => (
                <Spec key={k as string} k={k as string} v={v as string | number} />
              ))}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
              {p.land && [
                ["Property Type", p.subType],
                ["NA Status", p.land.naStatus],
                ["Plot Size", `${p.area} sqft`],
                ["Facing", p.facing],
                ["Approach Road Width", p.land.roadWidth],
                ["Road Type", p.land.roadType],
                ["Electricity", p.land.electricity ? "Available" : "Not Available"],
                ["Drainage / Gutters", p.land.drainage ? "Available" : "Not Available"],
                ["Water Connection", p.land.water ? "Available" : "Not Available"],
                ["Ownership", p.land.ownership],
                ["Survey Number", p.land.surveyNumber],
                ["Boundary", p.land.boundary ? "Present" : "Not Present"],
                ["Road Access", p.land.roadAccess ? "Yes" : "No"],
                ["Nearby Landmark", p.land.landmark],
                ["Price / sqft", p.pricePerSqft ? `₹ ${p.pricePerSqft}` : "—"],
              ].map(([k, v]) => (
                <Spec key={k as string} k={k as string} v={v as string} />
              ))}
            </div>
          )}

          {/* Vastu */}
          <div className="mt-4">
            {vastu ? (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-success text-success-foreground text-xs font-bold px-3 py-1.5">
                ✓ Vastu Compliant
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary text-muted-foreground text-xs font-bold px-3 py-1.5 border border-border">
                Not Vastu Compliant
              </span>
            )}
          </div>

          {/* DESCRIPTION */}
          <section className="mt-8">
            <h2 className="text-lg font-bold mb-2">About this property</h2>
            <p className="text-sm text-foreground/80 leading-relaxed">{p.description}</p>
          </section>

          {/* AMENITIES (homes only) */}
          {p.category === "home" && p.amenities.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-bold mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {p.amenities.map((a) => (
                  <span key={a} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm">✓ {a}</span>
                ))}
              </div>
            </section>
          )}

          {/* MAP placeholder */}
          <section className="mt-8">
            <h2 className="text-lg font-bold mb-3">Location on Map</h2>
            <div className="aspect-[16/8] rounded-xl border border-border bg-secondary grid place-items-center text-muted-foreground text-sm">
              📍 Google Map — {p.locality}, {p.city}
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

          {/* EMI (homes only) */}
          {p.category === "home" && (
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
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="lg:sticky lg:top-20 lg:self-start rounded-xl border border-border bg-card p-6 shadow-card space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Listing</div>
            <div className="font-display font-bold text-primary text-lg">#{p.id}</div>
            <div className="text-xs text-muted-foreground mt-2">Posted by <span className="font-semibold text-foreground">{p.postedBy}</span> · {p.postedDate}</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a href={telHref} className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:opacity-90">
              📞 Call
            </a>
            <a
              href={waHrefFor(p)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-success text-success-foreground py-2.5 text-sm font-semibold hover:opacity-90"
            >
              💬 WhatsApp
            </a>
          </div>
          <p className="text-xs text-muted-foreground text-center">{HIVE_PHONE_DISPLAY}</p>

          <form className="space-y-3 pt-3 border-t border-border" onSubmit={(e) => e.preventDefault()}>
            <input placeholder="Your Name" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            <input placeholder="Phone Number" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            <input placeholder="Email" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            <textarea rows={3} placeholder={`I'm interested in listing #${p.id}...`} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            <button className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground">Send Enquiry</button>
          </form>
          <Link to="/contact" className="block text-center text-xs text-primary font-semibold hover:underline">Schedule a site visit →</Link>
        </aside>
      </div>

      <Section title="Similar Properties" viewAll={p.category === "land" ? "/land" : "/apartments"}>
        <PropertyGrid items={similar} />
      </Section>
    </div>
  );
}

function Spec({ k, v }: { k: string; v: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="text-[11px] uppercase text-muted-foreground tracking-wide">{k}</div>
      <div className="font-semibold mt-1 text-sm">{v}</div>
    </div>
  );
}

function Slider({ label, min, max, value, onChange, step = 1 }: { label: string; min: number; max: number; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <label className="block">
      <div className="text-xs font-semibold text-muted-foreground mb-1">{label}</div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-primary" />
    </label>
  );
}

function calcEmi(p: number, r: number, y: number) {
  const n = y * 12;
  const m = r / 12 / 100;
  return Math.round((p * m * Math.pow(1 + m, n)) / (Math.pow(1 + m, n) - 1));
}
