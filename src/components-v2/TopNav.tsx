import { Link } from "@tanstack/react-router"
import { Button } from "./Button"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function TopNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      )}
    >
      <div className="container-p mx-auto max-w-7xl flex items-center justify-between">
        <Link to="/v2/" className="flex items-center gap-2">
          {/* Using a simpler text logo for now, assuming we use the brand colors */}
          <span className="font-display text-2xl font-black text-v2-green tracking-tighter">
            HIVE<span className="text-v2-gold">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 rounded-full bg-v2-mist/80 px-2 py-1.5 backdrop-blur-sm border border-v2-line/50">
          {[
            { label: "Home", to: "/v2/" },
            { label: "Buy", to: "/v2/buy" },
            { label: "Apartments", to: "/v2/apartments" },
            { label: "Land", to: "/v2/land" },
            { label: "About Us", to: "/v2/about" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeProps={{ className: "bg-white text-v2-ink shadow-sm" }}
              className="px-4 py-2 rounded-full text-sm font-semibold text-v2-ink/70 hover:text-v2-ink transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild variant="default" size="sm" className="hidden sm:inline-flex">
            <Link to="/v2/post-property">Post Property</Link>
          </Button>
          
          {/* Mobile menu toggle placeholder */}
          <button className="md:hidden p-2 text-v2-ink">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
      </div>
    </header>
  )
}
