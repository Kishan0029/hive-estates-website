import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { PROPERTIES, searchProperties, type Category, type Property } from "@/lib/data";
import { PropertyCard } from "./PropertyCard";

type Mode = "buy" | "land" | "apartments";

const TITLES: Record<Mode, { title: string; subtitle: string }> = {
  buy: { title: "Properties for Sale in Belagavi", subtitle: "Hive Verified land, apartments and bungalows" },
  land: { title: "Land & Plots for Sale in Belagavi", subtitle: "NA and Non-NA plots across prime localities" },
  apartments: { title: "Apartments & Bungalows in Belagavi", subtitle: "Verified homes from trusted owners and builders" },
};

const baseFor = (mode: Mode): Property[] => {
  if (mode === "land") return PROPERTIES.filter((p) => p.category === "land");
  if (mode === "apartments") return PROPERTIES.filter((p) => p.category === "home");
  return PROPERTIES;
};

const BUDGETS = [
  { label: "Any", value: 0 },
  { label: "Under ₹25 L", value: 2500000 },
  { label: "Under ₹50 L", value: 5000000 },
  { label: "Under ₹1 Cr", value: 10000000 },
  { label: "Under ₹2 Cr", value: 20000000 },
  { label: "Under ₹5 Cr", value: 50000000 },
];

export function ListingsPage({ mode, initialQuery = "" }: { mode: Mode; initialQuery?: string }) {
  const base = useMemo(() => baseFor(mode), [mode]);
  const [query, setQuery] = useState(initialQuery);
  const [subType, setSubType] = useState<string>("");
  const [bhk, setBhk] = useState("");
  const [ownership, setOwnership] = useState<string>("");
  const [naFilter, setNaFilter] = useState<string>("");
  const [max, setMax] = useState<number>(0);
  const [sort, setSort] = useState("relevance");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const result = useMemo(() => {
    let items = base.filter((p) => {
      if (subType && p.propertyType !== subType) return false;
      if (bhk && String(p.bhk) !== bhk) return false;
      if (ownership && p.land?.ownershipType !== ownership) return false;
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
  const hasActiveFilters = subType || bhk || ownership || naFilter || max || query;

  const homeSubTypes = ["Apartment", "Bungalow"];
  const landSubTypes = ["NA Plot", "Non-NA Plot"];
  const availableSubTypes =
    mode === "land" ? landSubTypes : mode === "apartments" ? homeSubTypes : [...homeSubTypes, ...landSubTypes];

  const clearAll = () => {
    setSubType(""); setBhk(""); setOwnership(""); setNaFilter(""); setMax(0); setQuery("");
  };

  const FiltersPanel = () => (
    <div className="space-y-6 text-sm">
      {/* Property Type */}
      <div>
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Property Type</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSubType("")}
            className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium transition ${
              !subType ? "border-primary bg-primary text-white" : "border-border hover:border-primary/40 text-foreground"
            }`}
          >
            All
          </button>
          {availableSubTypes.map((t) => (
            <button
              key={t}
              onClick={() => setSubType(t === subType ? "" : t)}
              className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium transition ${
                subType === t ? "border-primary bg-primary text-white" : "border-border hover:border-primary/40 text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* BHK (homes only) */}
      {mode !== "land" && (
        <div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">BHK</p>
          <div className="flex flex-wrap gap-2">
            {["", "1", "2", "3", "4"].map((b) => (
              <button
                key={b || "any"}
                onClick={() => setBhk(b)}
                className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium transition ${
                  bhk === b ? "border-primary bg-primary text-white" : "border-border hover:border-primary/40 text-foreground"
                }`}
              >
                {b ? `${b} BHK` : "Any"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* NA Status (land only) */}
      {mode !== "apartments" && (
        <div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">NA Status</p>
          <div className="flex flex-wrap gap-2">
            {["", "NA", "Non-NA"].map((v) => (
              <button
                key={v || "any"}
                onClick={() => setNaFilter(v)}
                className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium transition ${
                  naFilter === v ? "border-primary bg-primary text-white" : "border-border hover:border-primary/40 text-foreground"
                }`}
              >
                {v || "Any"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ownership */}
      {mode !== "apartments" && (
        <div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Ownership</p>
          <div className="flex flex-wrap gap-2">
            {["", "Agricultural", "Residential", "Converted"].map((v) => (
              <button
                key={v || "any"}
                onClick={() => setOwnership(v)}
                className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium transition ${
                  ownership === v ? "border-primary bg-primary text-white" : "border-border hover:border-primary/40 text-foreground"
                }`}
              >
                {v || "Any"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Budget */}
      <div>
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Max Budget</p>
        <div className="flex flex-wrap gap-2">
          {BUDGETS.map((b) => (
            <button
              key={b.label}
              onClick={() => setMax(b.value)}
              className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium transition ${
                max === b.value ? "border-primary bg-primary text-white" : "border-border hover:border-primary/40 text-foreground"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="w-full rounded-xl border border-destructive/30 py-2.5 text-xs font-bold text-destructive hover:bg-destructive/5 transition"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-background min-h-screen">
      {/* PAGE HEADER */}
      <div className="border-b border-border bg-card">
        <div className="container-p mx-auto max-w-7xl py-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">{info.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {info.subtitle} ·{" "}
            <span className="font-semibold text-foreground">{totalCount} results</span>
          </p>

          {/* SEARCH BAR */}
          <div className="mt-4 flex gap-2">
            <div className="flex-1 relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by locality, keyword, BHK…"
                className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2.5 text-sm outline-none focus:border-primary transition"
              />
            </div>
            {query && (
              <button
                onClick={() => setQuery("")}
                className="rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition"
              >
                Clear
              </button>
            )}
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen((v) => !v)}
              className="lg:hidden flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-secondary transition"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
              Filters
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-accent" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE FILTERS DRAWER */}
      {mobileFiltersOpen && (
        <div className="lg:hidden border-b border-border bg-card">
          <div className="container-p mx-auto max-w-7xl py-5">
            <FiltersPanel />
          </div>
        </div>
      )}

      <div className="container-p mx-auto max-w-7xl py-8">
        <div className="flex gap-8 items-start">
          {/* SIDEBAR FILTERS (desktop) */}
          <aside className="hidden lg:block w-64 shrink-0 rounded-2xl border border-border bg-card p-6 sticky top-20 self-start shadow-card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-sm text-foreground">Filters</h3>
              {hasActiveFilters && (
                <button onClick={clearAll} className="text-xs text-destructive font-semibold hover:underline">
                  Reset
                </button>
              )}
            </div>
            <FiltersPanel />
          </aside>

          {/* RESULTS */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="mb-5 flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">{totalCount}</span> properties
                {result.matchedLocality && (
                  <> in <span className="font-semibold text-primary">{result.matchedLocality}</span></>
                )}
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary cursor-pointer"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="area">Largest Area</option>
              </select>
            </div>

            {totalCount === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-16 text-center">
                <svg className="mx-auto mb-4 text-muted-foreground" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <p className="font-semibold text-foreground">No properties found</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search term</p>
                <button onClick={clearAll} className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:opacity-90">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {result.primary.length > 0 && (
                  <section>
                    {result.matchedLocality && (
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                        Properties in {result.matchedLocality}
                      </p>
                    )}
                    <div className="grid gap-6 sm:grid-cols-2">
                      {result.primary.map((p) => (
                        <PropertyCard key={p.id} p={p} />
                      ))}
                    </div>
                  </section>
                )}
                {result.nearby.length > 0 && (
                  <section className="mt-10">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                      Nearby {result.matchedLocality}
                    </p>
                    <div className="grid gap-6 sm:grid-cols-2">
                      {result.nearby.map((p) => (
                        <PropertyCard key={p.id} p={p} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {/* CTA */}
            <div className="mt-14 rounded-2xl border border-border bg-card p-8 text-center">
              <p className="font-bold text-foreground">Can't find what you're looking for?</p>
              <p className="text-sm text-muted-foreground mt-1">Tell us what you need and our local experts will find the right property for you.</p>
              <Link to="/contact" className="mt-4 inline-flex rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white hover:opacity-90 transition">
                Talk to Our Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Re-export for convenience
export type { Category };
