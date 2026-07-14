import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — Hive Estate" }, { property: 'og:title', content: "Privacy Policy — Hive Estate" }] }),
  component: () => (
    <div className="container-p mx-auto max-w-3xl mt-10 prose">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-4 text-muted-foreground text-sm">
        We respect your privacy. Hive Estate collects only the information necessary to help you
        buy, sell or rent property in Belagavi. We do not sell your personal data. Contact us at
        hello@hiveestate.in for any privacy-related requests.
      </p>
    </div>
  ),
});
