import { useMemo, useState } from "react";
import { PROPERTIES, type Property } from "@/lib/data";
import { PropertyGrid } from "./Section";

type Mode = Property["listing"];

const TITLES: Record<Mode, { title: string; subtitle: string }> = {
  buy: { title: "Properties for Sale in Belagavi", subtitle: "Verified apartments, villas and independent homes" },
  rent: { title: "Rental Properties in Belagavi", subtitle: "Fully furnished, semi-furnished and unfurnished options" },
  commercial: { title: "Commercial Properties in Belagavi", subtitle: "Offices, retail spaces and warehouses" },
  plots: { title: "Plots & Land in Belagavi", subtitle: "Residential and NA plots across prime localities" },
};

export function ListingsPage({ mode }: { mode: Mode }) {
  const base = useMemo(() => PROPERTIES.filter((p) => p.listing === mode), [mode]);
  const [type, setType] = useState("");
  const [bhk, setBhk] = useState("");
  const [status, setStatus] = useState("");
  const [max, setMax] = useState<number>(0);
  const [verified, setVerified] = useState(false);
  const [sort, setSort] = useState("relevance");

  const filtered = useMemo(() => {
    let out = base.filter((p) => {
      if (type && p.type !== type) return false;
      if (bhk && String(p.bhk) !== bhk) return false;
      if (status && p.status !== status) return false;
      if (verified && !p.verified) return false;
      if (max && p.price > max) return false;
      return true;
    });
    if (sort === "price-asc") out = [...out].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") out = [...out].sort((a, b) => b.price - a.price);
    if (sort === "area") out = [...out].sort((a, b) => b.area - a.area);
    return out;
  }, [base, type, bhk, status, verified, max, sort]);

  const info = TITLES[mode];

  return (
    <div className="container-p mx-auto max-w-7xl mt-8">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{info.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{info.subtitle} · {filtered.length} results</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="font-semibold mb-4">Filters</h3>
          <div className="space-y-4 text-sm">
            <FilterGroup label="Property Type">
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-md border border-border bg-background px-2 py-2">
                <option value="">All</option>
                {["Apartment", "Villa", "Plot", "Commercial", "Office", "Warehouse"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </FilterGroup>
            {mode !== "plots" && mode !== "commercial" && (
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
            <FilterGroup label="Max Budget">
              <select value={max} onChange={(e) => setMax(Number(e.target.value))} className="w-full rounded-md border border-border bg-background px-2 py-2">
                <option value={0}>Any</option>
                {mode === "rent" ? (
                  <>
                    <option value={20000}>Under ₹20K</option>
                    <option value={40000}>Under ₹40K</option>
                    <option value={80000}>Under ₹80K</option>
                  </>
                ) : (
                  <>
                    <option value={5000000}>Under ₹50 L</option>
                    <option value={10000000}>Under ₹1 Cr</option>
                    <option value={20000000}>Under ₹2 Cr</option>
                    <option value={50000000}>Under ₹5 Cr</option>
                  </>
                )}
              </select>
            </FilterGroup>
            <FilterGroup label="Construction Status">
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-md border border-border bg-background px-2 py-2">
                <option value="">Any</option>
                <option>Ready to Move</option>
                <option>Under Construction</option>
                <option>New Launch</option>
              </select>
            </FilterGroup>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} />
              <span>Verified only</span>
            </label>
            <button onClick={() => { setType(""); setBhk(""); setStatus(""); setMax(0); setVerified(false); }} className="w-full mt-2 text-xs text-accent font-semibold hover:underline">
              Clear all filters
            </button>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">Showing <span className="font-semibold text-foreground">{filtered.length}</span> properties</p>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm">
              <option value="relevance">Sort: Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="area">Area: Largest</option>
            </select>
          </div>
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              No properties match your filters.
            </div>
          ) : (
            <PropertyGrid items={filtered} />
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
