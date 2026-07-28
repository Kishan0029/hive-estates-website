import { createFileRoute, notFound } from "@tanstack/react-router"
import { useState } from "react"
import { formatINR, telHref, waHrefFor, HIVE_PHONE_DISPLAY, type Property } from "@/lib/data"
import { Section } from "@/components-v2/Section"
import { PropertyCard } from "@/components-v2/PropertyCard"
import { Badge } from "@/components-v2/Badge"
import { Button } from "@/components-v2/Button"
import { getPublicPropertyBySlugFn, getPublicPropertiesFn } from "@/server-fns/public"
import { createInquiryFn } from "@/server-fns/properties"

export const Route = createFileRoute("/v2/property/$slug")({
  loader: async ({ params }) => {
    try {
      const p = await getPublicPropertyBySlugFn({ data: { slug: params.slug } })
      const allProps = await getPublicPropertiesFn()
      const similar = allProps.filter((x: any) => x.id !== p.id && x.category === p.category).slice(0, 4)
      return { property: p, similar }
    } catch {
      throw notFound()
    }
  },
  component: PropertyDetailV2,
})

function PropertyDetailV2() {
  const { property: p, similar } = Route.useLoaderData() as { property: Property, similar: Property[] }
  const [mainImage, setMainImage] = useState(p.gallery[0])
  const [emi, setEmi] = useState({ amount: p.price, rate: 8.5, years: 20 })
  const monthlyEmi = calcEmi(emi.amount, emi.rate, emi.years)

  // Form State
  const [inquiry, setInquiry] = useState({ name: "", phone: "", email: "", message: `I'm interested in listing #${p.listingNumber}...` })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inquiry.name || !inquiry.phone) return alert("Please enter your name and phone number")
    setIsSubmitting(true)
    try {
      await createInquiryFn({ data: { property_id: p.id, ...inquiry } })
      setSubmitted(true)
      setInquiry({ name: "", phone: "", email: "", message: "" })
    } catch (err: any) {
      alert("Failed to send inquiry: " + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-v2-mist min-h-screen pt-28 pb-20">
      <div className="container-p mx-auto max-w-7xl">
        {/* TOP BADGES */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Badge variant="secondary" className="bg-v2-paper">{p.status}</Badge>
          {p.hiveVerified && <Badge variant="verified">✓ Hive Verified</Badge>}
          {p.premium && <Badge variant="gold">Premium</Badge>}
          {p.featured && <Badge variant="default" className="bg-v2-ink text-white">Featured</Badge>}
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] items-start">
          
          {/* MAIN COLUMN */}
          <div className="space-y-12">
            
            {/* GALLERY */}
            <div className="space-y-3">
              <div className="aspect-[16/9] w-full overflow-hidden rounded-3xl bg-v2-line">
                <img src={mainImage} alt={p.title} className="h-full w-full object-cover" />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {p.gallery.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(g)}
                    className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${mainImage === g ? "ring-2 ring-v2-green ring-offset-2 ring-offset-v2-mist" : "opacity-70 hover:opacity-100 transition-opacity"}`}
                  >
                    <img src={g} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* HEADER */}
            <div className="bg-v2-paper rounded-3xl p-8 shadow-sm border border-v2-line">
              <h1 className="font-display text-3xl md:text-4xl font-extrabold text-v2-ink mb-2">{p.title}</h1>
              <p className="text-v2-ink/60 text-lg mb-6">
                {p.addressLine ? p.addressLine : (p.land?.nearbyLandmarks || p.locality)} · {p.propertyType}
              </p>
              
              <div className="flex flex-wrap items-baseline gap-4 pt-6 border-t border-v2-line">
                {p.priceOnRequest ? (
                  <span className="font-display text-4xl font-black text-v2-green">Price on Request</span>
                ) : (
                  <>
                    <span className="font-display text-4xl font-black text-v2-green">
                      {formatINR(p.price)}
                    </span>
                    {p.pricePerSqFt && (
                      <span className="text-v2-ink/60 font-semibold">{formatINR(p.pricePerSqFt)} / sqft</span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* SPECS */}
            <div className="bg-v2-paper rounded-3xl p-8 shadow-sm border border-v2-line">
              <h2 className="font-display text-2xl font-bold text-v2-ink mb-6">Property Overview</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {p.category === "home" ? (
                  <>
                    <Spec label="Area" value={`${p.area} sqft`} />
                    <Spec label="Bedrooms" value={p.bhk ? `${p.bhk} BHK` : "—"} />
                    <Spec label="Bathrooms" value={p.bathrooms ?? "—"} />
                    <Spec label="Parking" value={p.parking ?? 0} />
                    <Spec label="Facing" value={p.facingDirection ?? "—"} />
                    <Spec label="Furnishing" value={p.furnishing ?? "—"} />
                    <Spec label="Age" value={p.age ?? "—"} />
                    <Spec label="Type" value={p.propertyType} />
                  </>
                ) : (
                  <>
                    {p.land && (
                      <>
                        <Spec label="Property Type" value={p.propertyType} />
                        <Spec label="Plot Size" value={p.land.plotSize} />
                        <Spec label="Facing" value={p.land.facingDirection} />
                        <Spec label="Approvals" value={p.land.approvals || "None"} />
                        <Spec label="Electricity" value={p.land.electricity ? "Yes" : "No"} />
                        <Spec label="Water" value={p.land.waterConnection ? "Yes" : "No"} />
                      </>
                    )}
                  </>
                )}
              </div>
              <div className="mt-8 pt-6 border-t border-v2-line flex items-center gap-3">
                {p.vastuCompliant || p.land?.vastuCompliance ? (
                  <Badge variant="default" className="bg-emerald-100 text-emerald-800 shadow-none border-none text-sm px-4 py-1.5">✓ Vastu Compliant</Badge>
                ) : (
                  <Badge variant="secondary" className="bg-v2-mist text-v2-ink/60 shadow-none border border-v2-line text-sm px-4 py-1.5">Not Vastu Compliant</Badge>
                )}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-v2-paper rounded-3xl p-8 shadow-sm border border-v2-line">
              <h2 className="font-display text-2xl font-bold text-v2-ink mb-4">About this property</h2>
              <p className="text-v2-ink/70 leading-relaxed text-lg whitespace-pre-wrap">{p.description}</p>
            </div>

            {/* AMENITIES */}
            {p.category === "home" && p.amenities.length > 0 && (
              <div className="bg-v2-paper rounded-3xl p-8 shadow-sm border border-v2-line">
                <h2 className="font-display text-2xl font-bold text-v2-ink mb-6">Amenities</h2>
                <div className="flex flex-wrap gap-3">
                  {p.amenities.map(a => (
                    <div key={a} className="rounded-full bg-v2-mist px-5 py-2 text-sm font-semibold text-v2-ink border border-v2-line/50">
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EMI CALC */}
            {p.category === "home" && (
              <div className="bg-v2-paper rounded-3xl p-8 shadow-sm border border-v2-line">
                <h2 className="font-display text-2xl font-bold text-v2-ink mb-2">EMI Calculator</h2>
                <p className="text-v2-ink/60 mb-8">Estimate your monthly payments.</p>
                <div className="grid gap-8 md:grid-cols-[1fr_250px]">
                  <div className="space-y-6">
                    <Slider label={`Loan Amount: ${formatINR(emi.amount)}`} min={500000} max={p.price * 1.2} step={100000} value={emi.amount} onChange={v => setEmi({...emi, amount: v})} />
                    <Slider label={`Interest Rate: ${emi.rate}%`} min={6} max={12} step={0.1} value={emi.rate} onChange={v => setEmi({...emi, rate: v})} />
                    <Slider label={`Tenure: ${emi.years} Years`} min={5} max={30} step={1} value={emi.years} onChange={v => setEmi({...emi, years: v})} />
                  </div>
                  <div className="rounded-2xl bg-v2-mist p-6 flex flex-col justify-center items-center text-center">
                    <div className="text-sm font-bold text-v2-ink/60 mb-2">Monthly EMI</div>
                    <div className="font-display text-4xl font-black text-v2-green">
                      ₹{monthlyEmi.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR (Sticky) */}
          <div className="lg:sticky lg:top-28 w-full">
            <div className="bg-v2-paper rounded-3xl p-6 md:p-8 shadow-elevated border border-v2-line">
              <div className="mb-6 pb-6 border-b border-v2-line">
                <div className="text-sm font-bold text-v2-ink/50 uppercase tracking-wider mb-1">Listing ID</div>
                <div className="font-display text-xl font-bold text-v2-ink">#{p.listingNumber}</div>
                <div className="text-sm text-v2-ink/60 mt-2">
                  Posted by <span className="font-bold text-v2-ink">{p.postedBy}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button asChild size="lg" className="w-full font-bold shadow-sm rounded-2xl bg-v2-ink text-white hover:bg-v2-ink/90">
                  <a href={telHref}>Call Now</a>
                </Button>
                <Button asChild size="lg" className="w-full font-bold shadow-sm rounded-2xl bg-[#25D366] text-white hover:bg-[#25D366]/90 border-transparent">
                  <a href={waHrefFor(p)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                </Button>
              </div>
              <div className="text-center text-xs font-semibold text-v2-ink/50 mb-8">
                {HIVE_PHONE_DISPLAY}
              </div>

              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <h3 className="font-bold text-lg text-v2-ink mb-2">Send an Inquiry</h3>
                {submitted ? (
                  <div className="rounded-2xl bg-emerald-50 p-6 text-center border border-emerald-100">
                    <div className="text-emerald-600 font-bold mb-1">Inquiry Sent!</div>
                    <div className="text-emerald-700/70 text-sm font-medium">Our team will contact you shortly.</div>
                  </div>
                ) : (
                  <>
                    <input
                      required value={inquiry.name} onChange={e => setInquiry(i => ({...i, name: e.target.value}))}
                      placeholder="Your Name *"
                      className="w-full rounded-xl bg-v2-mist px-4 py-3 text-sm font-medium text-v2-ink outline-none focus:ring-2 focus:ring-v2-green transition-shadow"
                    />
                    <input
                      required value={inquiry.phone} onChange={e => setInquiry(i => ({...i, phone: e.target.value}))}
                      placeholder="Phone Number *"
                      className="w-full rounded-xl bg-v2-mist px-4 py-3 text-sm font-medium text-v2-ink outline-none focus:ring-2 focus:ring-v2-green transition-shadow"
                    />
                    <textarea
                      rows={3} value={inquiry.message} onChange={e => setInquiry(i => ({...i, message: e.target.value}))}
                      className="w-full rounded-xl bg-v2-mist px-4 py-3 text-sm font-medium text-v2-ink outline-none focus:ring-2 focus:ring-v2-green transition-shadow resize-none"
                    />
                    <Button disabled={isSubmitting} type="submit" size="lg" className="w-full rounded-xl shadow-sm text-base">
                      {isSubmitting ? "Sending..." : "Request Details"}
                    </Button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* SIMILAR PROPERTIES */}
        {similar.length > 0 && (
          <div className="mt-24 pt-16 border-t border-v2-line">
            <h2 className="font-display text-3xl font-extrabold text-v2-ink mb-8">Similar Properties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similar.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Spec({ label, value }: { label: string, value: string | number }) {
  return (
    <div>
      <div className="text-sm font-bold text-v2-ink/50 uppercase tracking-wider mb-1">{label}</div>
      <div className="font-semibold text-lg text-v2-ink">{value}</div>
    </div>
  )
}

function Slider({ label, min, max, value, onChange, step }: any) {
  return (
    <div>
      <div className="text-sm font-bold text-v2-ink mb-3">{label}</div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} className="w-full accent-v2-green h-2 bg-v2-line rounded-lg appearance-none cursor-pointer" />
    </div>
  )
}

function calcEmi(p: number, r: number, y: number) {
  const n = y * 12
  const m = r / 12 / 100
  return Math.round((p * m * Math.pow(1 + m, n)) / (Math.pow(1 + m, n) - 1))
}
