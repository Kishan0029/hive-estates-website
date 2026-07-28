import { createFileRoute, Outlet, redirect, useRouter, Link } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session && location.pathname !== "/admin/login") {
      throw redirect({ to: "/admin/login" });
    }
    return { session };
  },
  component: AdminLayout,
  errorComponent: ({ error }) => {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-destructive/10 text-destructive p-6 rounded-3xl border border-destructive/20 text-center">
          <h2 className="font-bold text-lg mb-2">Dashboard Error</h2>
          <p className="text-sm opacity-90 mb-4">{error.message}</p>
          <p className="text-xs opacity-75">
            If this happens on a deployed site, ensure you have set all required environment variables like <code>SUPABASE_SERVICE_ROLE_KEY</code> in your hosting provider's dashboard.
          </p>
        </div>
      </div>
    );
  }
});

function AdminLayout() {
  const { session } = Route.useRouteContext();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Auth redirect is now handled perfectly in beforeLoad, no flash!

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.navigate({ to: "/admin/login" });
    setIsLoggingOut(false);
  };

  if (!session) {
    // If not logged in, just render the child (which should be the login page)
    // without the admin dashboard UI shell.
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      {/* Admin Navbar */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container-p mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
            </div>
            <span className="font-display font-bold text-lg tracking-tight">Hive <span className="text-primary">Admin</span></span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-muted-foreground hidden sm:inline-block">
              {session.user.email}
            </span>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-xs font-bold px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="container-p mx-auto px-4 flex gap-6 overflow-x-auto">
          <Link to="/admin" className="px-4 py-3 text-sm font-bold border-b-2 border-transparent data-[status=active]:border-primary data-[status=active]:text-primary text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap" activeOptions={{ exact: true }}>
            Dashboard
          </Link>
          <Link to="/admin/properties" className="px-4 py-3 text-sm font-bold border-b-2 border-transparent data-[status=active]:border-primary data-[status=active]:text-primary text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
            Properties
          </Link>
          <Link to="/admin/inquiries" className="px-4 py-3 text-sm font-bold border-b-2 border-transparent data-[status=active]:border-primary data-[status=active]:text-primary text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
            Inquiries / Leads
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 container-p mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
