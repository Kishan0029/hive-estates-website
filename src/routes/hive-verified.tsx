import { createFileRoute, Link } from "@tanstack/react-router";
import { PROPERTIES, formatINR, telHref, waHrefFor, type Property } from "@/lib/data";
import { HiveVerifiedBadge } from "@/components/PropertyCard";
import { WhatsAppIcon } from "@/components/WhatsApp";

export const Route = createFileRoute("/hive-verified")({
  head: () => ({
    meta: [
      { title: "Hive Verified Properties — Belagavi's Most Trusted Listings" }, { property: 'og:title', content: "Hive Verified Properties — Belagavi's Most Trusted Listings" },
      {
        name: "description",
        content:
          "Browse only 100% Hive Verified properties in Belagavi. Every listing is checked for genuine ownership, accurate pricing and original photos by our local team.",
      },
    ],
  }),
  component: HiveVerifiedPage,
});

const Icon = ({ d }: { d: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

function HiveVerifiedPage() {
  const verified = PROPERTIES.filter((p) => p.hiveVerified);
  const land = verified.filter((p) => p.category === "land");
  const homes = verified.filter((p) => p.category === "home");

  return (
    <div className="bg-background min-h-screen">
      {/* HERO */}
      <div className="py-14 text-center" style={{ background: "#346022" }}>
        <HiveVerifiedBadge large />
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white mt-4">
          Hive Verified Properties
        </h1>
        <p className="mt-2 text-white/60 text-sm max-w-lg mx-auto">
          Every property here has been personally checked by our Belagavi team for genuine ownership, accurate pricing, original photos, and correct survey numbers.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          {[
            ["✓", "Genuine Ownership"],
            ["✓", "Accurate Pricing"],
            ["✓", "Original Photos"],
            ["✓", "Survey Verified"],
          ].map(([icon, label]) => (
            <span key={label} className="inline-flex items-center gap-1.5 text-white/70">
              <span className="text-accent font-bold">{icon}</span> {label}
            </span>
          ))}
        </div>
      </div>

      <div className="container-p mx-auto max-w-7xl py-14">
        {/* HOW IT WORKS */}
        <section className="mb-14">
          <h2 className="font-display text-2xl font-bold mb-8 text-center">How Hive Verification Works</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { step: "01", title: "Owner Submits", desc: "Owner or agent lists the property with documents." },
              { step: "02", title: "Team Reviews", desc: "Our local team verifies documents, ownership and photos." },
              { step: "03", title: "Site Visit", desc: "We conduct a physical visit to confirm location and dimensions." },
              { step: "04", title: "Badge Awarded", desc: "Only verified listings receive the Hive Verified badge." },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl border border-border bg-card p-6 text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-4 grid place-items-center font-bold text-sm text-white" style={{ background: "#346022" }}>
                  {s.step}
                </div>
                <h3 className="font-bold text-foreground text-sm">{s.title}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* VERIFIED LAND */}
        {land.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-xl font-bold">Verified Land & Plots</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{land.length} verified plots in Belagavi</p>
              </div>
              <Link to="/land" search={{ q: "" }} className="text-sm font-semibold text-primary hover:text-accent">
                View all →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {land.map((p) => <VerifiedCard key={p.id} p={p} />)}
            </div>
          </section>
        )}

        {/* VERIFIED HOMES */}
        {homes.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-xl font-bold">Verified Apartments & Bungalows</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{homes.length} verified homes in Belagavi</p>
              </div>
              <Link to="/apartments" search={{ q: "" }} className="text-sm font-semibold text-primary hover:text-accent">
                View all →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {homes.map((p) => <VerifiedCard key={p.id} p={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function VerifiedCard({ p }: { p: Property }) {
  return (
    <article className="group flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-border bg-card shadow-card hover:shadow-elevated hover:border-primary/30 transition">
      <Link
        to="/property/$id"
        params={{ id: p.id }}
        className="relative shrink-0 sm:w-52 h-44 sm:h-auto overflow-hidden bg-muted"
      >
        <img src={p.image} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
        <div className="absolute top-2 left-2">
          <HiveVerifiedBadge />
        </div>
        {p.featured && (
          <span className="absolute top-2 right-2 rounded bg-accent text-accent-foreground text-[9px] font-bold px-1.5 py-0.5">
            FEATURED
          </span>
        )}
      </Link>
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <Link to="/property/$id" params={{ id: p.id }} className="font-bold text-foreground hover:text-primary line-clamp-1">
            {p.title}
          </Link>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Icon d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
            {p.location}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {p.category === "home" && p.bhk && (
              <span className="rounded-full border border-border px-2.5 py-1">{p.bhk} BHK</span>
            )}
            <span className="rounded-full border border-border px-2.5 py-1">{p.area} sqft</span>
            <span className="rounded-full border border-border px-2.5 py-1">{p.propertyType}</span>
            {p.land?.naStatus && (
              <span className="rounded-full border border-primary/20 bg-primary/5 text-primary px-2.5 py-1 font-medium">
                {p.land.naStatus}
              </span>
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-bold text-primary text-lg">{formatINR(p.price)}</p>
            {p.pricePerSqFt && <p className="text-xs text-muted-foreground">₹{p.pricePerSqFt}/sqft</p>}
          </div>
          <div className="flex gap-2">
            <a href={telHref} className="rounded-lg bg-accent px-3 py-2 text-xs font-bold text-accent-foreground hover:opacity-90 transition">
              Call
            </a>
            <a href={waHrefFor(p)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-success px-3 py-2 text-xs font-bold text-success-foreground hover:opacity-90 transition">
              <WhatsAppIcon className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
