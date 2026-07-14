import { Link } from "@tanstack/react-router";
import { LOCALITIES, HIVE_PHONE_DISPLAY } from "@/lib/data";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary text-foreground">
      <div className="container-p mx-auto max-w-7xl py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground font-bold">H</span>
            <span className="font-display text-lg font-bold text-primary">Hive Estate</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm">
            Belagavi's trusted marketplace for buying land, apartments and bungalows. Hive Verified listings, transparent pricing, real people.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">📞 {HIVE_PHONE_DISPLAY}</p>
        </div>
        <FCol title="Company" links={[["About", "/about"], ["Contact", "/contact"], ["Privacy", "/privacy"], ["Terms", "/terms"]]} />
        <FCol title="Explore" links={[["Buy", "/buy"], ["Land", "/land"], ["Apartments / Bungalows", "/apartments"], ["List Property", "/post-property"]]} />
        <div>
          <h4 className="font-semibold mb-4 text-sm">Top Localities</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {LOCALITIES.slice(0, 8).map((l) => (
              <li key={l}><Link to="/buy" search={{ q: l } as never} className="hover:text-primary">{l}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-p mx-auto max-w-7xl py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Hive Estate, Belagavi. All rights reserved.</p>
          <p>Made with care in Karnataka, India</p>
        </div>
      </div>
    </footer>
  );
}

function FCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="font-semibold mb-4 text-sm">{title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map(([l, to]) => (
          <li key={to}><Link to={to as string} className="hover:text-primary">{l}</Link></li>
        ))}
      </ul>
    </div>
  );
}
