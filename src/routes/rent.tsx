import { createFileRoute } from "@tanstack/react-router";
import { ListingsPage } from "@/components/ListingsPage";

export const Route = createFileRoute("/rent")({
  head: () => ({ meta: [
    { title: "Rental Properties in Belagavi — Hive Estate" },
    { name: "description", content: "Find furnished and unfurnished rental homes in Belagavi's top localities." },
  ]}),
  component: () => <ListingsPage mode="rent" />,
});
