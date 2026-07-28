import { createFileRoute } from "@tanstack/react-router"
import { Section } from "@/components-v2/Section"
import { Button } from "@/components-v2/Button"
import { HIVE_PHONE_DISPLAY } from "@/lib/data"

export const Route = createFileRoute("/v2/post-property")({
  component: PostPropertyV2,
})

function PostPropertyV2() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-v2-paper">
      <Section containerClassName="max-w-4xl text-center">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-v2-ink mb-6 tracking-tight">
          Sell or Rent your property faster.
        </h1>
        <p className="text-xl text-v2-ink/70 font-medium max-w-2xl mx-auto mb-12">
          List your property on Belagavi's most trusted real estate platform. We ensure genuine leads and faster closures.
        </p>

        <div className="bg-v2-mist rounded-3xl p-8 md:p-12 shadow-sm border border-v2-line">
          <h2 className="font-display text-2xl font-bold text-v2-ink mb-2">Get Started</h2>
          <p className="text-v2-ink/70 mb-8">Fill in basic details and our team will contact you for verification.</p>
          
          <form className="space-y-6 max-w-md mx-auto text-left">
            <div>
              <label className="block text-sm font-semibold text-v2-ink mb-2">Property Type</label>
              <select className="w-full rounded-xl border border-v2-line bg-v2-paper px-4 py-3 outline-none focus:border-v2-green">
                <option>Apartment</option>
                <option>Bungalow / Villa</option>
                <option>NA Plot</option>
                <option>Non-NA Plot</option>
                <option>Commercial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-v2-ink mb-2">Location</label>
              <input placeholder="e.g. Tilakwadi" className="w-full rounded-xl border border-v2-line bg-v2-paper px-4 py-3 outline-none focus:border-v2-green" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-v2-ink mb-2">Your Name</label>
              <input className="w-full rounded-xl border border-v2-line bg-v2-paper px-4 py-3 outline-none focus:border-v2-green" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-v2-ink mb-2">Phone Number</label>
              <input className="w-full rounded-xl border border-v2-line bg-v2-paper px-4 py-3 outline-none focus:border-v2-green" />
            </div>
            
            <Button size="lg" className="w-full shadow-sm text-base mt-2">Submit Details</Button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-v2-line text-center text-sm font-semibold text-v2-ink/60">
            Or call us directly at <span className="text-v2-ink">{HIVE_PHONE_DISPLAY}</span>
          </div>
        </div>
      </Section>
    </div>
  )
}
