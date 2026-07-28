import { createFileRoute } from "@tanstack/react-router"
import { Section } from "@/components-v2/Section"
import { Button } from "@/components-v2/Button"
import { HIVE_PHONE_DISPLAY } from "@/lib/data"

export const Route = createFileRoute("/v2/contact")({
  component: ContactV2,
})

function ContactV2() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-v2-paper">
      <Section containerClassName="max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl font-extrabold text-v2-ink mb-4">Contact Us</h1>
          <p className="text-xl text-v2-ink/60 max-w-2xl mx-auto">
            Have questions about a property or looking to list yours? We're here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_400px] gap-12">
          <div className="bg-v2-mist rounded-3xl p-8 md:p-12 shadow-sm border border-v2-line">
            <h2 className="font-display text-2xl font-bold text-v2-ink mb-6">Send us a message</h2>
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-v2-ink mb-2">First Name</label>
                  <input className="w-full rounded-xl bg-v2-paper border border-v2-line px-4 py-3 outline-none focus:border-v2-green" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-v2-ink mb-2">Last Name</label>
                  <input className="w-full rounded-xl bg-v2-paper border border-v2-line px-4 py-3 outline-none focus:border-v2-green" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-v2-ink mb-2">Email Address</label>
                <input type="email" className="w-full rounded-xl bg-v2-paper border border-v2-line px-4 py-3 outline-none focus:border-v2-green" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-v2-ink mb-2">Message</label>
                <textarea rows={5} className="w-full rounded-xl bg-v2-paper border border-v2-line px-4 py-3 outline-none focus:border-v2-green resize-none" />
              </div>
              <Button size="lg" className="w-full md:w-auto px-10 text-base shadow-sm">Send Message</Button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-v2-paper rounded-3xl p-8 border border-v2-line">
              <h3 className="font-bold text-xl text-v2-ink mb-2">Call Us</h3>
              <p className="text-v2-ink/60 mb-4">Our team is available Mon-Sat, 9AM to 7PM.</p>
              <div className="font-display text-2xl font-black text-v2-green">{HIVE_PHONE_DISPLAY}</div>
            </div>
            
            <div className="bg-v2-paper rounded-3xl p-8 border border-v2-line">
              <h3 className="font-bold text-xl text-v2-ink mb-2">Office Location</h3>
              <p className="text-v2-ink/60 mb-4">Belagavi, Karnataka, India.</p>
              <div className="aspect-video bg-v2-mist rounded-xl flex items-center justify-center border border-v2-line">
                <span className="text-v2-ink/50 text-sm font-medium">Map view not available</span>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
