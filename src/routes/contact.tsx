import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { telHref, HIVE_PHONE_DISPLAY } from "@/lib/data";
import { WhatsAppIcon } from "@/components/WhatsApp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Hive Estate — Belagavi" },
      { name: "description", content: "Get in touch with Hive Estate. Call, WhatsApp or send a message. We're here to help with buying property in Belagavi." },
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

  return (
    <div className="bg-slate-50/50 min-h-screen">
      {/* HERO STRIP */}
      <div className="relative py-20 overflow-hidden bg-primary text-center">
        {/* Decorative background blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 container-p mx-auto max-w-3xl">
          <span className="inline-block px-3 py-1 mb-4 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
            We're here to help
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-sm">
            Contact Hive Estate
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-xl mx-auto font-medium">
            Call, WhatsApp, or drop a message — our team responds within 24 hours.
          </p>
        </div>
      </div>

      <div className="container-p mx-auto max-w-6xl py-16 -mt-10 relative z-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          
          {/* CONTACT FORM */}
          <div className="rounded-[2rem] border border-border/50 bg-white p-8 md:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.06)]">
            <div className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-2">Send us a message</h2>
              <p className="text-sm text-muted-foreground">Fill out the form below and we'll get back to you within 24 hours.</p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-foreground">Full Name</label>
                  <input placeholder="e.g. Rajesh Kumar" className="field" />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-foreground">Phone Number</label>
                  <input type="tel" placeholder="+91 90000 00000" className="field" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-foreground">Email Address</label>
                <input type="email" placeholder="you@email.com" className="field" />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-foreground">I am enquiring about</label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="field w-full text-left flex items-center justify-between cursor-pointer focus:ring-0"
                  >
                    <span className="block truncate">{enquiry}</span>
                    <span className="pointer-events-none text-muted-foreground ml-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-primary' : ''}`}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute z-50 mt-2 w-full rounded-2xl border border-border/50 bg-white py-2 shadow-[0_12px_40px_rgb(0,0,0,0.12)] animate-in fade-in slide-in-from-top-2">
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
                          className={`w-full text-left px-5 py-3 text-[14px] transition-colors hover:bg-primary/5 hover:text-primary ${
                            enquiry === option ? "bg-primary/5 text-primary font-bold border-l-2 border-primary" : "text-foreground font-medium border-l-2 border-transparent"
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
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-foreground">Message</label>
                <textarea rows={4} placeholder="Tell us how we can help you..." className="field" />
              </div>
              <button
                type="submit"
                className="w-full rounded-2xl bg-primary py-4 mt-2 text-[15px] font-bold text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* CTC */}
            <div className="rounded-[2rem] border border-border/50 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="font-display text-xl font-bold mb-6">Reach us directly</h3>
              <div className="space-y-4">
                <a
                  href={telHref}
                  className="group flex items-center gap-4 rounded-2xl border border-transparent p-4 hover:border-border hover:bg-secondary/50 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary grid place-items-center shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l2.02-1.29a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Call us</div>
                    <div className="font-bold text-foreground text-[15px]">{HIVE_PHONE_DISPLAY}</div>
                  </div>
                </a>
                
                <a
                  href={`https://wa.me/919000000000?text=${encodeURIComponent("Hello, I have a property enquiry.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-transparent p-4 hover:border-success/20 hover:bg-success/5 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 text-[#25D366] grid place-items-center shrink-0 group-hover:scale-110 group-hover:bg-[#25D366] group-hover:text-white transition-all duration-300">
                    <WhatsAppIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">WhatsApp</div>
                    <div className="font-bold text-foreground text-[15px]">Chat instantly</div>
                  </div>
                </a>
                
                <a
                  href="mailto:hello@hiveestate.in"
                  className="group flex items-center gap-4 rounded-2xl border border-transparent p-4 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent-foreground grid place-items-center shrink-0 group-hover:scale-110 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Email</div>
                    <div className="font-bold text-foreground text-[15px]">hello@hiveestate.in</div>
                  </div>
                </a>
              </div>
            </div>

            {/* ADDRESS */}
            <div className="rounded-[2rem] border border-border/50 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="font-display text-xl font-bold mb-6">Our Office</h3>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 grid place-items-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="pt-1">
                  <p className="text-[15px] text-foreground font-bold leading-tight">Camp Road, Belagavi</p>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">Karnataka 590001, India</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-xs font-bold text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                    Mon – Sat: 9 AM – 6 PM
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`.field { width: 100%; border-radius: 1rem; border: 1.5px solid var(--border); background: #fafafa; padding: 1rem 1.25rem; font-size: 0.9375rem; font-weight: 500; outline: none; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 1px 2px rgba(0,0,0,0.02) inset; } .field:focus { border-color: var(--primary); background: #ffffff; box-shadow: 0 0 0 4px rgba(52, 96, 34, 0.1); } .field::placeholder { color: #94a3b8; font-weight: 400; }`}</style>
    </div>
  );
}
