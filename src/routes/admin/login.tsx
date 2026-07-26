import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Admin Login — Hive Estate" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const router = useRouter();
  const { session } = Route.useRouteContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      router.navigate({ to: "/admin" });
    }
  }, [session, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        // Force a hard navigation to refresh context, or use TanStack Router
        // router.invalidate() is better for TanStack Router to re-fetch beforeLoad
        router.invalidate();
        router.navigate({ to: "/admin" });
      }
    } catch (err: any) {
      setError(err.message || "Invalid login credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Hive Estate Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage properties</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm font-semibold px-4 py-3 rounded-xl border border-destructive/20 flex items-start gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hiveestate.com"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium outline-none focus:border-primary transition"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium outline-none focus:border-primary transition"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3.5 mt-2 text-sm font-bold text-white shadow-sm hover:opacity-90 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
            </button>
          </form>
        </div>
        
        <p className="text-center text-xs text-muted-foreground mt-8">
          Secure admin portal. Access is restricted to authorized personnel only.
        </p>
      </div>
    </div>
  );
}
