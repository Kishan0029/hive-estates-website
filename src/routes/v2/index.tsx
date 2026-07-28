import { createFileRoute } from "@tanstack/react-router"
import { SearchFilterModule } from "@/components-v2/SearchFilterModule"
import { Section } from "@/components-v2/Section"
import { PropertyCard } from "@/components-v2/PropertyCard"
import { LOCALITIES, type Property } from "@/lib/data"
import { getPublicPropertiesFn } from "@/server-fns/public"
import { Link } from "@tanstack/react-router"
import { Badge } from "@/components-v2/Badge"

export const Route = createFileRoute("/v2/")({
  loader: async () => {
    const properties = await getPublicPropertiesFn()
    return { properties }
  },
  component: HomeV2,
})

function HomeV2() {
  const { properties } = Route.useLoaderData()
  
  const p = properties as Property[]
  const featuredHomes = p.filter((x) => x.category === "home" && x.featured).slice(0, 4)
  const featuredLand = p.filter((x) => x.category === "land" && x.featured).slice(0, 4)
  const latestListings = p.slice(0, 4)

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] w-full flex flex-col items-center pt-32 pb-16">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2000&q=80"
            alt="Modern home exterior"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-v2-ink/40 backdrop-blur-[2px]"></div>
        </div>

        <div className="container-p relative z-10 w-full flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto mt-10">
          <Badge variant="verified" className="mb-6 px-4 py-1.5 text-sm">
            ✓ 100% Hive Verified Properties
          </Badge>
          
          <h1 className="font-display text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            Own Your World, <br /> One Property at a Time.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-medium">
            Search, compare, and verify premium land and homes in Belagavi with complete confidence.
          </p>

          <div className="w-full mt-12 sm:mt-16 -mb-32">
            <SearchFilterModule />
          </div>
        </div>
      </section>

      {/* Spacer to push content down below the overlapping search module */}
      <div className="h-32"></div>

      {/* CATEGORIES */}
      <Section title="Explore by Category" subtitle="Find what you're looking for">
        <div className="grid gap-6 sm:grid-cols-2">
          <Link
            to="/v2/apartments"
            className="group relative h-64 overflow-hidden rounded-3xl bg-v2-mist"
          >
            <img
              src="/apartment_hero.png"
              alt="Apartments and Homes"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-v2-ink/80 via-v2-ink/20 to-transparent" />
            <div className="absolute bottom-0 p-8">
              <h3 className="font-display text-3xl font-bold text-white mb-2">Homes</h3>
              <p className="text-white/80 font-medium">Apartments, Bungalows & Villas &rarr;</p>
            </div>
          </Link>
          <Link
            to="/v2/land"
            className="group relative h-64 overflow-hidden rounded-3xl bg-v2-mist"
          >
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"
              alt="Land and Plots"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-v2-ink/80 via-v2-ink/20 to-transparent" />
            <div className="absolute bottom-0 p-8">
              <h3 className="font-display text-3xl font-bold text-white mb-2">Land</h3>
              <p className="text-white/80 font-medium">NA & Non-NA Plots &rarr;</p>
            </div>
          </Link>
        </div>
      </Section>

      {/* FEATURED LAND */}
      {featuredLand.length > 0 && (
        <Section title="Featured Land Listings" viewAll="/v2/land" className="bg-v2-mist">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLand.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        </Section>
      )}

      {/* FEATURED HOMES */}
      {featuredHomes.length > 0 && (
        <Section title="Featured Homes" viewAll="/v2/apartments">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredHomes.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        </Section>
      )}
      
      {/* LATEST */}
      <Section title="Latest Listings" viewAll="/v2/buy" className="bg-v2-mist border-t border-v2-line">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestListings.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      </Section>

      {/* FAQ */}
      <Section title="Frequently Asked Questions" containerClassName="max-w-4xl">
        <div className="grid gap-4 mt-8">
          {[
            ["What does Hive Verified mean?", "Every property on Hive Estate is checked by our local team for genuine ownership, correct location, photos and pricing before it gets the badge."],
            ["Do you cover only Belagavi?", "We currently focus exclusively on Belagavi city and surrounding localities like Tilakwadi, Vadgaon, Shahapur, Machhe, Kanbargi and Kakati."],
            ["Do you help with documentation?", "Yes, we can connect you with trusted legal advisors in Belagavi for title verification, RTC checks and NA conversion."],
          ].map(([q, a]) => (
            <details key={q} className="group rounded-2xl border border-v2-line bg-v2-paper p-6 hover:border-v2-ink/20 transition-colors cursor-pointer">
              <summary className="font-semibold list-none flex justify-between items-center gap-4 text-v2-ink text-lg outline-none">
                {q}
                <span className="shrink-0 text-v2-green text-2xl leading-none group-open:rotate-45 transition-transform duration-300">+</span>
              </summary>
              <p className="mt-4 text-v2-ink/70 leading-relaxed text-base">{a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  )
}
