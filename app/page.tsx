import Link from "next/link"
import { CalendarDays, LogIn, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <CalendarDays className="h-6 w-6" />
            Event Scheduler
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/schedule">Schedule</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/login">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">
                <UserPlus className="mr-2 h-4 w-4" />
                Register
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Plan Your Conference Experience
          </h1>
          <p className="text-lg text-muted-foreground">
            Browse sessions by track and time, build your personal agenda, and
            manage conference sessions as an organiser.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/schedule">View Schedule</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/register">Register as Attendee</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/register/organiser">Register as Organiser</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
