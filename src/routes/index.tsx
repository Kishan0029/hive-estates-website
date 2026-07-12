import { createFileRoute, Link } from "@tanstack/react-router";
import { SearchBar } from "@/components/SearchBar";
import { PropertyGrid, Section } from "@/components/Section";
import { AGENTS_LIST, BLOGS, BUILDERS_LIST, LOCALITIES, PROPERTIES } from "@/lib/data";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const featured = PROPERTIES.filter((p) => p.featured).slice(0, 4);
  const premium = PROPERTIES.filter((p) => p.premium).slice(0, 4);
  const latest = PROPERTIES.slice(0, 8);
  const commercial = PROPERTIES.filter((p) => p.listing === "commercial").slice(0, 4);
  const rentals = PROPERTIES.filter((p) => p.listing === "rent").slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=1080&fit=crop&auto=format&q=70"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/70 to-primary/95" />
        </div>
        <div className="container-p mx-auto max-w-7xl pt-16 pb-24 md:pt-24 md:pb-32 text-primary-foreground">
          <p className="text-sm font-semibold text-accent uppercase tracking-widest">Belagavi · Karnataka</p>
          <h1 className="mt-3 font-display text-4xl md:text-6xl font-extrabold leading-tight max-w-3xl">
            Find your next home in the heart of Belagavi
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-xl">
            Explore verified apartments, villas, plots and commercial spaces from trusted owners, agents and builders.
          </p>
          <div className="mt-8">
            <SearchBar />
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            <span className="text-primary-foreground/70">Trending:</span>
            {LOCALITIES.slice(0, 6).map((l) => (
              <Link key={l} to="/buy" className="px-3 py-1 rounded-full bg-white/10 hover:bg-accent hover:text-accent-foreground transition">
                {l}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container-p mx-auto max-w-7xl -mt-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 rounded-2xl bg-card border border-border shadow-elevated p-6">
          {[
            ["10K+", "Verified Listings"],
            ["500+", "Trusted Agents"],
            ["120+", "Top Builders"],
            ["20+", "Belagavi Localities"],
          ].map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="font-display text-2xl md:text-3xl font-bold text-primary">{n}</div>
              <div className="text-xs text-muted-foreground mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <Section title="Featured Properties" subtitle="Handpicked homes across Belagavi" viewAll="/buy">
        <PropertyGrid items={featured} />
      </Section>

      {/* CATEGORY TILES */}
      <Section title="Explore by category">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { to: "/buy", label: "Buy a Home", desc: "Apartments & Villas", tint: "bg-primary text-primary-foreground" },
            { to: "/rent", label: "Rent", desc: "Flexible rentals", tint: "bg-accent text-accent-foreground" },
            { to: "/commercial", label: "Commercial", desc: "Offices & retail", tint: "bg-success text-success-foreground" },
            { to: "/plots", label: "Plots & Land", desc: "Residential plots", tint: "bg-foreground text-background" },
          ].map((c) => (
            <Link key={c.to} to={c.to} className={`rounded-xl p-6 ${c.tint} shadow-card hover:shadow-elevated transition group`}>
              <div className="text-lg font-semibold">{c.label}</div>
              <div className="text-sm opacity-80 mt-1">{c.desc}</div>
              <div className="mt-6 text-sm font-medium opacity-90 group-hover:translate-x-1 transition">Browse →</div>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Premium Listings" subtitle="Luxury properties in prime locations" viewAll="/buy">
        <PropertyGrid items={premium} />
      </Section>

      <Section title="Latest Listings" subtitle="Just added in Belagavi" viewAll="/buy">
        <PropertyGrid items={latest} />
      </Section>

      {/* LOCALITIES */}
      <Section title="Popular Localities in Belagavi">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {LOCALITIES.slice(0, 10).map((l) => (
            <Link key={l} to="/buy" className="rounded-lg border border-border bg-card px-4 py-3 hover:border-accent hover:shadow-card transition">
              <div className="font-medium text-sm">{l}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Belagavi</div>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Commercial Spaces" subtitle="Offices, retail and warehouses" viewAll="/commercial">
        <PropertyGrid items={commercial} />
      </Section>

      <Section title="Rental Properties" subtitle="Ready-to-move rentals" viewAll="/rent">
        <PropertyGrid items={rentals} />
      </Section>

      {/* BUILDERS */}
      <Section title="Top Builders in Belagavi" viewAll="/builders">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BUILDERS_LIST.slice(0, 4).map((b) => (
            <div key={b.id} className="rounded-xl border border-border bg-card overflow-hidden shadow-card hover:shadow-elevated transition">
              <div className="aspect-[4/3] bg-muted overflow-hidden">
                <img src={b.image} alt={b.name} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <div className="font-semibold">{b.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{b.projects} projects · ⭐ {b.rating}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* AGENTS */}
      <Section title="Top Agents in Belagavi" viewAll="/agents">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTS_LIST.slice(0, 3).map((a) => (
            <div key={a.id} className="rounded-xl border border-border bg-card p-5 flex gap-4 shadow-card">
              <img src={a.image} alt={a.name} className="h-16 w-16 rounded-full object-cover" loading="lazy" />
              <div className="flex-1">
                <div className="font-semibold">{a.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{a.experience} yrs · ⭐ {a.rating} · {a.deals} deals</div>
                <div className="text-xs text-muted-foreground">Specializes in {a.locality}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* HOME LOAN + POST PROPERTY CTA */}
      <section className="container-p mx-auto max-w-7xl mt-20 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-primary text-primary-foreground p-8">
          <div className="text-sm text-accent font-semibold uppercase tracking-widest">Home Loans</div>
          <h3 className="mt-3 text-2xl font-bold">Get pre-approved in minutes</h3>
          <p className="mt-2 text-primary-foreground/70 text-sm">Compare offers from leading banks. Calculate your EMI and check eligibility instantly.</p>
          <Link to="/contact" className="mt-6 inline-flex rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground">Explore Loans</Link>
        </div>
        <div className="rounded-2xl bg-accent text-accent-foreground p-8">
          <div className="text-sm font-semibold uppercase tracking-widest opacity-80">Sell / Rent Faster</div>
          <h3 className="mt-3 text-2xl font-bold">Post your property for free</h3>
          <p className="mt-2 text-accent-foreground/80 text-sm">Reach thousands of buyers and tenants across Belagavi. Free listing, verified badge included.</p>
          <Link to="/post-property" className="mt-6 inline-flex rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Post Now</Link>
        </div>
      </section>

      {/* BLOGS */}
      <Section title="Property Guides & Blogs" viewAll="/blogs">
        <div className="grid gap-5 md:grid-cols-3">
          {BLOGS.map((b) => (
            <article key={b.id} className="rounded-xl border border-border bg-card overflow-hidden shadow-card hover:shadow-elevated transition">
              <div className="aspect-[16/10] bg-muted overflow-hidden">
                <img src={b.image} alt={b.title} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="p-5">
                <div className="text-xs text-muted-foreground">{b.date}</div>
                <h3 className="mt-1 font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{b.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section title="What our customers say">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { n: "Anita Kulkarni", r: "Found our 3BHK in Tilakwadi in under two weeks. Verified listings saved us so much time.", loc: "Home Buyer" },
            { n: "Rakesh Shetty", r: "Great platform for commercial spaces. Got quality leads within days of listing.", loc: "Owner" },
            { n: "Mohan Rao", r: "Transparent process, professional agents. Highly recommend Hive Estate.", loc: "NRI Investor" },
          ].map((t) => (
            <div key={t.n} className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="text-accent">★★★★★</div>
              <p className="mt-3 text-sm text-foreground/80">"{t.r}"</p>
              <div className="mt-4 text-sm"><span className="font-semibold">{t.n}</span> <span className="text-muted-foreground">· {t.loc}</span></div>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section title="Frequently asked questions">
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ["Is posting a property free?", "Yes, listing your property on Hive Estate is completely free for owners and agents."],
            ["How are properties verified?", "Our team physically or digitally verifies documents and photos before assigning a verified badge."],
            ["Do you cover only Belagavi?", "Currently we focus exclusively on Belagavi and surrounding localities."],
            ["Can I get home loan assistance?", "Yes, we connect you with leading banks and NBFCs for the best home loan offers."],
          ].map(([q, a]) => (
            <details key={q} className="rounded-lg border border-border bg-card p-4 group">
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                {q}<span className="text-accent group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
