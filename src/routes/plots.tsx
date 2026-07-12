import { createFileRoute } from "@tanstack/react-router";
import { ListingsPage } from "@/components/ListingsPage";

export const Route = createFileRoute("/plots")({
  head: () => ({ meta: [
    { title: "Plots & Land in Belagavi — Hive Estate" },
    { name: "description", content: "Residential and NA plots for sale across Belagavi and surrounding areas." },
  ]}),
  component: () => <ListingsPage mode="plots" />,
});
