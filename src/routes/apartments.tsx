import { createFileRoute } from "@tanstack/react-router";
import { ListingsPage } from "@/components/ListingsPage";

function ApartmentsPage() {
  const { q } = Route.useSearch();
  return <ListingsPage mode="apartments" initialQuery={q} />;
}

export const Route = createFileRoute("/apartments")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "" }),
  head: () => ({
    meta: [
      { title: "Apartments & Bungalows in Belagavi — Hive Estate" },
      {
        name: "description",
        content: "Verified apartments and bungalows for sale in Belagavi's top localities.",
      },
    ],
  }),
  component: ApartmentsPage,
});
