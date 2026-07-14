import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Hive Estate — Belagavi Real Estate" }, { property: 'og:title', content: "About Hive Estate — Belagavi Real Estate" },
      {
        name: "description",
        content:
          "Hive Estate is Belagavi's trusted real estate marketplace built for buyers, sellers, agents and builders.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="container-p mx-auto max-w-4xl mt-10">
      <h1 className="text-3xl md:text-4xl font-bold">About Hive Estate</h1>
      <p className="mt-4 text-muted-foreground">
        Hive Estate is Belagavi's dedicated real estate marketplace. We connect home buyers,
        sellers, tenants, agents and builders with verified listings, transparent pricing and a
        modern search experience.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          ["Verified Listings", "Every listing is checked for accuracy before it goes live."],
          ["Local Expertise", "We focus exclusively on Belagavi and its localities."],
          ["Zero Hassle", "Free listing for owners and agents, no hidden charges."],
        ].map(([t, d]) => (
          <div key={t} className="rounded-xl border border-border bg-card p-5">
            <div className="h-10 w-10 rounded-md bg-accent" />
            <h3 className="mt-4 font-semibold">{t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
      <section className="mt-12">
        <h2 className="text-2xl font-bold">Our mission</h2>
        <p className="mt-3 text-muted-foreground">
          To make finding, buying and renting property in Belagavi as simple, transparent and
          delightful as it should be — for locals, families, students and NRI investors alike.
        </p>
      </section>
    </div>
  );
}
