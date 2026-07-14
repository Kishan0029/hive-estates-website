import { createFileRoute, Link } from "@tanstack/react-router";
import { SearchBar } from "@/components/SearchBar";
import { PropertyGrid, Section } from "@/components/Section";
import { LOCALITIES, PROPERTIES, HIVE_PHONE_DISPLAY } from "@/lib/data";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const featuredHomes = PROPERTIES.filter((p) => p.category === "home" && p.featured).slice(0, 4);
  const featuredLand  = PROPERTIES.filter((p) => p.category === "land" && p.featured).slice(0, 4);
  const latestHomes   = PROPERTIES.filter((p) => p.category === "home").slice(0, 4);
  const latestLand    = PROPERTIES.filter((p) => p.category === "land").slice(0, 4);

  return (
    <>
      {/* HERO — pure white, NoBroker inspired */}
      <section className="bg-background">
        <div className="container-p mx-auto max-w-7xl pt-12 md:pt-20 pb-10">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest">Belagavi · Karnataka</p>
            <h1 className="mt-3 font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
              Find Hive Verified property in Belagavi
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground">
              Buy land, apartments and bungalows directly from verified owners, agents and builders.
            </p>
          </div>

          {/* Category selector cards */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 max-w-4xl mx-auto">
            <Link to="/apartments" className="group rounded-2xl border-2 border-border hover:border-primary bg-card p-6 text-left shadow-card hover:shadow-elevated transition">
              <div className="flex items-start gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-xl bg-primary/10 text-primary text-2xl">🏢</div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-foreground">Apartments / Bungalows</h3>
                  <p className="text-sm text-muted-foreground mt-1">Ready-to-move homes across Belagavi</p>
                  <div className="mt-3 text-sm font-semibold text-primary group-hover:translate-x-1 transition">Browse homes →</div>
                </div>
              </div>
            </Link>
            <Link to="/land" className="group rounded-2xl border-2 border-border hover:border-primary bg-card p-6 text-left shadow-card hover:shadow-elevated transition">
              <div className="flex items-start gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-xl bg-success/10 text-success text-2xl">🌾</div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-foreground">Land</h3>
                  <p className="text-sm text-muted-foreground mt-1">NA and Non-NA plots in prime localities</p>
                  <div className="mt-3 text-sm font-semibold text-primary group-hover:translate-x-1 transition">Browse land →</div>
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-8 max-w-4xl mx-auto">
            <SearchBar />
            <div className="mt-4 flex flex-wrap gap-2 text-sm justify-center">
              <span className="text-muted-foreground">Popular:</span>
              {LOCALITIES.slice(0, 6).map((l) => (
                <Link key={l} to="/buy" search={{ q: l }} className="px-3 py-1 rounded-full bg-secondary text-primary hover:bg-primary hover:text-primary-foreground transition text-xs font-medium">
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container-p mx-auto max-w-7xl mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "📈", n: "200+", l: "Plots Sold" },
            { icon: "✓",  n: "100%", l: "Hive Verified Properties" },
            { icon: "🤝", n: "50+",  l: "Trusted Local Experts" },
            { icon: "⚡", n: "24×7", l: "Fast Property Assistance" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-border bg-card p-5 text-center shadow-card">
              <div className="text-2xl">{s.icon}</div>
              <div className="mt-2 font-display text-2xl font-bold text-primary">{s.n}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <Section title="Featured Land Listings" subtitle="Hand-picked plots across Belagavi" viewAll="/land">
        <PropertyGrid items={featuredLand.length ? featuredLand : latestLand} />
      </Section>

      <Section title="Featured Apartments & Bungalows" subtitle="Verified homes in prime localities" viewAll="/apartments">
        <PropertyGrid items={featuredHomes.length ? featuredHomes : latestHomes} />
      </Section>

      {/* LOCALITIES */}
      <Section title="Popular Localities in Belagavi">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {LOCALITIES.slice(0, 10).map((l) => (
            <Link key={l} to="/buy" search={{ q: l }} className="rounded-lg border border-border bg-card px-4 py-3 hover:border-primary hover:shadow-card transition">
              <div className="font-medium text-sm">{l}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Belagavi</div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Want to list your property */}
      <section className="container-p mx-auto max-w-7xl mt-20">
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-card">
          <div className="grid md:grid-cols-[1.1fr_1fr]">
            <div className="p-8 md:p-10">
              <div className="text-xs font-semibold text-primary uppercase tracking-widest">List with Hive Estate</div>
              <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold text-foreground">
                Want to list your property?
              </h2>
              <p className="mt-3 text-muted-foreground max-w-lg">
                Landowners and homeowners across Belagavi trust Hive Estate to reach genuine buyers. Free to list, Hive Verified badge included, personal assistance from our local team.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/post-property" className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-sm">
                  List Property
                </Link>
                <a
                  href={`https://wa.me/919000000000?text=${encodeURIComponent("Hello, I would like to list my property with Hive Estate. Please guide me through the process.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground hover:border-success hover:text-success"
                >
                  💬 WhatsApp
                </a>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">Prefer to call? {HIVE_PHONE_DISPLAY}</p>
            </div>

            <div className="bg-secondary p-8 md:p-10 border-t md:border-t-0 md:border-l border-border">
              <h3 className="font-semibold text-foreground">What you'll need to list</h3>
              <p className="text-xs text-muted-foreground mt-1">Common documents & details we'll ask for</p>
              <ul className="mt-4 grid grid-cols-1 gap-2 text-sm">
                {[
                  "Sale Deed / Title Deed",
                  "RTC / 7/12 Extract (where applicable)",
                  "Khata / Property Card",
                  "Mutation Records",
                  "Encumbrance Certificate (EC)",
                  "Approved Layout / Conversion Documents (if applicable)",
                  "Identity Proof of Owner",
                  "Address Proof",
                  "Latest Property Tax Receipt",
                  "Survey Number",
                  "Property Photographs",
                  "Location Details",
                  "Plot Dimensions",
                  "Road Access Details",
                  "Utility Availability (Water / Electricity)",
                  "Any applicable approvals",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-success text-success-foreground text-[10px] font-bold">✓</span>
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <Section title="Frequently asked questions">
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ["What does Hive Verified mean?", "Every property on Hive Estate is checked by our local team for genuine ownership, correct location, photos and pricing before it appears with the Hive Verified badge."],
            ["Is listing a property free?", "Yes. Owners and agents can list on Hive Estate at zero cost. We only charge for premium visibility packages if you choose them."],
            ["Do you cover only Belagavi?", "We currently focus exclusively on Belagavi city and the surrounding localities like Tilakwadi, Vadgaon, Shahapur, Machhe, Kanbargi and Kakati."],
            ["Do you help with land documentation?", "Yes, we can connect you with trusted legal advisors in Belagavi for title verification, RTC checks and NA conversion."],
          ].map(([q, a]) => (
            <details key={q} className="rounded-lg border border-border bg-card p-4 group">
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                {q}<span className="text-primary group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
