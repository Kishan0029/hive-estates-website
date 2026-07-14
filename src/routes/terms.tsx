import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms of Use — Hive Estate" }] }),
  component: () => (
    <div className="container-p mx-auto max-w-3xl mt-10">
      <h1 className="text-3xl font-bold">Terms of Use</h1>
      <p className="mt-4 text-muted-foreground text-sm">
        By using Hive Estate you agree to list accurate property information, respect other users,
        and comply with local real estate regulations in Karnataka, India.
      </p>
    </div>
  ),
});
