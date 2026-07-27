import { createFileRoute } from "@tanstack/react-router";
import { ListingsPage } from "@/components/ListingsPage";
import { getPublicPropertiesFn } from "@/server-fns/public";
import { type Property } from "@/lib/data";

function LandPage() {
  const { data } = Route.useLoaderData();
  const { q } = Route.useSearch();
  return <ListingsPage mode="land" initialQuery={q} preloadedData={data as Property[]} />;
}

export const Route = createFileRoute("/land")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "" }),
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: async ({ deps: { q } }) => {
    const allData = await getPublicPropertiesFn(q ? { data: { search: q } } : undefined);
    const data = allData.filter((p: Property) => p.category === "land");
    return { data };
  },
  head: () => ({
    meta: [
      { title: "Land & NA Plots for Sale in Belagavi — Hive Estate" },
      {
        name: "description",
        content: "Explore verified NA and Non-NA plots, agriculture land and farmhouse layouts in Belagavi.",
      },
    ],
  }),
  component: LandPage,
});
