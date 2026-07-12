import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — Hive Estate" }, { name: "robots", content: "noindex" }] }),
  component: Login,
});

function Login() {
  return (
    <div className="container-p mx-auto max-w-md mt-16">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Login to save properties and manage listings</p>
        <form onSubmit={(e) => e.preventDefault()} className="mt-6 space-y-3">
          <input placeholder="Phone or Email" className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm" />
          <input type="password" placeholder="Password" className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm" />
          <button className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground">Login</button>
        </form>
        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" />or<div className="flex-1 h-px bg-border" />
        </div>
        <button className="w-full rounded-md border border-border py-2.5 text-sm font-semibold hover:bg-secondary">Continue with Google</button>
        <button className="w-full mt-2 rounded-md border border-border py-2.5 text-sm font-semibold hover:bg-secondary">Login with OTP</button>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here? <Link to="/login" className="text-accent font-semibold">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
