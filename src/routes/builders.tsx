import { createFileRoute } from "@tanstack/react-router";
import { BUILDERS_LIST } from "@/lib/data";

export const Route = createFileRoute("/builders")({
  head: () => ({ meta: [
    { title: "Top Builders in Belagavi — Hive Estate" },
    { name: "description", content: "Explore trusted real estate developers and builders in Belagavi." },
  ]}),
  component: Builders,
});

function Builders() {
  return (
    <div className="container-p mx-auto max-w-7xl mt-8">
      <h1 className="text-2xl md:text-3xl font-bold">Top Builders in Belagavi</h1>
      <p className="text-sm text-muted-foreground mt-1">Trusted developers with completed and ongoing projects</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {BUILDERS_LIST.map((b) => (
          <article key={b.id} className="rounded-xl border border-border bg-card overflow-hidden shadow-card hover:shadow-elevated transition">
            <div className="aspect-[16/10] bg-muted overflow-hidden">
              <img src={b.image} alt={b.name} loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold">{b.name}</h2>
                <span className="text-xs font-semibold text-accent">⭐ {b.rating}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{b.about}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md bg-secondary p-2"><span className="text-muted-foreground">Projects</span><div className="font-semibold text-sm">{b.projects}</div></div>
                <div className="rounded-md bg-secondary p-2"><span className="text-muted-foreground">Completed</span><div className="font-semibold text-sm">{b.completed}</div></div>
              </div>
              <button className="mt-4 w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground">View Projects</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
