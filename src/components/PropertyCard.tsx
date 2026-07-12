import { Link } from "@tanstack/react-router";
import { formatINR, type Property } from "@/lib/data";

const Icon = ({ d }: { d: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export function PropertyCard({ p }: { p: Property }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card shadow-card hover:shadow-elevated transition">
      <Link to="/property/$id" params={{ id: p.id }} className="block relative aspect-[16/10] overflow-hidden bg-muted">
        <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {p.verified && <span className="rounded-md bg-success text-success-foreground text-[10px] font-semibold px-2 py-1">✓ VERIFIED</span>}
          {p.featured && <span className="rounded-md bg-accent text-accent-foreground text-[10px] font-semibold px-2 py-1">FEATURED</span>}
          {p.premium && <span className="rounded-md bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-1">PREMIUM</span>}
        </div>
        <button aria-label="Save" className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-primary hover:text-accent">
          <Icon d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </button>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to="/property/$id" params={{ id: p.id }} className="font-semibold text-foreground line-clamp-1 hover:text-primary">
              {p.title}
            </Link>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <Icon d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
              {p.locality}, {p.city}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-display font-bold text-primary">{formatINR(p.price)}{p.listing === "rent" && <span className="text-[11px] font-normal text-muted-foreground">/mo</span>}</p>
            {p.pricePerSqft && <p className="text-[11px] text-muted-foreground">₹{p.pricePerSqft}/sqft</p>}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
          {p.bhk && <span className="inline-flex items-center gap-1"><Icon d="M3 21V8l9-5 9 5v13M9 21v-6h6v6" /> {p.bhk} BHK</span>}
          <span className="inline-flex items-center gap-1"><Icon d="M3 3h18v18H3z M3 9h18 M9 21V9" /> {p.area} sqft</span>
          {p.bathrooms && <span className="inline-flex items-center gap-1"><Icon d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4z M6 12V6a2 2 0 0 1 4 0" /> {p.bathrooms} Bath</span>}
          <span className="inline-flex items-center gap-1 text-primary/80"><Icon d="M12 2v20 M5 9l7-7 7 7" /> {p.status}</span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <span className="text-[11px] text-muted-foreground">Posted by <span className="text-foreground font-medium">{p.postedBy}</span> · {p.postedDate}</span>
          <div className="flex gap-1.5">
            <a href="tel:+919000000000" className="grid h-8 w-8 place-items-center rounded-md bg-secondary text-primary hover:bg-primary hover:text-primary-foreground" aria-label="Call">
              <Icon d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l2.02-1.29a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z" />
            </a>
            <a href="https://wa.me/919000000000" className="grid h-8 w-8 place-items-center rounded-md bg-success text-success-foreground hover:opacity-90" aria-label="WhatsApp">
              <Icon d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
