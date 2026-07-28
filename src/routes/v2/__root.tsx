import { Outlet, createRootRoute } from "@tanstack/react-router"
import { TopNav } from "@/components-v2/TopNav"
import { Footer } from "@/components-v2/Footer"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="flex min-h-screen flex-col bg-v2-paper text-v2-ink">
      <TopNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
