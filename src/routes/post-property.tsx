import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HIVE_PHONE_DISPLAY, telHref } from "@/lib/data";
import { WhatsAppIcon } from "@/components/WhatsApp";

export const Route = createFileRoute("/post-property")({
  head: () => ({
    meta: [
      { title: "List Your Property Free — Hive Estate" },
      { name: "description", content: "List your property free on Hive Estate. Reach genuine buyers in Belagavi." },
    ],
  }),
  component: PostPropertyV2,
});

const STEPS = ["Preparation", "Property", "Location", "Details", "Media", "Finish"];

const ELIGIBILITY = [
  "Must be the legal owner or authorised agent.",
  "Property must be in Belagavi or nearby limits.",
  "Strictly a buy/sell platform (No rentals).",
  "Original photos required (no stock images)."
];

const DOCUMENTS = [
  "Sale Deed (Required)",
  "Khata (Required)",
  "Encumbrance Certificate (Required)",
  "Owner ID & Address Proof (Required)",
  "Property Tax Receipt",
  "RTC / Mutation (If applicable)"
];

const ICONS = {
  check: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
  apartment: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /></svg>,
  bungalow: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  plot: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3zM3 9h18M9 21V9" /></svg>,
};

function PostPropertyV2() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [propertyType, setPropertyType] = useState("Apartment");

  if (submitted) {
    return (
      <div className="bg-muted/30 min-h-screen flex items-center justify-center p-4">
        <div className="bg-background rounded-3xl p-10 max-w-lg w-full text-center shadow-elevated border border-border">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-success stroke-linecap-round stroke-linejoin-round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
          </div>
          <h2 className="font-display text-2xl font-bold mb-3">Listing Submitted!</h2>
          <p className="text-muted-foreground mb-8">
            Thank you for choosing Hive Estate. Our team will review your submission and contact you within 24 hours to verify the listing.
          </p>
          <button onClick={() => window.location.href = "/"} className="bg-primary text-primary-foreground font-bold py-3 px-8 rounded-xl hover:opacity-90 transition">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/20 min-h-screen pb-20">
      {/* Top Header */}
      <div className="bg-white border-b border-border sticky top-16 z-30 shadow-sm overflow-hidden py-4">
        <div className="container-p mx-auto max-w-4xl flex flex-col items-center gap-4">
          <h1 className="font-display font-bold text-xl md:text-2xl">List Your Property</h1>
          
          {/* Stepper */}
          <div className="flex items-center w-full justify-between">
            {STEPS.map((s, idx) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className={`flex items-center gap-2 ${idx > step ? 'opacity-40 grayscale' : ''}`}>
                  <div className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${idx === step ? 'bg-primary text-white ring-4 ring-primary/20' : idx < step ? 'bg-success text-white' : 'bg-muted-foreground/20 text-foreground'}`}>
                    {idx < step ? "✓" : idx + 1}
                  </div>
                  <span className={`text-[11px] sm:text-xs font-semibold ${idx === step ? 'text-primary' : 'hidden lg:block'}`}>
                    {s}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className="flex-1 h-[2px] bg-border mx-2 sm:mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-p mx-auto max-w-3xl mt-10">
        <div className="bg-background rounded-3xl shadow-card border border-border overflow-hidden">
          {/* Form Content */}
          <div className="p-6 sm:p-10">
            <form onSubmit={(e) => {
              e.preventDefault();
              if (step < STEPS.length - 1) setStep(step + 1);
              else setSubmitted(true);
            }}>

              {/* STEP 0: PREPARATION */}
              {step === 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center mb-8">
                    <span className="inline-block bg-accent/20 text-accent-foreground text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">100% Free Service</span>
                    <h2 className="font-display text-3xl font-bold mb-3">Before you start</h2>
                    <p className="text-muted-foreground">Hive Estate guarantees verified buyers. Keep these ready to ensure a smooth listing process.</p>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="bg-secondary/50 rounded-2xl p-6 border border-border">
                      <h3 className="font-bold mb-4 flex items-center gap-2"><span className="text-primary">{ICONS.check}</span> Eligibility Criteria</h3>
                      <ul className="space-y-3">
                        {ELIGIBILITY.map((text, i) => (
                          <li key={i} className="flex gap-2 text-sm text-foreground/80 leading-relaxed">
                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> {text}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-secondary/50 rounded-2xl p-6 border border-border">
                      <h3 className="font-bold mb-4 flex items-center gap-2"><span className="text-accent">{ICONS.check}</span> Required Documents</h3>
                      <ul className="space-y-3">
                        {DOCUMENTS.map((text, i) => (
                          <li key={i} className="flex gap-2 text-sm text-foreground/80 leading-relaxed">
                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-accent shrink-0" /> {text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 1: PROPERTY TYPE */}
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="font-display text-2xl font-bold mb-2">What kind of property are you listing?</h2>
                  <p className="text-muted-foreground mb-8">Select the category that best describes your property.</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: "Apartment", icon: ICONS.apartment, desc: "Flats, Penthouses" },
                      { id: "Bungalow", icon: ICONS.bungalow, desc: "Independent Houses, Villas" },
                      { id: "NA Plot", icon: ICONS.plot, desc: "Converted plotting land" },
                      { id: "Non-NA Plot", icon: ICONS.plot, desc: "Agricultural or open land" },
                    ].map(type => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setPropertyType(type.id)}
                        className={`text-left p-6 rounded-2xl border-2 transition-all duration-200 ${propertyType === type.id ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/40 hover:bg-secondary/50'}`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${propertyType === type.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                          {type.icon}
                        </div>
                        <h3 className="font-bold text-lg">{type.id}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{type.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: LOCATION */}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="font-display text-2xl font-bold mb-2">Where is it located?</h2>
                  <p className="text-muted-foreground mb-8">Help buyers find your property accurately on the map.</p>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="field-label">City</label>
                      <input readOnly value="Belagavi" className="field bg-muted/50 cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="field-label">Locality / Area <span className="text-destructive">*</span></label>
                      <input placeholder="e.g. Tilakwadi, Camp, Vadgaon" className="field" required />
                    </div>
                    <div>
                      <label className="field-label">Full Address <span className="text-destructive">*</span></label>
                      <input placeholder="Building / Street / Landmark" className="field" required />
                    </div>
                    <div>
                      <label className="field-label">Survey Number (If known)</label>
                      <input placeholder="e.g. SY-145/2A" className="field" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: DETAILS */}
              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="font-display text-2xl font-bold mb-2">Property Details</h2>
                  <p className="text-muted-foreground mb-8">Tell us the specifications and price.</p>
                  
                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="field-label">Total Area (sqft) <span className="text-destructive">*</span></label>
                      <input type="number" placeholder="e.g. 2400" className="field" required />
                    </div>
                    <div>
                      <label className="field-label">Expected Price (₹) <span className="text-destructive">*</span></label>
                      <input type="number" placeholder="e.g. 3600000" className="field" required />
                    </div>
                    <div>
                      <label className="field-label">Facing Direction</label>
                      <select className="field">
                        <option>East</option>
                        <option>West</option>
                        <option>North</option>
                        <option>South</option>
                        <option>North-East</option>
                        <option>North-West</option>
                        <option>South-East</option>
                        <option>South-West</option>
                      </select>
                    </div>
                    <div>
                      <label className="field-label">Road Width (feet)</label>
                      <input type="number" placeholder="e.g. 30" className="field" />
                    </div>
                    
                    {(propertyType === "Apartment" || propertyType === "Bungalow") && (
                      <>
                        <div>
                          <label className="field-label">Bedrooms (BHK)</label>
                          <input type="number" placeholder="e.g. 3" className="field" />
                        </div>
                        <div>
                          <label className="field-label">Bathrooms</label>
                          <input type="number" placeholder="e.g. 2" className="field" />
                        </div>
                      </>
                    )}
                  </div>
                  <div>
                    <label className="field-label">Property Description <span className="text-destructive">*</span></label>
                    <textarea rows={4} placeholder="Describe nearby landmarks, age of property, special features, etc..." className="field" required />
                  </div>
                </div>
              )}

              {/* STEP 4: PHOTOS */}
              {step === 4 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="font-display text-2xl font-bold mb-2">Upload Photos</h2>
                  <p className="text-muted-foreground mb-8">Listings with good photos get 3x more views.</p>
                  
                  <div className="border-2 border-dashed border-border rounded-2xl bg-secondary/30 p-12 text-center hover:bg-secondary/80 hover:border-primary/50 transition cursor-pointer group">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </div>
                    <h3 className="font-bold text-lg">Click to browse or drag & drop</h3>
                    <p className="text-sm text-muted-foreground mt-2">Upload at least 4 original photos (JPG, PNG). Max 5MB each.</p>
                  </div>
                </div>
              )}

              {/* STEP 5: CONTACT */}
              {step === 5 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="font-display text-2xl font-bold mb-2">Your Contact Details</h2>
                  <p className="text-muted-foreground mb-8">Where should our team and buyers reach you?</p>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="field-label">Full Name <span className="text-destructive">*</span></label>
                      <input placeholder="e.g. Rajesh Kumar" className="field" required />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="field-label">Phone Number <span className="text-destructive">*</span></label>
                        <input type="tel" placeholder="+91 90000 00000" className="field" required />
                      </div>
                      <div>
                        <label className="field-label">Email Address</label>
                        <input type="email" placeholder="you@email.com" className="field" />
                      </div>
                    </div>
                    <div>
                      <label className="field-label">You are posting as</label>
                      <select className="field">
                        <option>Property Owner</option>
                        <option>Authorised Agent</option>
                        <option>Builder / Developer</option>
                      </select>
                    </div>
                    
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-6 flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-4 h-4 rounded text-primary" required />
                      <div className="text-xs text-foreground/80 leading-relaxed">
                        I declare that the information provided is accurate and I am authorised to list this property. I agree to Hive Estate's terms of service and verification process.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Bar */}
              <div className="flex items-center justify-between pt-8 mt-10 border-t border-border">
                <button
                  type="button"
                  onClick={() => setStep(Math.max(0, step - 1))}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition ${step === 0 ? 'opacity-0 pointer-events-none' : 'bg-secondary hover:bg-border text-foreground'}`}
                >
                  ← Back
                </button>
                
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl font-bold text-sm bg-primary text-white hover:opacity-90 transition shadow-md shadow-primary/20 flex items-center gap-2"
                >
                  {step === 0 ? "Start Listing" : step === STEPS.length - 1 ? "Submit Listing" : "Continue"} 
                  {step !== STEPS.length - 1 && <span>→</span>}
                </button>
              </div>

            </form>
          </div>
        </div>
        
        {/* Help Banner Below Form */}
        <div className="mt-6 text-center flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>Need help with listing?</span>
          <div className="flex items-center gap-4">
            <a href={telHref} className="flex items-center gap-1.5 font-bold text-foreground hover:text-primary transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l2.02-1.29a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z"/></svg>
              Call Us
            </a>
            <a href={`https://wa.me/919000000000`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-bold text-success hover:opacity-80 transition">
              <WhatsAppIcon className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .field-label { display: block; font-size: 0.75rem; font-weight: 700; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
        .field { width: 100%; border-radius: 0.75rem; border: 1.5px solid var(--border); background: var(--background); padding: 0.875rem 1rem; font-size: 0.9375rem; font-weight: 500; outline: none; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
        .field:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(52, 96, 34, 0.1); }
      `}</style>
    </div>
  );
}
