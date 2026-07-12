import { Link } from "@tanstack/react-router";
import { useState } from "react";

const NAV = [
  { to: "/buy", label: "Buy" },
  { to: "/rent", label: "Rent" },
  { to: "/commercial", label: "Commercial" },
  { to: "/plots", label: "Plots" },
  { to: "/projects", label: "Projects" },
  { to: "/builders", label: "Builders" },
  { to: "/agents", label: "Agents" },
  { to: "/blogs", label: "Blogs" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="container-p mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground font-bold">H</span>
          <span className="font-display text-lg font-bold text-primary">Hive Estate</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 py-2 rounded-md text-foreground/80 hover:text-primary hover:bg-secondary transition"
              activeProps={{ className: "text-primary font-semibold bg-secondary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/login" className="hidden sm:inline-flex text-sm font-medium text-primary px-3 py-2 rounded-md hover:bg-secondary">Login</Link>
          <Link
            to="/post-property"
            className="inline-flex items-center gap-1 rounded-md bg-accent px-3 sm:px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm hover:opacity-90 transition"
          >
            Post Property
            <span className="hidden sm:inline text-[10px] rounded bg-success px-1.5 py-0.5 text-success-foreground">FREE</span>
          </Link>
          <button
            aria-label="Menu"
            className="lg:hidden p-2 rounded-md hover:bg-secondary"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-border bg-background">
          <div className="container-p mx-auto max-w-7xl grid grid-cols-2 gap-1 py-3">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="px-3 py-2 rounded-md text-sm hover:bg-secondary">
                {n.label}
              </Link>
            ))}
            <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-2 rounded-md text-sm hover:bg-secondary">Login</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
