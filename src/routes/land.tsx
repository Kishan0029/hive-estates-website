import { createFileRoute } from "@tanstack/react-router";
import { ListingsPage } from "@/components/ListingsPage";

function LandPage() {
  const { q } = Route.useSearch();
  return <ListingsPage mode="land" initialQuery={q} />;
}

export const Route = createFileRoute("/land")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "" }),
  head: () => ({
    meta: [
      { title: "Land & Plots for Sale in Belagavi — Hive Estate" }, { property: 'og:title', content: "Land & Plots for Sale in Belagavi — Hive Estate" },
      {
        name: "description",
        content:
          "NA and Non-NA plots for sale across Tilakwadi, Vadgaon, Shahapur, Machhe, Kanbargi and more.",
      },
    ],
  }),
  component: LandPage,
});
