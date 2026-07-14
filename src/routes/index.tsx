import { createFileRoute, Link } from "@tanstack/react-router";
import { SearchBar } from "@/components/SearchBar";
import { PropertyGrid, Section } from "@/components/Section";
import { LOCALITIES, PROPERTIES } from "@/lib/data";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const featuredHomes = PROPERTIES.filter((p) => p.category === "home" && p.featured).slice(0, 4);
  const featuredLand = PROPERTIES.filter((p) => p.category === "land" && p.featured).slice(0, 4);
  const latestHomes = PROPERTIES.filter((p) => p.category === "home").slice(0, 4);
  const latestLand = PROPERTIES.filter((p) => p.category === "land").slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="bg-background">
        <div className="container-p mx-auto max-w-6xl pt-12 md:pt-16 pb-10">

          {/* HEADLINE */}
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold text-foreground leading-tight tracking-tight">
              Find your perfect property in{" "}
              <span className="text-primary">Belagavi</span>
            </h1>
            <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto">
              Buy land, apartments and bungalows from verified owners and builders.
            </p>
          </div>

          {/* TRUST BADGES */}
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 items-center">
            {[
              { icon: "✓", label: "100% Hive Verified Properties", iconColor: "text-success", iconBg: "bg-success/15" },
              { icon: "🏠", label: "200+ Properties Sold", iconColor: "text-accent-foreground", iconBg: "bg-accent/25" },
            ].map((b) => (
              <div
                key={b.label}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-[13px] font-bold text-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default"
              >
                <span className={`flex h-5 w-5 items-center justify-center rounded-full ${b.iconBg} ${b.iconColor} text-[10px]`}>
                  {b.icon}
                </span>
                {b.label}
              </div>
            ))}
          </div>

          {/* SEARCH */}
          <div className="mt-8 max-w-2xl mx-auto">
            <SearchBar />
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-muted-foreground text-xs font-bold mr-1 uppercase tracking-wider">Popular:</span>
              {LOCALITIES.slice(0, 5).map((l) => (
                <Link
                  key={l}
                  to="/buy"
                  search={{ q: l }}
                  className="px-3 py-1.5 rounded-full border border-border bg-white text-muted-foreground hover:border-primary hover:text-primary hover:shadow-sm transition-all text-[11px] font-bold"
                >
                  {l}
                </Link>
              ))}
            </div>
          </div>

          {/* CATEGORY CARDS */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 max-w-3xl mx-auto">
            <Link
              to="/apartments"
              search={{ q: "" }}
              className="group relative rounded-2xl overflow-hidden border-2 border-transparent hover:border-accent shadow-card hover:shadow-elevated transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent z-10" />
              <img
                src="/apartment_hero.png"
                alt="Apartments and Bungalows in Belagavi"
                className="h-48 w-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 z-20 p-5">
                <span className="inline-block rounded-full bg-accent text-accent-foreground text-[10px] font-bold px-2.5 py-0.5 mb-1.5 tracking-wide uppercase">
                  Homes
                </span>
                <h3 className="font-display text-lg font-bold text-white">Apartments / Bungalows</h3>
                <p className="text-xs text-white/70 mt-0.5">Ready-to-move homes across Belagavi</p>
                <span className="mt-2 inline-block text-xs font-semibold text-accent group-hover:translate-x-1 transition">
                  Browse homes →
                </span>
              </div>
            </Link>

            <Link
              to="/land"
              search={{ q: "" }}
              className="group relative rounded-2xl overflow-hidden border-2 border-transparent hover:border-accent shadow-card hover:shadow-elevated transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=400&fit=crop&auto=format&q=80"
                alt="Land and Plots in Belagavi"
                className="h-48 w-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 z-20 p-5">
                <span className="inline-block rounded-full bg-primary text-white text-[10px] font-bold px-2.5 py-0.5 mb-1.5 tracking-wide uppercase">
                  Land
                </span>
                <h3 className="font-display text-lg font-bold text-white">Land & Plots</h3>
                <p className="text-xs text-white/70 mt-0.5">NA and Non-NA plots in prime localities</p>
                <span className="mt-2 inline-block text-xs font-semibold text-accent group-hover:translate-x-1 transition">
                  Browse land →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED LAND */}
      <Section title="Featured Land Listings" subtitle="Hand-picked plots across Belagavi" viewAll="/land">
        <PropertyGrid items={featuredLand.length ? featuredLand : latestLand} />
      </Section>

      {/* FEATURED HOMES */}
      <Section title="Featured Apartments & Bungalows" subtitle="Verified homes in prime localities" viewAll="/apartments">
        <PropertyGrid items={featuredHomes.length ? featuredHomes : latestHomes} />
      </Section>

      {/* LATEST */}
      <Section title="Latest Listings" subtitle="Fresh properties on the market" viewAll="/buy">
        <PropertyGrid items={[...latestHomes, ...latestLand].slice(0, 4)} />
      </Section>

      {/* LOCALITIES */}
      <Section title="Popular Localities" subtitle="Search by neighbourhood">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {LOCALITIES.slice(0, 10).map((l) => (
            <Link
              key={l}
              to="/buy"
              search={{ q: l }}
              className="rounded-xl border border-border bg-card px-3 py-3 sm:px-4 sm:py-4 hover:border-primary hover:shadow-card transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 grid place-items-center mb-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="font-semibold text-sm text-foreground">{l}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Belagavi</div>
            </Link>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section title="Frequently Asked Questions">
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ["What does Hive Verified mean?", "Every property on Hive Estate is checked by our local team for genuine ownership, correct location, photos and pricing before it gets the badge."],
            ["Is listing a property free?", "Yes. Owners and agents can list on Hive Estate at zero cost. We only charge for premium visibility packages if you choose them."],
            ["Do you cover only Belagavi?", "We currently focus exclusively on Belagavi city and surrounding localities like Tilakwadi, Vadgaon, Shahapur, Machhe, Kanbargi and Kakati."],
            ["Do you help with documentation?", "Yes, we can connect you with trusted legal advisors in Belagavi for title verification, RTC checks and NA conversion."],
          ].map(([q, a]) => (
            <details key={q} className="rounded-xl border border-border bg-card p-5 group cursor-pointer">
              <summary className="font-semibold list-none flex justify-between items-center gap-4">
                <span className="text-sm">{q}</span>
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary grid place-items-center group-open:bg-primary group-open:text-white transition text-base leading-none">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}


