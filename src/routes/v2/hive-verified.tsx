import { createFileRoute } from "@tanstack/react-router"
import { Section } from "@/components-v2/Section"

export const Route = createFileRoute("/v2/hive-verified")({
  component: HiveVerifiedV2,
})

function HiveVerifiedV2() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-v2-mist">
      <Section containerClassName="max-w-4xl text-center">
        <div className="inline-flex items-center rounded-full border border-v2-gold bg-[#FFFDF2] px-6 py-2 text-sm font-bold text-[#806B00] mb-8 shadow-sm">
          ✓ The Hive Verified Standard
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold text-v2-ink mb-6 tracking-tight">
          Trust, verified.
        </h1>
        <p className="text-xl text-v2-ink/70 leading-relaxed font-medium">
          Buying property is a major life decision. We make it secure. Every property with the Hive Verified badge has passed our rigorous physical and legal checks.
        </p>
      </Section>

      <Section className="bg-v2-paper border-y border-v2-line">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-8 rounded-3xl bg-v2-mist border border-v2-line">
            <div className="w-16 h-16 mx-auto bg-v2-green text-white rounded-full flex items-center justify-center font-bold text-2xl mb-6">1</div>
            <h3 className="text-xl font-bold text-v2-ink mb-3">Physical Visit</h3>
            <p className="text-v2-ink/70">Our team visits every site to confirm existence, location, and condition.</p>
          </div>
          <div className="p-8 rounded-3xl bg-v2-mist border border-v2-line">
            <div className="w-16 h-16 mx-auto bg-v2-green text-white rounded-full flex items-center justify-center font-bold text-2xl mb-6">2</div>
            <h3 className="text-xl font-bold text-v2-ink mb-3">Document Check</h3>
            <p className="text-v2-ink/70">We verify ownership details, RTC, and NA conversion status where applicable.</p>
          </div>
          <div className="p-8 rounded-3xl bg-v2-mist border border-v2-line">
            <div className="w-16 h-16 mx-auto bg-v2-green text-white rounded-full flex items-center justify-center font-bold text-2xl mb-6">3</div>
            <h3 className="text-xl font-bold text-v2-ink mb-3">Accurate Pricing</h3>
            <p className="text-v2-ink/70">No fake prices or hidden charges. What you see is the real asking price.</p>
          </div>
        </div>
      </Section>
    </div>
  )
}
