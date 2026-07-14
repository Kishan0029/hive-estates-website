import { Link } from "@tanstack/react-router";
import { useState } from "react";

const NAV = [
  { to: "/buy", label: "Buy" },
  { to: "/land", label: "Land" },
  { to: "/apartments", label: "Apartments / Bungalows" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="container-p mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 relative">
        <Link to="/" className="flex items-center shrink-0 z-10">
          <img
            src="/Hive Logo.png"
            alt="Hive Estates"
            className="h-14 w-auto object-contain"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm absolute left-1/2 -translate-x-1/2">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition font-medium"
              activeProps={{ className: "text-foreground font-semibold bg-secondary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <Link
            to="/post-property"
            className="group inline-flex items-center gap-1.5 rounded-full bg-primary px-3 sm:px-4 py-1.5 sm:py-2 text-[13px] font-bold text-primary-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            <span>List Property</span>
            <span className="hidden sm:flex items-center justify-center rounded-full bg-white text-primary px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest shadow-sm group-hover:scale-110 transition-transform">
              Free
            </span>
          </Link>
          <button
            aria-label="Menu"
            className="lg:hidden p-2 rounded-md hover:bg-secondary text-foreground"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-border bg-background">
          <div className="container-p mx-auto max-w-7xl grid grid-cols-1 gap-1 py-3">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary font-medium"
                activeProps={{ className: "text-foreground font-semibold bg-secondary" }}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
