import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to the Hive Estate control panel.</p>
        </div>
        <Link 
          to="/admin/properties/new"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Property
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Active Listings", value: "24", icon: "🏠", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
          { label: "Pending Approvals", value: "3", icon: "⏳", color: "text-accent-foreground", bg: "bg-accent/20", border: "border-accent/30" },
          { label: "Total Inquiries", value: "142", icon: "💬", color: "text-success", bg: "bg-success/10", border: "border-success/20" },
          { label: "Properties Sold", value: "8", icon: "✓", color: "text-muted-foreground", bg: "bg-secondary", border: "border-border" },
        ].map((stat, i) => (
          <div key={i} className={`rounded-3xl border ${stat.border} bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 group cursor-default`}>
            <div className="flex items-center justify-between">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <p className={`font-display text-4xl font-black ${stat.color} tracking-tighter`}>{stat.value}</p>
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-border flex items-center justify-between">
            <h2 className="font-display font-bold text-lg">Quick Actions</h2>
          </div>
          <div className="p-8 grid sm:grid-cols-2 gap-4">
            <Link to="/admin/properties" className="flex flex-col gap-3 p-6 rounded-2xl border border-border bg-background hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-foreground">Manage Properties</h3>
                <p className="text-xs text-muted-foreground mt-1">View, edit, or delete listings.</p>
              </div>
            </Link>
            
            <Link to="/admin" className="flex flex-col gap-3 p-6 rounded-2xl border border-border bg-background hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group opacity-75">
              <div className="w-10 h-10 rounded-xl bg-secondary text-foreground flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-foreground">View Leads (Coming Soon)</h3>
                <p className="text-xs text-muted-foreground mt-1">Check customer inquiries.</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card shadow-sm p-8 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary/20 to-accent/20 flex items-center justify-center mb-6">
              <span className="text-3xl">🚀</span>
            </div>
            <h3 className="font-display font-bold text-xl mb-2">Cloudflare R2 Ready</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Your edge storage is connected. Image uploads are now extremely fast and completely free from egress costs.
            </p>
            <div className="px-4 py-2 rounded-full bg-success/10 text-success text-xs font-bold border border-success/20">
              System Online
            </div>
        </div>
      </div>
    </div>
  );
}
