import { createFileRoute, useRouter } from "@tanstack/react-router";
import { getAdminInquiriesFn, markInquiryReadFn } from "@/server-fns/properties";
import { useState } from "react";

export const Route = createFileRoute("/admin/inquiries/")({
  loader: async () => {
    return await getAdminInquiriesFn();
  },
  component: AdminInquiries,
});

function AdminInquiries() {
  const inquiries = Route.useLoaderData();
  const router = useRouter();
  const [markingId, setMarkingId] = useState<string | null>(null);

  const handleMarkRead = async (id: string) => {
    setMarkingId(id);
    try {
      await markInquiryReadFn({ data: { id } });
      router.invalidate();
    } catch (err: any) {
      alert("Failed: " + err.message);
    } finally {
      setMarkingId(null);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Leads & Inquiries</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage customer messages from property pages.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground font-bold border-b border-border">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Name / Contact</th>
                <th className="px-6 py-4">Property</th>
                <th className="px-6 py-4 w-full">Message</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(!inquiries || inquiries.length === 0) ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground">
                    No inquiries yet.
                  </td>
                </tr>
              ) : (
                inquiries.map((inq: any) => (
                  <tr key={inq.id} className={`transition-colors ${inq.status === 'new' ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/10'}`}>
                    <td className="px-6 py-4">
                      {inq.status === 'new' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                          NEW
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-secondary text-muted-foreground border border-border">
                          READ
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(inq.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground">{inq.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{inq.phone}</div>
                      {inq.email && <div className="text-xs text-muted-foreground">{inq.email}</div>}
                    </td>
                    <td className="px-6 py-4 text-primary font-semibold text-xs whitespace-normal max-w-[200px]">
                      {inq.property?.title || "Unknown Property"}
                    </td>
                    <td className="px-6 py-4 whitespace-normal max-w-[300px] text-muted-foreground text-xs leading-relaxed">
                      {inq.message}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {inq.status === 'new' && (
                        <button
                          onClick={() => handleMarkRead(inq.id)}
                          disabled={markingId === inq.id}
                          className="text-primary font-semibold text-xs hover:underline disabled:opacity-50"
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
  );
}
