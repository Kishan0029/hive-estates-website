import { Link } from "@tanstack/react-router"
import { Badge } from "./Badge"
import { formatINR, type Property } from "@/lib/data"

export function PropertyCard({ property }: { property: Property }) {
  const isHome = property.category === "home"
  return (
    <Link
      to="/v2/property/$slug"
      params={{ slug: property.slug }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-v2-paper border border-v2-line shadow-sm transition-all hover:shadow-card hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-v2-mist">
        <img
          src={property.image}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {property.hiveVerified && <Badge variant="verified">✓ Hive Verified</Badge>}
          {property.premium && <Badge variant="gold">Premium</Badge>}
        </div>
        
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur border-transparent text-v2-ink">
            {property.propertyType}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-v2-green">{property.locality}</p>
          <span className="text-[10px] font-bold tracking-wider text-v2-ink/50 uppercase">{property.listingNumber}</span>
        </div>

        <h3 className="font-display text-lg font-bold text-v2-ink line-clamp-1">
          {property.title}
        </h3>

        <div className="mt-4 flex items-end justify-between border-t border-v2-line pt-4">
          <div>
            <div className="text-xs font-semibold text-v2-ink/60 mb-0.5">Price</div>
            <div className="font-display text-xl font-bold text-v2-ink">
              {property.priceOnRequest ? "On Request" : formatINR(property.price)}
            </div>
          </div>
          
          <div className="text-right text-sm font-semibold text-v2-ink/80">
            {isHome ? (
              <>{property.bhk} BHK · {property.area} sqft</>
            ) : (
              <>{property.land?.plotSize || property.area + " sqft"}</>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
