import { createFileRoute, Link, useRouter } from "@tanstack/react-router"
import { getAdminPropertiesFn, deletePropertyFn } from "@/server-fns/properties"
import { useState } from "react"
import { Button } from "@/components-v2/Button"
import { Badge } from "@/components-v2/Badge"

type PropertiesSearch = { status?: string }

export const Route = createFileRoute("/v2/admin/properties/")({
  validateSearch: (s: Record<string, unknown>): PropertiesSearch => ({ 
    status: typeof s.status === "string" ? s.status : undefined 
  }),
  loader: async () => {
    const properties = await getAdminPropertiesFn()
    return { properties }
  },
  component: AdminPropertiesListV2,
})

function AdminPropertiesListV2() {
  const { properties } = Route.useLoaderData()
  const { status } = Route.useSearch()
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const filtered = properties?.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = status ? p.status === status : true
    return matchesSearch && matchesStatus
  })

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return
    setIsDeleting(id)
    try {
      await deletePropertyFn({ data: { id } })
      router.invalidate()
    } catch (err: any) {
      alert("Failed to delete: " + err.message)
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-v2-ink">Properties</h1>
          <p className="text-sm text-v2-ink/60 mt-1">Manage all listings, plots, and homes.</p>
        </div>
        
        <Button asChild size="sm">
          <Link to="/v2/admin/properties/new">
            Add Property
          </Link>
        </Button>
      </div>

      {status && (
        <div className="mb-4 flex items-center justify-between p-3 rounded-xl bg-v2-paper border border-v2-line shadow-sm">
          <p className="text-sm font-bold text-v2-ink">
            Filtering by status: <span className="text-v2-green">{status}</span>
          </p>
          <Link to="/v2/admin/properties" className="text-xs font-semibold text-v2-ink/50 hover:text-v2-ink">
            Clear Filter
          </Link>
        </div>
      )}

      <div className="rounded-3xl border border-v2-line bg-v2-paper shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-v2-line bg-v2-mist/50">
          <div className="relative max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-v2-ink/50" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search properties..." 
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-v2-line bg-v2-paper text-sm outline-none focus:border-v2-green transition"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-v2-mist text-xs uppercase tracking-wider text-v2-ink/60 font-bold border-b border-v2-line">
              <tr>
                <th className="px-6 py-4">Property</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Added On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-v2-line">
              {filtered?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-v2-ink/50">
                    No properties found.
                  </td>
                </tr>
              ) : (
                filtered?.map(p => (
                  <tr key={p.id} className="hover:bg-v2-mist/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-v2-ink">{p.title}</td>
                    <td className="px-6 py-4 text-v2-ink">
                      {p.price.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-6 py-4 text-v2-ink/70 capitalize">{p.property_type}</td>
                    <td className="px-6 py-4">
                      {p.status === 'active' ? <Badge variant="default" className="text-[10px]">ACTIVE</Badge> : 
                       p.status === 'draft' ? <Badge variant="secondary" className="text-[10px]">DRAFT</Badge> : 
                       <Badge variant="gold" className="text-[10px]">{p.status.toUpperCase()}</Badge>}
                    </td>
                    <td className="px-6 py-4 text-v2-ink/70">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link to="/v2/admin/properties/$id/edit" params={{ id: p.id }} className="text-v2-green font-semibold hover:underline">Edit</Link>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        disabled={isDeleting === p.id}
                        className="text-destructive font-semibold hover:underline disabled:opacity-50"
                      >
                        {isDeleting === p.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
