import { Link } from "@tanstack/react-router";
import { LOCALITIES } from "@/lib/data";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="container-p mx-auto max-w-7xl py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-accent font-bold">H</span>
            <span className="font-display text-lg font-bold">Hive Estate</span>
          </div>
          <p className="mt-4 text-sm text-primary-foreground/70 max-w-sm">
            Belagavi's trusted marketplace for buying, selling and renting properties. Verified listings, transparent pricing, real people.
          </p>
          <form className="mt-6 flex gap-2 max-w-sm" onSubmit={(e) => e.preventDefault()}>
            <input placeholder="Newsletter email" className="flex-1 rounded-md bg-white/10 px-3 py-2 text-sm placeholder:text-primary-foreground/50 outline-none border border-white/10 focus:border-accent" />
            <button className="rounded-md bg-accent px-4 text-sm font-semibold text-accent-foreground">Subscribe</button>
          </form>
        </div>
        <FCol title="Company" links={[["About", "/about"], ["Contact", "/contact"], ["Blogs", "/blogs"], ["Privacy", "/privacy"], ["Terms", "/terms"]]} />
        <FCol title="Explore" links={[["Buy", "/buy"], ["Rent", "/rent"], ["Commercial", "/commercial"], ["Plots", "/plots"], ["Projects", "/projects"]]} />
        <div>
          <h4 className="font-semibold mb-4 text-sm">Top Localities</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            {LOCALITIES.slice(0, 8).map((l) => (
              <li key={l}><Link to="/buy" className="hover:text-accent">{l}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-p mx-auto max-w-7xl py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-foreground/60">
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
      <ul className="space-y-2 text-sm text-primary-foreground/70">
        {links.map(([l, to]) => (
          <li key={to}><Link to={to as string} className="hover:text-accent">{l}</Link></li>
        ))}
      </ul>
    </div>
  );
}
