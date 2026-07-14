import { createFileRoute } from "@tanstack/react-router";
import { AGENTS_LIST } from "@/lib/data";

export const Route = createFileRoute("/agents")({
  head: () => ({
    meta: [
      { title: "Real Estate Agents in Belagavi — Hive Estate" }, { property: 'og:title', content: "Real Estate Agents in Belagavi — Hive Estate" },
      {
        name: "description",
        content: "Connect with experienced and verified real estate agents in Belagavi.",
      },
    ],
  }),
  component: Agents,
});

function Agents() {
  return (
    <div className="container-p mx-auto max-w-7xl mt-8">
      <h1 className="text-2xl md:text-3xl font-bold">Top Real Estate Agents in Belagavi</h1>
      <p className="text-sm text-muted-foreground mt-1">Verified agents with proven track record</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {AGENTS_LIST.map((a) => (
          <article
            key={a.id}
            className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-elevated transition"
          >
            <div className="flex gap-4">
              <img
                src={a.image}
                alt={a.name}
                className="h-16 w-16 rounded-full object-cover"
                loading="lazy"
              />
              <div className="flex-1">
                <h2 className="font-semibold">{a.name}</h2>
                <div className="text-xs text-muted-foreground mt-1">
                  {a.experience} yrs experience · ⭐ {a.rating}
                </div>
                <div className="text-xs text-muted-foreground">Specializes in {a.locality}</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-md bg-secondary p-2">
                <span className="text-muted-foreground">Deals closed</span>
                <div className="font-semibold text-sm">{a.deals}</div>
              </div>
              <div className="rounded-md bg-secondary p-2">
                <span className="text-muted-foreground">Rating</span>
                <div className="font-semibold text-sm">⭐ {a.rating}/5</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a
                href={`tel:${a.phone}`}
                className="rounded-md bg-primary py-2 text-center text-xs font-semibold text-primary-foreground"
              >
                Call
              </a>
              <a
                href="https://wa.me/919000000000"
                className="rounded-md bg-success py-2 text-center text-xs font-semibold text-success-foreground"
              >
                WhatsApp
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
