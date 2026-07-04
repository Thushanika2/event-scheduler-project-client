import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import ScheduleListView from "@/sections/schedule/view/schedule-list-view"

export default function SchedulePage() {
  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Link href="/" className="hidden sm:block hover:opacity-90">
            <Logo showText />
          </Link>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Conference schedule
          </h1>
          <p className="mt-1 text-muted-foreground">
            Browse all sessions. Filter by track or time range.
          </p>
        </div>
        <ScheduleListView />
      </div>
    </div>
  )
}
