import { createFileRoute } from "@tanstack/react-router";
import { PROPERTIES } from "@/lib/data";
import { PropertyGrid } from "@/components/Section";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "New Projects in Belagavi — Hive Estate" }, { property: 'og:title', content: "New Projects in Belagavi — Hive Estate" },
      {
        name: "description",
        content: "Explore upcoming and newly launched residential projects in Belagavi.",
      },
    ],
  }),
  component: Projects,
});

function Projects() {
  const projects = PROPERTIES.filter((p) => p.status !== "Ready to Move");
  return (
    <div className="container-p mx-auto max-w-7xl mt-8">
      <h1 className="text-2xl md:text-3xl font-bold">New & Upcoming Projects</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Under construction and new launches across Belagavi
      </p>
      <div className="mt-8">
        <PropertyGrid items={projects} />
      </div>
    </div>
  );
}
