import { Link } from "@tanstack/react-router"
import { HIVE_PHONE_DISPLAY } from "@/lib/data"

export function Footer() {
  return (
    <footer className="border-t border-v2-line bg-v2-paper py-12 md:py-16">
      <div className="container-p mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/v2/" className="inline-block mb-4">
              <span className="font-display text-2xl font-black text-v2-green tracking-tighter">
                HIVE<span className="text-v2-gold">ESTATES</span>
              </span>
            </Link>
            <p className="text-sm text-v2-ink/60 max-w-sm leading-relaxed">
              Find your perfect property in Belagavi. Buy verified land, apartments, and bungalows with confidence. Own your world, one property at a time.
            </p>
            <div className="mt-6 font-semibold text-v2-ink">
              Call us: {HIVE_PHONE_DISPLAY}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-v2-ink mb-4">Properties</h4>
            <ul className="space-y-3 text-sm text-v2-ink/70 font-medium">
              <li><Link to="/v2/apartments" className="hover:text-v2-green">Apartments in Belagavi</Link></li>
              <li><Link to="/v2/land" className="hover:text-v2-green">Land & Plots</Link></li>
              <li><Link to="/v2/buy" className="hover:text-v2-green">All Listings</Link></li>
              <li><Link to="/v2/post-property" className="hover:text-v2-green">Post Property</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-v2-ink mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-v2-ink/70 font-medium">
              <li><Link to="/v2/about" className="hover:text-v2-green">About Us</Link></li>
              <li><Link to="/v2/hive-verified" className="hover:text-v2-green">Hive Verified</Link></li>
              <li><Link to="/v2/contact" className="hover:text-v2-green">Contact</Link></li>
              <li><Link to="/v2/terms" className="hover:text-v2-green">Terms & Privacy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-v2-line text-center text-xs text-v2-ink/50 font-medium">
          &copy; {new Date().getFullYear()} Hive Estates Belagavi. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
