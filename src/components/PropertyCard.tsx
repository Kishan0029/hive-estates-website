import { Link } from "@tanstack/react-router";
import { formatINR, telHref, waHrefFor, type Property } from "@/lib/data";
import { WhatsAppIcon } from "@/components/WhatsApp";

const Icon = ({ d }: { d: string }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

export function PropertyCard({ p }: { p: Property }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card shadow-card hover:shadow-elevated hover:border-primary/30 transition">
      <Link
        to="/property/$id"
        params={{ id: p.id }}
        className="block relative aspect-[16/10] overflow-hidden bg-muted"
      >
        <img
          src={p.image}
          alt={p.title}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
        />

        {/* Left badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <HiveVerifiedBadge />

          {p.premium && (
            <span className="rounded-md bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 shadow-sm">
              PREMIUM
            </span>
          )}
        </div>

        {/* Listing number top-right */}
        <div className="absolute top-3 right-3">
          <span className="rounded-md bg-white/95 text-primary text-[11px] font-bold px-2 py-1 shadow-sm tracking-wide">
            #{p.listingNumber}
          </span>
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to="/property/$id"
              params={{ id: p.id }}
              className="font-semibold text-foreground line-clamp-1 hover:text-primary"
            >
              {p.title}
            </Link>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <Icon d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
              {p.location}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-display font-bold text-primary">{formatINR(p.price)}</p>
            {p.pricePerSqFt && (
              <p className="text-[11px] text-muted-foreground">₹{p.pricePerSqFt}/sqft</p>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
          {p.category === "home" && p.bhk && (
            <span className="inline-flex items-center gap-1">
              <Icon d="M3 21V8l9-5 9 5v13M9 21v-6h6v6" /> {p.bhk} BHK
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Icon d="M3 3h18v18H3z M3 9h18 M9 21V9" /> {p.area} sqft
          </span>
          {p.category === "home" && p.bathrooms && (
            <span className="inline-flex items-center gap-1">
              <Icon d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4z M6 12V6a2 2 0 0 1 4 0" />{" "}
              {p.bathrooms} Bath
            </span>
          )}
          {p.category === "land" && p.land && (
            <span className="inline-flex items-center gap-1 text-primary/80 font-medium">
              {p.land.naStatus}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-primary/80">{p.propertyType}</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3">
          <a
            href={telHref}
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground py-2 text-xs font-bold transition"
          >
            <Icon d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l2.02-1.29a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z" />
            Call
          </a>
          <a
            href={waHrefFor(p)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-success text-success-foreground hover:opacity-90 py-2 text-xs font-semibold transition"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}

export function HiveVerifiedBadge({ large = false }: { large?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md bg-success text-success-foreground font-bold shadow-sm ring-1 ring-white/40 ${
        large ? "px-3 py-1.5 text-xs" : "px-2 py-1 text-[10px]"
      }`}
      title="Verified by Hive Estate"
    >
      <svg
        width={large ? 14 : 11}
        height={large ? 14 : 11}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 1l3.09 2.26L18.9 3l.9 3.81L23 8.7l-1.5 3.3L23 15.3l-3.2 1.89-.9 3.81-3.81-.26L12 23l-3.09-2.26L5.1 21l-.9-3.81L1 15.3 2.5 12 1 8.7l3.2-1.89.9-3.81L8.91 3.26 12 1z" />
        <path
          d="M9.5 12.5l1.75 1.75L15 10.5"
          stroke="var(--success)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Hive Verified
    </span>
  );
}
