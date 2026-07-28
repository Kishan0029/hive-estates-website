import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components-v2/Button"

export const Route = createFileRoute("/v2/admin/login")({
  component: AdminLoginV2,
})

function AdminLoginV2() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.navigate({ to: "/v2/admin" })
    }
  }

  return (
    <div className="min-h-screen bg-v2-mist flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-v2-paper rounded-3xl p-8 border border-v2-line shadow-elevated">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-xl bg-v2-green flex items-center justify-center mb-4">
            <span className="text-white font-bold font-display text-2xl">H</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-v2-ink">Admin Login</h1>
          <p className="text-sm text-v2-ink/60 mt-1">Sign in to manage properties</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-v2-ink mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-v2-line bg-v2-mist px-4 py-3 outline-none focus:border-v2-green text-sm"
              placeholder="admin@hiveestate.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-v2-ink mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-v2-line bg-v2-mist px-4 py-3 outline-none focus:border-v2-green text-sm"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" disabled={loading} size="lg" className="w-full shadow-sm mt-4">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  )
}
