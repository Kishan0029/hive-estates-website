import { createFileRoute, Outlet, redirect, useRouter } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return { session };
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { session } = Route.useRouteContext();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // If there's no session and we are not on the login page, redirect
  // Note: Since this is the layout for all /admin routes, we actually do the redirect in a useEffect 
  // or we can handle it cleanly based on pathname.
  // Actually, TanStack router beforeLoad can throw redirects, but we want the layout to wrap /admin/login too.
  // Wait, if /admin/login is a child of /admin, it will inherit this layout. We don't want to redirect if we are already on /admin/login.
  
  useEffect(() => {
    if (!session && window.location.pathname !== "/admin/login") {
      router.navigate({ to: "/admin/login" });
    }
  }, [session, router]);

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

      {/* Main Content Area */}
      <main className="flex-1 container-p mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
