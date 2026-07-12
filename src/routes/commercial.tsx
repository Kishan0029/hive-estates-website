import { createFileRoute } from "@tanstack/react-router";
import { ListingsPage } from "@/components/ListingsPage";

export const Route = createFileRoute("/commercial")({
  head: () => ({ meta: [
    { title: "Commercial Properties in Belagavi — Hive Estate" },
    { name: "description", content: "Offices, retail spaces and warehouses for sale and rent in Belagavi." },
  ]}),
  component: () => <ListingsPage mode="commercial" />,
});
