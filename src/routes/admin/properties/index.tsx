import { createFileRoute, Link } from "@tanstack/react-router";
import { getAdminPropertiesFn, deletePropertyFn } from "@/server-fns/properties";
import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
// Remove Lucide icons if not already installed, I'll use inline SVGs for stability

type PropertiesSearch = { status?: string };

export const Route = createFileRoute("/admin/properties/")({
  validateSearch: (s: Record<string, unknown>): PropertiesSearch => ({ 
    status: typeof s.status === "string" ? s.status : undefined 
  }),
  loader: async () => {
    const properties = await getAdminPropertiesFn();
    return { properties };
  },
  component: AdminPropertiesList,
});

function AdminPropertiesList() {
  const { properties } = Route.useLoaderData();
  const { status } = Route.useSearch();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filtered = properties?.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status ? p.status === status : true;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    setIsDeleting(id);
    try {
      await deletePropertyFn({ data: { id } });
      router.invalidate();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Properties</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all listings, plots, and homes.</p>
        </div>
        
        <Link 
          to="/admin/properties/new"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90 transition-all inline-flex items-center gap-2 shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Property
        </Link>
      </div>

      {status && (
        <div className="mb-4 flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
          <p className="text-sm font-bold text-foreground">
            Filtering by status: <span className="text-primary">{status}</span>
          </p>
          <Link to="/admin/properties" className="text-xs font-semibold text-muted-foreground hover:text-foreground">
            Clear Filter
          </Link>
        </div>
      )}

      <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-border bg-muted/20">
          <div className="relative max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search properties..." 
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground font-bold border-b border-border">
              <tr>
                <th className="px-6 py-4">Property</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Added On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground">
                    No properties found.
                  </td>
                </tr>
              ) : (
                filtered?.map(p => (
                  <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{p.title}</td>
                    <td className="px-6 py-4">
                      {p.price.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground capitalize">{p.property_type}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider
                        ${p.status === 'active' ? 'bg-success/10 text-success border border-success/20' : 
                          p.status === 'draft' ? 'bg-secondary text-foreground border border-border' : 
                          'bg-accent/10 text-accent border border-accent/20'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link to="/admin/properties/$id/edit" params={{ id: p.id }} className="text-primary font-semibold text-xs hover:underline">Edit</Link>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        disabled={isDeleting === p.id}
                        className="text-destructive font-semibold text-xs hover:underline disabled:opacity-50"
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
  );
}
