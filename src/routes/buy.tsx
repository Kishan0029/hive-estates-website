import { createFileRoute } from "@tanstack/react-router";
import { ListingsPage } from "@/components/ListingsPage";
import { getPublicPropertiesFn } from "@/server-fns/public";
import { type Property } from "@/lib/data";

function BuyPage() {
  const { data } = Route.useLoaderData();
  const { q } = Route.useSearch();
  return <ListingsPage mode="buy" initialQuery={q} preloadedData={data as Property[]} />;
}

export const Route = createFileRoute("/buy")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "" }),
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: async ({ deps: { q } }) => {
    const data = await getPublicPropertiesFn(q ? { data: { search: q } } : undefined);
    return { data };
  },
  head: () => ({
    meta: [
      { title: "Properties for Sale in Belagavi — Hive Estate" },
      {
        name: "description",
        content: "Browse Hive Verified land, apartments and bungalows for sale in Belagavi.",
      },
    ],
  }),
  component: BuyPage,
});
