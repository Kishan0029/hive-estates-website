import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LOCALITIES } from "@/lib/data";

type Mode = "buy" | "rent" | "commercial" | "plots";

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = useState<Mode>("buy");
  const [locality, setLocality] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");
  const [bhk, setBhk] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: `/${mode}`, search: { locality, type, budget, bhk } as never });
  };

  return (
    <form onSubmit={submit} className={`rounded-2xl bg-background/95 backdrop-blur-md border border-border shadow-elevated ${compact ? "p-3" : "p-4 md:p-5"}`}>
      <div className="flex gap-1 mb-3 overflow-x-auto">
        {(["buy", "rent", "commercial", "plots"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize whitespace-nowrap transition ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-2">
        <Field label="Location">
          <input
            list="localities"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            placeholder="Search Belagavi localities..."
            className="w-full bg-transparent outline-none text-sm"
          />
          <datalist id="localities">{LOCALITIES.map((l) => <option key={l} value={l} />)}</datalist>
        </Field>
        <Field label="Property Type">
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-transparent outline-none text-sm">
            <option value="">Any</option>
            {["Apartment", "Villa", "Plot", "Commercial", "Office", "Warehouse"].map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Budget">
          <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full bg-transparent outline-none text-sm">
            <option value="">Any</option>
            <option>Under ₹50 L</option>
            <option>₹50 L - ₹1 Cr</option>
            <option>₹1 Cr - ₹2 Cr</option>
            <option>₹2 Cr+</option>
          </select>
        </Field>
        <Field label="BHK">
          <select value={bhk} onChange={(e) => setBhk(e.target.value)} className="w-full bg-transparent outline-none text-sm">
            <option value="">Any</option>
            <option>1</option><option>2</option><option>3</option><option>4+</option>
          </select>
        </Field>
        <button type="submit" className="rounded-lg bg-accent text-accent-foreground font-semibold px-6 py-3 hover:opacity-90 transition">
          Search
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="rounded-lg border border-border bg-card px-3 py-2 focus-within:border-accent">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">{label}</div>
      {children}
    </label>
  );
}
