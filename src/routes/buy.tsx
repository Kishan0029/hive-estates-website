import { createFileRoute } from "@tanstack/react-router";
import { ListingsPage } from "@/components/ListingsPage";

export const Route = createFileRoute("/buy")({
  head: () => ({ meta: [
    { title: "Properties for Sale in Belagavi — Hive Estate" },
    { name: "description", content: "Browse verified apartments, villas and independent houses for sale in Belagavi." },
  ]}),
  component: () => <ListingsPage mode="buy" />,
});
