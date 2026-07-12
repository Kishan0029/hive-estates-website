import { createFileRoute } from "@tanstack/react-router";
import { BLOGS } from "@/lib/data";

export const Route = createFileRoute("/blogs")({
  head: () => ({ meta: [
    { title: "Real Estate Blogs & Guides — Hive Estate" },
    { name: "description", content: "Property guides, market insights and home-buying tips for Belagavi." },
  ]}),
  component: Blogs,
});

function Blogs() {
  return (
    <div className="container-p mx-auto max-w-7xl mt-8">
      <h1 className="text-2xl md:text-3xl font-bold">Property Guides & Blogs</h1>
      <p className="text-sm text-muted-foreground mt-1">Insights, tips and market updates</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {BLOGS.map((b) => (
          <article key={b.id} className="rounded-xl border border-border bg-card overflow-hidden shadow-card hover:shadow-elevated transition">
            <div className="aspect-[16/10] bg-muted overflow-hidden">
              <img src={b.image} alt={b.title} loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="p-5">
              <div className="text-xs text-muted-foreground">{b.date}</div>
              <h2 className="mt-1 font-semibold">{b.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{b.excerpt}</p>
              <button className="mt-4 text-sm font-semibold text-accent hover:underline">Read article →</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
