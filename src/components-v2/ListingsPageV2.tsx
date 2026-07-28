import { useState, useMemo } from "react"
import { PropertyCard } from "./PropertyCard"
import { SearchFilterModule } from "./SearchFilterModule"
import { type Property, searchProperties } from "@/lib/data"

type ListingsPageProps = {
  mode: "buy" | "apartments" | "land"
  initialQuery?: string
  preloadedData: Property[]
}

export function ListingsPageV2({ mode, initialQuery = "", preloadedData }: ListingsPageProps) {
  const [q, setQ] = useState(initialQuery)
  
  const title = mode === "apartments" ? "Apartments & Homes" : mode === "land" ? "Land & Plots" : "Properties for Sale"
  const subtitle = mode === "apartments" ? "Find your perfect home" : mode === "land" ? "Build your future" : "Explore all listings"

  const { primary, nearby, matchedLocality } = useMemo(() => {
    return searchProperties(preloadedData, q)
  }, [preloadedData, q])

  return (
    <div className="min-h-screen bg-v2-mist pt-28 pb-20">
      <div className="container-p mx-auto max-w-7xl">
        
        {/* HEADER & SEARCH COMPACT */}
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-v2-ink mb-2">{title}</h1>
          <p className="text-lg text-v2-ink/60 mb-8">{subtitle}</p>
          
          <div className="max-w-3xl">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-v2-ink/50" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by locality, project name, or property type..."
                className="w-full rounded-2xl border border-v2-line bg-v2-paper pl-12 pr-4 py-4 text-base font-medium text-v2-ink outline-none focus:border-v2-green shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* RESULTS */}
        {primary.length === 0 && nearby.length === 0 ? (
          <div className="rounded-3xl border border-v2-line bg-v2-paper p-16 text-center shadow-sm">
            <h3 className="text-xl font-bold text-v2-ink mb-2">No properties found</h3>
            <p className="text-v2-ink/60">Try adjusting your search terms or browsing all listings.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {primary.length > 0 && (
              <div>
                {matchedLocality && <h2 className="text-2xl font-bold mb-6 font-display">Properties in {matchedLocality}</h2>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {primary.map((p) => <PropertyCard key={p.id} property={p} />)}
                </div>
              </div>
            )}

            {nearby.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 font-display">
                  Properties near {matchedLocality}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {nearby.map((p) => <PropertyCard key={p.id} property={p} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
