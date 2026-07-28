import { useState } from "react"
import { useRouter } from "@tanstack/react-router"
import { LOCALITIES } from "@/lib/data"
import { Button } from "./Button"

export function SearchFilterModule() {
  const router = useRouter()
  const [q, setQ] = useState("")
  const [type, setType] = useState<"buy" | "apartments" | "land">("buy")
  const [rooms, setRooms] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    let searchString = q
    if (rooms && type === "apartments") {
      searchString = `${rooms} BHK ${q}`
    }
    router.navigate({
      to: `/v2/${type}`,
      search: { q: searchString },
    })
  }

  return (
    <div className="mx-auto w-full max-w-5xl rounded-3xl bg-v2-paper p-6 shadow-elevated sm:p-8">
      <h3 className="mb-6 text-2xl font-bold text-v2-ink font-display">Find the best place</h3>
      
      <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row sm:items-end">
        
        {/* Looking For (Type) */}
        <div className="flex-1">
          <label className="mb-2 block text-sm font-semibold text-v2-ink">Property Type</label>
          <div className="relative">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full appearance-none rounded-xl bg-v2-mist px-4 py-3.5 text-base font-medium text-v2-ink outline-none focus:ring-2 focus:ring-v2-green"
            >
              <option value="buy">All Properties</option>
              <option value="apartments">Apartments & Homes</option>
              <option value="land">Land & Plots</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-v2-ink/50">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </div>

        {/* Location / Search */}
        <div className="flex-1">
          <label className="mb-2 block text-sm font-semibold text-v2-ink">Location</label>
          <div className="relative">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. Tilakwadi"
              className="w-full rounded-xl bg-v2-mist px-4 py-3.5 text-base font-medium text-v2-ink outline-none focus:ring-2 focus:ring-v2-green"
              list="localities-list"
            />
            <datalist id="localities-list">
              {LOCALITIES.map((l) => (
                <option key={l} value={l} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Rooms (Only for Homes) */}
        {type === "apartments" && (
          <div className="flex-1 hidden md:block">
            <label className="mb-2 block text-sm font-semibold text-v2-ink">Rooms</label>
            <div className="relative">
              <select
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                className="w-full appearance-none rounded-xl bg-v2-mist px-4 py-3.5 text-base font-medium text-v2-ink outline-none focus:ring-2 focus:ring-v2-green"
              >
                <option value="">Any</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4+ BHK</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-v2-ink/50">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="mt-4 sm:mt-0">
          <Button type="submit" size="lg" className="w-full sm:w-auto px-10 text-base shadow-elevated">
            Search Properties
          </Button>
        </div>
      </form>
    </div>
  )
}
