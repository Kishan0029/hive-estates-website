import { createFileRoute } from "@tanstack/react-router";
import { ListingsPage } from "@/components/ListingsPage";
import { getPublicPropertiesFn } from "@/server-fns/public";
import { type Property } from "@/lib/data";

function ApartmentsPage() {
  const { data } = Route.useLoaderData();
  const { q } = Route.useSearch();
  return <ListingsPage mode="apartments" initialQuery={q} preloadedData={data as Property[]} />;
}

export const Route = createFileRoute("/apartments")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "" }),
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: async ({ deps: { q } }) => {
    // We fetch all properties then filter out 'plot' for apartments/villas,
    // or we could add another server function. Using getPublicPropertiesFn for now and filtering in memory.
    const allData = await getPublicPropertiesFn(q ? { data: { search: q } } : undefined);
    const data = allData.filter((p: Property) => p.propertyType === "Apartment" || p.propertyType === "Bungalow");
    return { data };
  },
  head: () => ({
    meta: [
      { title: "Apartments & Bungalows for Sale in Belagavi — Hive Estate" },
      {
        name: "description",
        content: "Discover luxury apartments, villas and bungalows for sale in top localities of Belagavi.",
      },
    ],
  }),
  component: ApartmentsPage,
});
