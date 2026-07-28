import { createFileRoute } from "@tanstack/react-router"
import { ListingsPageV2 } from "@/components-v2/ListingsPageV2"
import { getPublicPropertiesFn } from "@/server-fns/public"
import { type Property } from "@/lib/data"

export const Route = createFileRoute("/v2/buy")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "" }),
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: async ({ deps: { q } }) => {
    const data = await getPublicPropertiesFn(q ? { data: { search: q } } : undefined)
    return { data }
  },
  component: BuyPageV2,
})

function BuyPageV2() {
  const { data } = Route.useLoaderData()
  const { q } = Route.useSearch()
  return <ListingsPageV2 mode="buy" initialQuery={q} preloadedData={data as Property[]} />
}
