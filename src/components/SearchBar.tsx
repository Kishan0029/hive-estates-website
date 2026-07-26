import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LOCALITIES } from "@/lib/data";

type Mode = "land" | "apartments";

export function SearchBar({ defaultMode = "apartments" }: { defaultMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: `/${mode}`, search: { q } as never });
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl bg-background border border-border shadow-elevated p-4 md:p-5"
    >
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setMode("apartments")}
          className={`flex-1 sm:flex-none px-5 py-2 rounded-full text-sm font-semibold transition ${mode === "apartments" ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-muted-foreground hover:text-primary"}`}
        >
          Apartments / Bungalows
        </button>
        <button
          type="button"
          onClick={() => setMode("land")}
          className={`flex-1 sm:flex-none px-5 py-2 rounded-full text-sm font-semibold transition ${mode === "land" ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-muted-foreground hover:text-primary"}`}
        >
          Land
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
        <label className="rounded-lg border border-border bg-card px-4 py-3 flex items-center gap-3 focus-within:border-primary">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            list="locality-suggestions"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={
              mode === "land"
                ? "Search land by locality, area, tags or keywords…"
                : "Search homes by locality, area, tags or keywords…"
            }
            className="w-full bg-transparent outline-none text-sm"
          />
          <datalist id="locality-suggestions">
            {LOCALITIES.map((l) => (
              <option key={l} value={l} />
            ))}
          </datalist>
        </label>
        <button
          type="submit"
          className="rounded-lg bg-primary text-primary-foreground font-semibold px-8 py-3 hover:opacity-90 transition"
        >
          Search
        </button>
      </div>
    </form>
  );
}
