import { createFileRoute } from "@tanstack/react-router";
import { ListingsPage } from "@/components/ListingsPage";

function BuyPage() {
  const { q } = Route.useSearch();
  return <ListingsPage mode="buy" initialQuery={q} />;
}

export const Route = createFileRoute("/buy")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "" }),
  head: () => ({
    meta: [
      { title: "Properties for Sale in Belagavi — Hive Estate" }, { property: 'og:title', content: "Properties for Sale in Belagavi — Hive Estate" },
      {
        name: "description",
        content: "Browse Hive Verified land, apartments and bungalows for sale in Belagavi.",
      },
    ],
  }),
  component: BuyPage,
});
