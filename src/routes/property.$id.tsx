import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  formatINR,
  isVastuCompliant,
  telHref,
  waHrefFor,
  HIVE_PHONE_DISPLAY,
  type Property,
} from "@/lib/data";
import { PropertyGrid, Section } from "@/components/Section";
import { HiveVerifiedBadge } from "@/components/PropertyCard";
import { getPublicPropertyByIdFn, getPublicPropertiesFn } from "@/server-fns/public";
import { createInquiryFn } from "@/server-fns/properties";

export const Route = createFileRoute("/property/$id")({
  loader: async ({ params }) => {
    try {
      const p = await getPublicPropertyByIdFn({ data: { id: params.id } });
      const allProps = await getPublicPropertiesFn();
      const similar = allProps.filter((x: any) => x.id !== p.id && x.category === p.category).slice(0, 4);
      return { property: p, similar };
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.property.title} (#${loaderData.property.listingNumber}) — Hive Estate` },
          { name: "description", content: loaderData.property.description.slice(0, 160) },
          { property: "og:title", content: `${loaderData.property.title} — Hive Estate` },
          { property: "og:image", content: loaderData.property.image },
        ]
      : [{ title: "Property not found" }, { name: "robots", content: "noindex" }],
  }),
  component: Detail,
});

function Detail() {
  const data = Route.useLoaderData();
  const p = data.property as Property;
  const similar = data.similar as Property[];
  const [main, setMain] = useState(p.gallery[0]);
  const [emi, setEmi] = useState({ amount: p.price, rate: 8.5, years: 20 });
  const monthly = calcEmi(emi.amount, emi.rate, emi.years);
  const vastu = p.vastuCompliant;

  // Form State
  const [inquiry, setInquiry] = useState({ name: "", phone: "", email: "", message: `I'm interested in listing #${p.listingNumber}...` });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiry.name || !inquiry.phone) return alert("Please enter your name and phone number");
    setIsSubmitting(true);
    try {
      await createInquiryFn({
        data: {
          property_id: p.id,
          ...inquiry
        }
      });
      setSubmitted(true);
      setInquiry({ name: "", phone: "", email: "", message: "" });
    } catch (err: any) {
      alert("Failed to send inquiry: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-p mx-auto max-w-7xl mt-6">
      {/* Listing number + verified banner */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="rounded-md bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 tracking-wide">
          Listing #{p.listingNumber}
        </span>
        <HiveVerifiedBadge large />
        {p.featured && (
          <span className="rounded-md bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5">
            FEATURED
          </span>
        )}
        {p.premium && (
          <span className="rounded-md bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5">
            PREMIUM
          </span>
        )}
        <span className="rounded-md bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1.5">
          {p.status}
        </span>
      </div>

      {/* GALLERY */}
      <div className="grid gap-3 md:grid-cols-[1fr_320px]">
        <div className="aspect-[16/10] overflow-hidden rounded-xl bg-muted">
          <img src={main} alt={p.title} className="h-full w-full object-cover" />
        </div>
        <div className="grid grid-cols-4 md:grid-cols-2 gap-2">
          {p.gallery.map((g) => (
            <button
              key={g}
              onClick={() => setMain(g)}
              className={`aspect-square overflow-hidden rounded-lg bg-muted border-2 ${main === g ? "border-primary" : "border-transparent"}`}
            >
              <img src={g} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{p.title}</h1>
          <p className="text-muted-foreground mt-1">
            {p.addressLine ? p.addressLine : (p.land?.nearbyLandmarks || p.locality)} · {p.propertyType}
          </p>

          <div className="mt-5 flex items-baseline gap-4">
            {p.priceOnRequest ? (
              <span className="font-display text-4xl font-bold text-primary">
                Request Call
              </span>
            ) : (
              <>
                <span className="font-display text-4xl font-bold text-primary">
                  {p.priceOnRequest ? "Request Price" : `₹ ${formatINR(p.price)}`}
                </span>
                {p.pricePerSqFt && (
                  <span className="text-sm text-muted-foreground font-semibold">
                    ₹ {formatINR(p.pricePerSqFt)} / sqft
                  </span>
                )}
              </>
            )}
          </div>

          {p.category === "home" ? (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                ["Area", `${p.area} sqft`],
                ["Bedrooms", p.bhk ? `${p.bhk} BHK` : "—"],
                ["Bathrooms", p.bathrooms ?? "—"],
                ["Parking", p.parking ?? 0],
                ["Facing", p.facingDirection ?? "—"],
                ["Furnishing", p.furnishing ?? "—"],
                ["Age", p.age ?? "—"],
                ["Type", p.propertyType],
              ].map(([k, v]) => (
                <Spec key={k as string} k={k as string} v={v as string | number} />
              ))}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
              {p.land &&
                [
                  ["Property Type", p.propertyType],
                  ["Dimensions", p.dimensions || "—"],
                  ["Layout Name", p.layoutName || "—"],
                  ["Plot Size", p.land.plotSize],
                  ["Facing", p.land.facingDirection],
                  ["Electricity", p.land.electricity ? "Available" : "Not Available"],
                  ["Drainage / Gutters", p.land.drainage ? "Available" : "Not Available"],
                  ["Water Connection", p.land.waterConnection ? "Available" : "Not Available"],
                  ["Approvals", p.land.approvals ? p.land.approvals : "None"],
                  ["Survey Number", p.land.surveyNumber],
                  ["Nearby Landmark", p.land.nearbyLandmarks],
                  ["Price / sqft", p.pricePerSqFt ? `₹ ${p.pricePerSqFt}` : (p.priceOnRequest ? "Request Call" : "—")],
                  ["Road Width", p.land.roadWidth ? `${p.land.roadWidth} feet` : "—"],
                ].map(([label, val]) => <Spec key={label as string} k={label as string} v={val as string} />)}
            </div>
          )}

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

          {/* FINANCE & LOANS */}
          {p.approvedBanks && (
            <section className="mt-8 rounded-xl border border-success/30 bg-success/5 p-6">
              <h2 className="text-lg font-bold text-success mb-2 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                Finance & Bank Approvals
              </h2>
              <p className="text-sm text-foreground/90">
                This property is approved for loans by: <span className="font-bold text-foreground">{p.approvedBanks}</span>
              </p>
            </section>
          )}

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
                  <span
                    key={a}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-sm"
                  >
                    ✓ {a}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* MAP placeholder */}
          {p.addressLine && (
            <section className="mt-8">
              <h2 className="text-lg font-bold mb-3">Location on Map</h2>
              <div className="aspect-[16/8] rounded-xl border border-border bg-secondary grid place-items-center text-muted-foreground text-sm">
                📍 Google Map — {p.latitude}, {p.longitude}
              </div>
            </section>
          )}

          {/* NEARBY */}
          {(p.schools || p.hospitals || p.shopping || p.connectivity) && (
            <section className="mt-8">
              <h2 className="text-lg font-bold mb-3">What's nearby</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Schools", p.schools],
                  ["Hospitals", p.hospitals],
                  ["Shopping", p.shopping],
                  ["Connectivity", p.connectivity],
                ].filter(([_, v]) => !!v).map(([k, v]) => (
                  <div key={k as string} className="rounded-lg border border-border bg-card p-4">
                    <div className="font-semibold text-sm">{k as string}</div>
                    <div className="text-xs text-muted-foreground mt-1">{v as string}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EMI (homes only) */}
          {p.category === "home" && (
            <section className="mt-8 rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold">EMI Calculator</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <Slider
                  label={`Loan Amount: ${formatINR(emi.amount)}`}
                  min={500000}
                  max={p.price * 1.2}
                  value={emi.amount}
                  onChange={(v) => setEmi({ ...emi, amount: v })}
                  step={100000}
                />
                <Slider
                  label={`Interest: ${emi.rate}%`}
                  min={6}
                  max={12}
                  step={0.1}
                  value={emi.rate}
                  onChange={(v) => setEmi({ ...emi, rate: v })}
                />
                <Slider
                  label={`Tenure: ${emi.years} yrs`}
                  min={5}
                  max={30}
                  value={emi.years}
                  onChange={(v) => setEmi({ ...emi, years: v })}
                />
              </div>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-sm text-muted-foreground">Monthly EMI:</span>
                <span className="font-display text-2xl font-bold text-primary">
                  ₹ {monthly.toLocaleString("en-IN")}
                </span>
              </div>
            </section>
          )}

          {/* TAGS */}
          {p.tags && p.tags.length > 0 && (
            <section className="mt-8 pt-6 border-t border-border">
              <h2 className="text-lg font-bold mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-secondary text-secondary-foreground px-3 py-1.5 text-xs font-semibold"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="lg:sticky lg:top-20 lg:self-start rounded-xl border border-border bg-card p-6 shadow-card space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Listing</div>
            <div className="font-display font-bold text-primary text-lg">#{p.listingNumber}</div>
            <div className="text-xs text-muted-foreground mt-2">
              Posted by <span className="font-semibold text-foreground">{p.postedBy}</span> ·{" "}
              {p.postedDate}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={telHref}
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-accent text-accent-foreground py-2.5 text-sm font-bold hover:opacity-90"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l2.02-1.29a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z" />
              </svg>{" "}
              Call
            </a>
            <a
              href={waHrefFor(p)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-success text-success-foreground py-2.5 text-sm font-semibold hover:opacity-90"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>{" "}
              WhatsApp
            </a>
          </div>
          <p className="text-xs text-muted-foreground text-center">{HIVE_PHONE_DISPLAY}</p>

          <form
            className="space-y-3 pt-3 border-t border-border"
            onSubmit={handleInquirySubmit}
          >
            {submitted ? (
              <div className="rounded-lg bg-success/10 border border-success/20 p-4 text-center">
                <p className="font-bold text-success text-sm">Inquiry Sent Successfully!</p>
                <p className="text-xs text-muted-foreground mt-1">Our agent will contact you shortly.</p>
              </div>
            ) : (
              <>
                <input
                  required
                  value={inquiry.name}
                  onChange={e => setInquiry(i => ({ ...i, name: e.target.value }))}
                  placeholder="Your Name *"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary outline-none transition-colors"
                />
                <input
                  required
                  value={inquiry.phone}
                  onChange={e => setInquiry(i => ({ ...i, phone: e.target.value }))}
                  placeholder="Phone Number *"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary outline-none transition-colors"
                />
                <input
                  value={inquiry.email}
                  onChange={e => setInquiry(i => ({ ...i, email: e.target.value }))}
                  placeholder="Email (Optional)"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary outline-none transition-colors"
                />
                <textarea
                  rows={3}
                  value={inquiry.message}
                  onChange={e => setInquiry(i => ({ ...i, message: e.target.value }))}
                  placeholder={`I'm interested in listing #${p.listingNumber}...`}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary outline-none transition-colors"
                />
                <button 
                  disabled={isSubmitting}
                  className="w-full rounded-md bg-accent py-2.5 text-sm font-bold text-accent-foreground disabled:opacity-50 transition-opacity"
                >
                  {isSubmitting ? "Sending..." : "Send Enquiry"}
                </button>
              </>
            )}
          </form>
          <Link
            to="/contact"
            className="block text-center text-xs text-primary font-semibold hover:underline"
          >
            Schedule a site visit →
          </Link>
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

function Slider({
  label,
  min,
  max,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <label className="block">
      <div className="text-xs font-semibold text-muted-foreground mb-1">{label}</div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </label>
  );
}

function calcEmi(p: number, r: number, y: number) {
  const n = y * 12;
  const m = r / 12 / 100;
  return Math.round((p * m * Math.pow(1 + m, n)) / (Math.pow(1 + m, n) - 1));
}
