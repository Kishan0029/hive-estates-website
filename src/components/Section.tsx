import { PropertyCard } from "./PropertyCard";
import type { Property } from "@/lib/data";
import { Link } from "@tanstack/react-router";

export function Section({
  title,
  subtitle,
  viewAll,
  children,
}: {
  title: string;
  subtitle?: string;
  viewAll?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="container-p mx-auto max-w-7xl mt-16">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {viewAll && (
          <Link to={viewAll} className="text-sm font-semibold text-primary hover:text-accent whitespace-nowrap">
            View all →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export function PropertyGrid({ items }: { items: Property[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((p) => <PropertyCard key={p.id} p={p} />)}
    </div>
  );
}
