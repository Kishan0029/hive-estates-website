import { createFileRoute, useRouter } from "@tanstack/react-router"
import { getAdminInquiriesFn, markInquiryReadFn } from "@/server-fns/properties"
import { useState } from "react"
import { Badge } from "@/components-v2/Badge"
import { Button } from "@/components-v2/Button"

export const Route = createFileRoute("/v2/admin/inquiries/")({
  loader: async () => {
    return await getAdminInquiriesFn()
  },
  component: AdminInquiriesV2,
})

function AdminInquiriesV2() {
  const inquiries = Route.useLoaderData()
  const router = useRouter()
  const [markingId, setMarkingId] = useState<string | null>(null)

  const handleMarkRead = async (id: string) => {
    setMarkingId(id)
    try {
      await markInquiryReadFn({ data: { id } })
      router.invalidate()
    } catch (err: any) {
      alert("Failed: " + err.message)
    } finally {
      setMarkingId(null)
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-v2-ink">Leads & Inquiries</h1>
          <p className="text-sm text-v2-ink/60 mt-1">Manage customer messages from property pages.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-v2-line bg-v2-paper shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-v2-mist text-xs uppercase tracking-wider text-v2-ink/60 font-bold border-b border-v2-line">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Name / Contact</th>
                <th className="px-6 py-4">Property</th>
                <th className="px-6 py-4 w-full">Message</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-v2-line">
              {(!inquiries || inquiries.length === 0) ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-v2-ink/50">
                    No inquiries yet.
                  </td>
                </tr>
              ) : (
                inquiries.map((inq: any) => (
                  <tr key={inq.id} className={`transition-colors ${inq.status === 'new' ? 'bg-emerald-50/50 hover:bg-emerald-50' : 'hover:bg-v2-mist/50'}`}>
                    <td className="px-6 py-4">
                      {inq.status === 'new' ? (
                        <Badge variant="default" className="text-[10px]">NEW</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">READ</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-v2-ink/70">
                      {new Date(inq.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-v2-ink">{inq.name}</div>
                      <div className="text-xs text-v2-ink/70 mt-0.5">{inq.phone}</div>
                      {inq.email && <div className="text-xs text-v2-ink/70">{inq.email}</div>}
                    </td>
                    <td className="px-6 py-4 text-v2-green font-semibold text-xs whitespace-normal max-w-[200px]">
                      {inq.property?.title || "Unknown Property"}
                    </td>
                    <td className="px-6 py-4 whitespace-normal max-w-[300px] text-v2-ink/70 text-xs leading-relaxed">
                      {inq.message}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {inq.status === 'new' && (
                        <button
                          onClick={() => handleMarkRead(inq.id)}
                          disabled={markingId === inq.id}
                          className="text-v2-green font-semibold text-xs hover:underline disabled:opacity-50"
                        >
                          {markingId === inq.id ? "Marking..." : "Mark Read"}
                        </button>
                      )}
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
