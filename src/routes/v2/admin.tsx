import { createFileRoute, Outlet, redirect, useRouter, Link } from "@tanstack/react-router"
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import { Button } from "@/components-v2/Button"

export const Route = createFileRoute("/v2/admin")({
  beforeLoad: async ({ location }) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session && location.pathname !== "/v2/admin/login") {
      throw redirect({ to: "/v2/admin/login" })
    }
    return { session }
  },
  component: AdminLayoutV2,
})

function AdminLayoutV2() {
  const { session } = Route.useRouteContext()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    router.navigate({ to: "/v2/admin/login" })
    setIsLoggingOut(false)
  }

  if (!session) {
    return <Outlet />
  }

  return (
    <div className="min-h-screen bg-v2-mist flex flex-col font-sans text-v2-ink">
      {/* Admin Navbar */}
      <header className="bg-v2-paper border-b border-v2-line sticky top-0 z-40">
        <div className="container-p mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-v2-green flex items-center justify-center">
              <span className="text-white font-bold font-display text-xl">H</span>
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-v2-ink">Admin</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-v2-ink/60 hidden sm:inline-block">
              {session.user.email}
            </span>
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant="outline"
              size="sm"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <div className="bg-v2-paper border-b border-v2-line shadow-sm">
        <div className="container-p mx-auto px-4 flex gap-6 overflow-x-auto">
          <Link to="/v2/admin" className="px-4 py-3 text-sm font-bold border-b-2 border-transparent data-[status=active]:border-v2-green data-[status=active]:text-v2-green text-v2-ink/60 hover:text-v2-ink transition-colors whitespace-nowrap" activeOptions={{ exact: true }}>
            Dashboard
          </Link>
          <Link to="/v2/admin/properties" className="px-4 py-3 text-sm font-bold border-b-2 border-transparent data-[status=active]:border-v2-green data-[status=active]:text-v2-green text-v2-ink/60 hover:text-v2-ink transition-colors whitespace-nowrap">
            Properties
          </Link>
          <Link to="/v2/admin/inquiries" className="px-4 py-3 text-sm font-bold border-b-2 border-transparent data-[status=active]:border-v2-green data-[status=active]:text-v2-green text-v2-ink/60 hover:text-v2-ink transition-colors whitespace-nowrap">
            Inquiries
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 container-p mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
