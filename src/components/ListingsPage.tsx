import { useMemo, useState } from "react";
import { PROPERTIES, searchProperties, type Category, type Property } from "@/lib/data";
import { PropertyGrid } from "./Section";

type Mode = "buy" | "land" | "apartments";

const TITLES: Record<Mode, { title: string; subtitle: string }> = {
  buy:        { title: "Properties for Sale in Belagavi",         subtitle: "Hive Verified land, apartments and bungalows" },
  land:       { title: "Land & Plots for Sale in Belagavi",       subtitle: "NA and Non-NA plots across prime localities" },
  apartments: { title: "Apartments & Bungalows in Belagavi",      subtitle: "Verified homes from trusted owners and builders" },
};

const baseFor = (mode: Mode): Property[] => {
  if (mode === "land") return PROPERTIES.filter((p) => p.category === "land");
  if (mode === "apartments") return PROPERTIES.filter((p) => p.category === "home");
  return PROPERTIES;
};

export function ListingsPage({ mode, initialQuery = "" }: { mode: Mode; initialQuery?: string }) {
  const base = useMemo(() => baseFor(mode), [mode]);
  const [query, setQuery] = useState(initialQuery);
  const [subType, setSubType] = useState<string>("");
  const [bhk, setBhk] = useState("");
  const [ownership, setOwnership] = useState<string>("");
  const [naFilter, setNaFilter] = useState<string>("");
  const [max, setMax] = useState<number>(0);
  const [sort, setSort] = useState("relevance");

  const result = useMemo(() => {
    let items = base.filter((p) => {
      if (subType && p.subType !== subType) return false;
      if (bhk && String(p.bhk) !== bhk) return false;
      if (ownership && p.land?.ownership !== ownership) return false;
      if (naFilter && p.land?.naStatus !== naFilter) return false;
      if (max && p.price > max) return false;
      return true;
    });
    if (sort === "price-asc") items = [...items].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") items = [...items].sort((a, b) => b.price - a.price);
    if (sort === "area") items = [...items].sort((a, b) => b.area - a.area);
    return searchProperties(items, query);
  }, [base, subType, bhk, ownership, naFilter, max, sort, query]);

  const info = TITLES[mode];
  const totalCount = result.primary.length + result.nearby.length;

  const homeSubTypes = ["Apartment", "Bungalow"];
  const landSubTypes = ["NA Plot", "Non-NA Plot"];
  const availableSubTypes = mode === "land" ? landSubTypes : mode === "apartments" ? homeSubTypes : [...homeSubTypes, ...landSubTypes];

  return (
    <div className="container-p mx-auto max-w-7xl mt-8">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{info.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{info.subtitle} · {totalCount} results</p>
      </header>

      {/* Inline search */}
      <div className="mb-6 rounded-xl border border-border bg-card p-3 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by locality, area, tags or keywords (e.g. Tilakwadi, NA, 3 BHK)"
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
        {query && (
          <button onClick={() => setQuery("")} className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground hover:text-primary">
            Clear
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="font-semibold mb-4">Filters</h3>
          <div className="space-y-4 text-sm">
            <FilterGroup label="Property Type">
              <select value={subType} onChange={(e) => setSubType(e.target.value)} className="w-full rounded-md border border-border bg-background px-2 py-2">
                <option value="">All</option>
                {availableSubTypes.map((t) => <option key={t}>{t}</option>)}
              </select>
            </FilterGroup>

            {mode !== "land" && (
              <FilterGroup label="BHK">
                <div className="flex flex-wrap gap-2">
                  {["", "1", "2", "3", "4"].map((b) => (
                    <button key={b || "any"} onClick={() => setBhk(b)} className={`px-3 py-1 rounded-full border text-xs ${bhk === b ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary"}`}>
                      {b ? `${b} BHK` : "Any"}
                    </button>
                  ))}
                </div>
              </FilterGroup>
            )}

            {mode !== "apartments" && (
              <>
                <FilterGroup label="NA Status">
                  <select value={naFilter} onChange={(e) => setNaFilter(e.target.value)} className="w-full rounded-md border border-border bg-background px-2 py-2">
                    <option value="">Any</option>
                    <option>NA</option>
                    <option>Non-NA</option>
                  </select>
                </FilterGroup>
                <FilterGroup label="Ownership">
                  <select value={ownership} onChange={(e) => setOwnership(e.target.value)} className="w-full rounded-md border border-border bg-background px-2 py-2">
                    <option value="">Any</option>
                    <option>Agricultural</option>
                    <option>Residential</option>
                    <option>Converted</option>
                  </select>
                </FilterGroup>
              </>
            )}

            <FilterGroup label="Max Budget">
              <select value={max} onChange={(e) => setMax(Number(e.target.value))} className="w-full rounded-md border border-border bg-background px-2 py-2">
                <option value={0}>Any</option>
                <option value={5000000}>Under ₹50 L</option>
                <option value={10000000}>Under ₹1 Cr</option>
                <option value={20000000}>Under ₹2 Cr</option>
                <option value={50000000}>Under ₹5 Cr</option>
              </select>
            </FilterGroup>

            <button
              onClick={() => { setSubType(""); setBhk(""); setOwnership(""); setNaFilter(""); setMax(0); setQuery(""); }}
              className="w-full mt-2 text-xs text-primary font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{totalCount}</span> properties
              {result.matchedLocality && (
                <span> in and around <span className="font-semibold text-primary">{result.matchedLocality}</span></span>
              )}
            </p>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm">
              <option value="relevance">Sort: Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="area">Area: Largest</option>
            </select>
          </div>

          {totalCount === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              No properties match your search.
            </div>
          ) : (
            <>
              {result.primary.length > 0 && (
                <section>
                  {result.matchedLocality && (
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Properties in {result.matchedLocality}
                    </h2>
                  )}
                  <PropertyGrid items={result.primary} />
                </section>
              )}
              {result.nearby.length > 0 && (
                <section className="mt-10">
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Nearby areas around {result.matchedLocality}
                  </h2>
                  <PropertyGrid items={result.nearby} />
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{label}</div>
      {children}
    </div>
  );
}

// Re-export for convenience (unused but kept for tree-shaking friendliness)
export type { Category };
