import { createFileRoute } from "@tanstack/react-router"
import { Section } from "@/components-v2/Section"

export const Route = createFileRoute("/v2/about")({
  component: AboutV2,
})

function AboutV2() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-v2-paper">
      <div className="container-p mx-auto max-w-4xl text-center">
        <h1 className="font-display text-5xl md:text-6xl font-extrabold text-v2-ink mb-6">About Hive Estates</h1>
        <p className="text-xl text-v2-ink/70 leading-relaxed max-w-3xl mx-auto font-medium">
          We are Belagavi's most trusted real estate platform. We believe buying property should be transparent, secure, and stress-free.
        </p>
      </div>

      <Section className="mt-12 bg-v2-mist">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-v2-ink mb-4">Our Mission</h2>
            <p className="text-lg text-v2-ink/70 leading-relaxed mb-6">
              To organize Belagavi's real estate market and make genuine, verified properties accessible to everyone. We cut through the noise, eliminate fake listings, and bring you only what's real.
            </p>
            <h2 className="font-display text-3xl font-bold text-v2-ink mb-4 mt-12">Why Choose Us?</h2>
            <ul className="space-y-4 text-lg text-v2-ink/80 font-medium">
              <li className="flex gap-3">
                <span className="text-v2-green font-bold">✓</span> 100% physically verified listings.
              </li>
              <li className="flex gap-3">
                <span className="text-v2-green font-bold">✓</span> No hidden fees or fake photos.
              </li>
              <li className="flex gap-3">
                <span className="text-v2-green font-bold">✓</span> Direct connection with owners and trusted builders.
              </li>
            </ul>
          </div>
          <div className="rounded-3xl overflow-hidden aspect-square bg-v2-line">
            <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" alt="Our Office" className="w-full h-full object-cover" />
          </div>
        </div>
      </Section>
    </div>
  )
}
