import { createFileRoute, Link } from "@tanstack/react-router"
import { getAdminDashboardStatsFn } from "@/server-fns/properties"

export const Route = createFileRoute("/v2/admin/")({
  loader: async () => await getAdminDashboardStatsFn(),
  component: AdminDashboardV2,
})

function AdminDashboardV2() {
  const stats = Route.useLoaderData()

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-v2-ink">Dashboard</h1>
          <p className="text-v2-ink/60 mt-1">Welcome to the Hive Estate control panel.</p>
        </div>
        <Link 
          to="/v2/admin/properties/new"
          className="rounded-xl bg-v2-green px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Property
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Active Listings", value: stats.activeListings, href: "/v2/admin/properties?status=active" },
          { label: "Pending Approvals", value: stats.pendingApprovals, href: "/v2/admin/properties?status=draft" },
          { label: "Properties Sold", value: stats.propertiesSold, href: "/v2/admin/properties?status=sold" },
          { label: "Total Inquiries", value: stats.totalInquiries, href: "/v2/admin/inquiries" },
        ].map((stat, i) => (
          <Link to={stat.href} key={i} className="rounded-3xl border border-v2-line bg-v2-paper p-6 shadow-sm hover:border-v2-green transition-colors group">
            <p className="font-display text-4xl font-black text-v2-ink tracking-tighter group-hover:text-v2-green transition-colors">{stat.value}</p>
            <p className="text-xs font-bold text-v2-ink/50 uppercase tracking-wider mt-2">{stat.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
