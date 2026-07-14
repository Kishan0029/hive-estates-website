import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { telHref, HIVE_PHONE_DISPLAY } from "@/lib/data";
import { WhatsAppIcon } from "@/components/WhatsApp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Hive Estate — Belagavi" },
      { property: 'og:title', content: "Contact Hive Estate — Belagavi" },
      { name: "description", content: "Get in touch with Hive Estate. Call, WhatsApp or send a message. We're here to help with buying property in Belagavi." },
      { property: 'og:description', content: "Get in touch with Hive Estate. Call, WhatsApp or send a message. We're here to help with buying property in Belagavi." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [enquiry, setEnquiry] = useState("Buying a property");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition shadow-sm";
  const labelClass = "text-xs font-bold text-foreground mb-1.5 block uppercase tracking-wide";

  return (
    <div className="bg-background min-h-screen">
      {/* HERO SECTION */}
      <div className="container-p mx-auto max-w-5xl pt-12 md:pt-16 pb-8 md:pb-12 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-foreground mb-4">
          Get in Touch
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
          Whether you're buying, selling, or just looking for advice on Belagavi real estate, our team is here to help.
        </p>
      </div>

      <div className="container-p mx-auto max-w-5xl pb-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          
          {/* CONTACT FORM */}
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold">Send us a message</h2>
              <p className="text-sm text-muted-foreground mt-1">We'll get back to you within 24 hours.</p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input placeholder="e.g. Rajesh Kumar" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input type="tel" placeholder="+91 90000 00000" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input type="email" placeholder="you@email.com" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>I am enquiring about</label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`${inputClass} text-left flex items-center justify-between cursor-pointer`}
                  >
                    <span className="block truncate font-medium">{enquiry}</span>
                    <span className="pointer-events-none text-muted-foreground ml-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-primary' : ''}`}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-white py-1 shadow-elevated animate-in fade-in slide-in-from-top-2">
                      {[
                        "Buying a property",
                        "Selling / Listing a property",
                        "Land purchase",
                        "Site visit booking",
                        "General enquiry"
                      ].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setEnquiry(option);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-secondary ${
                            enquiry === option ? "text-primary font-bold bg-primary/5" : "text-foreground font-medium"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  <input type="hidden" name="enquiry" value={enquiry} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Message</label>
                <textarea rows={4} placeholder="Tell us how we can help you..." className={`${inputClass} resize-y min-h-[100px]`} />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-primary py-3.5 mt-2 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-90 hover:-translate-y-0.5 transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* CTC */}
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
              <h3 className="text-lg font-bold mb-5">Reach us directly</h3>
              <div className="space-y-3">
                <a
                  href={telHref}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-background p-3 hover:border-primary/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l2.02-1.29a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Call us</div>
                    <div className="font-bold text-foreground text-sm">{HIVE_PHONE_DISPLAY}</div>
                  </div>
                </a>
                
                <a
                  href={`https://wa.me/919000000000?text=${encodeURIComponent("Hello, I have a property enquiry.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-xl border border-border bg-background p-3 hover:border-success/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#25D366]/10 text-[#25D366] grid place-items-center shrink-0 group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                    <WhatsAppIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">WhatsApp</div>
                    <div className="font-bold text-foreground text-sm">Chat instantly</div>
                  </div>
                </a>
                
                <a
                  href="mailto:hello@hiveestate.in"
                  className="group flex items-center gap-4 rounded-xl border border-border bg-background p-3 hover:border-accent/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent-foreground grid place-items-center shrink-0 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Email</div>
                    <div className="font-bold text-foreground text-sm">hello@hiveestate.in</div>
                  </div>
                </a>
              </div>
            </div>

            {/* ADDRESS */}
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
              <h3 className="text-lg font-bold mb-4">Our Office</h3>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 grid place-items-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="pt-0.5">
                  <p className="text-sm text-foreground font-bold leading-tight">Camp Road, Belagavi</p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">Karnataka 590001, India</p>
                  <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-secondary text-[11px] font-bold text-muted-foreground border border-border">
                    <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                    Mon – Sat: 9 AM – 6 PM
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
