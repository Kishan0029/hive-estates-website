import { Link } from "@tanstack/react-router";
import { LOCALITIES, HIVE_PHONE_DISPLAY } from "@/lib/data";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border" style={{ background: "#f8faf6" }}>
      <div className="container-p mx-auto max-w-7xl py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-5">
        {/* Brand */}
        <div className="lg:col-span-2">
          <Link to="/" className="inline-block mb-4">
            <img src="/Hive Logo.png" alt="Hive Estate" className="h-16 w-auto object-contain" />
          </Link>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            Belagavi's trusted marketplace for buying land, apartments and bungalows. Hive Verified listings, transparent pricing, real people.
          </p>
          <p className="mt-4 text-sm font-semibold text-foreground">
            {HIVE_PHONE_DISPLAY}
          </p>
          <a
            href="mailto:hello@hiveestate.in"
            className="mt-1 block text-sm text-muted-foreground hover:text-primary"
          >
            hello@hiveestate.in
          </a>
        </div>

        <FCol
          title="Company"
          links={[
            ["Contact", "/contact"],
            ["Privacy Policy", "/privacy"],
            ["Terms of Use", "/terms"],
            ["List Property", "/post-property"],
          ]}
        />
        <FCol
          title="Explore"
          links={[
            ["Buy Property", "/buy"],
            ["Land & Plots", "/land"],
            ["Apartments / Bungalows", "/apartments"],
            ["Hive Verified", "/hive-verified"],
          ]}
        />
        <div>
          <h4 className="font-semibold mb-4 text-sm">Top Localities</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {LOCALITIES.slice(0, 8).map((l) => (
              <li key={l}>
                <Link to="/buy" search={{ q: l } as never} className="hover:text-primary transition">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container-p mx-auto max-w-7xl py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Hive Estate, Belagavi. All rights reserved.</p>
          <p>
            Developed by{" "}
            <a
              href="https://gonextverse.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              Nextverse
            </a>
          </p>
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
          <li key={to}>
            <Link to={to as string} className="hover:text-primary transition">
              {l}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
