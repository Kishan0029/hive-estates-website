import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/post-property")({
  head: () => ({ meta: [
    { title: "Post Your Property Free — Hive Estate" },
    { name: "description", content: "List your property free on Hive Estate. Reach thousands of buyers and tenants in Belagavi." },
  ]}),
  component: PostProperty,
});

const STEPS = ["Property", "Location", "Details", "Photos", "Contact"];

function PostProperty() {
  const [step, setStep] = useState(0);
  return (
    <div className="container-p mx-auto max-w-3xl mt-10">
      <h1 className="text-2xl md:text-3xl font-bold">Post your property</h1>
      <p className="text-sm text-muted-foreground mt-1">Free listing · Reach genuine buyers and tenants</p>

      {/* Steps */}
      <ol className="mt-8 flex items-center gap-2 text-xs">
        {STEPS.map((s, i) => (
          <li key={s} className="flex-1 flex items-center gap-2">
            <span className={`grid h-7 w-7 place-items-center rounded-full font-semibold ${i <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{i + 1}</span>
            <span className={`hidden sm:inline ${i === step ? "text-foreground font-semibold" : "text-muted-foreground"}`}>{s}</span>
            {i < STEPS.length - 1 && <span className={`flex-1 h-px ${i < step ? "bg-primary" : "bg-border"}`} />}
          </li>
        ))}
      </ol>

      <form className="mt-8 rounded-xl border border-border bg-card p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); if (step < STEPS.length - 1) setStep(step + 1); }}>
        {step === 0 && (
          <>
            <Row label="I want to"><Segmented options={["Sell", "Rent / Lease", "PG / Co-living"]} /></Row>
            <Row label="Property type"><Segmented options={["Apartment", "Villa", "Plot", "Commercial", "Office"]} /></Row>
          </>
        )}
        {step === 1 && (
          <>
            <Row label="City"><input defaultValue="Belagavi" className="input" /></Row>
            <Row label="Locality"><input placeholder="e.g. Tilakwadi" className="input" /></Row>
            <Row label="Address"><input placeholder="Building / Street" className="input" /></Row>
          </>
        )}
        {step === 2 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Row label="BHK"><input type="number" placeholder="3" className="input" /></Row>
              <Row label="Area (sqft)"><input type="number" placeholder="1250" className="input" /></Row>
              <Row label="Price (₹)"><input type="number" placeholder="8500000" className="input" /></Row>
              <Row label="Bathrooms"><input type="number" placeholder="2" className="input" /></Row>
            </div>
            <Row label="Description"><textarea rows={4} placeholder="Describe your property..." className="input" /></Row>
          </>
        )}
        {step === 3 && (
          <div className="rounded-lg border-2 border-dashed border-border p-10 text-center">
            <div className="font-semibold">Drop photos here</div>
            <p className="text-xs text-muted-foreground mt-2">Upload up to 15 images (JPG, PNG)</p>
            <button type="button" className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Select files</button>
          </div>
        )}
        {step === 4 && (
          <>
            <Row label="Name"><input placeholder="Your name" className="input" /></Row>
            <Row label="Phone"><input placeholder="+91" className="input" /></Row>
            <Row label="Email"><input type="email" placeholder="you@email.com" className="input" /></Row>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> I agree to Hive Estate's terms & privacy policy</label>
          </>
        )}

        <div className="flex justify-between pt-4 border-t border-border">
          <button type="button" onClick={() => setStep(Math.max(0, step - 1))} className="rounded-md border border-border px-4 py-2 text-sm font-semibold disabled:opacity-40" disabled={step === 0}>Back</button>
          <button type="submit" className="rounded-md bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground">
            {step < STEPS.length - 1 ? "Continue" : "Publish Listing"}
          </button>
        </div>
      </form>

      <style>{`.input { width: 100%; border-radius: 0.375rem; border: 1px solid var(--border); background: var(--background); padding: 0.5rem 0.75rem; font-size: 0.875rem; }`}</style>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">{label}</div>
      {children}
    </label>
  );
}

function Segmented({ options }: { options: string[] }) {
  const [v, setV] = useState(options[0]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button type="button" key={o} onClick={() => setV(o)} className={`px-4 py-2 rounded-md border text-sm ${v === o ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"}`}>
          {o}
        </button>
      ))}
    </div>
  );
}
