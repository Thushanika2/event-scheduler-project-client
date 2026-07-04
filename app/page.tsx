import Link from "next/link"
import { LogIn, Shield, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo, LogoMark } from "@/components/logo"
import { getAdminRegistrationStatus } from "@/services/auth"

export default async function Page() {
  const adminRegistrationAvailable = await getAdminRegistrationStatus()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="hover:opacity-90">
            <Logo showText />
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
          <div className="flex justify-center">
            <LogoMark size={72} className="drop-shadow-sm" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            AgendaFlow
          </h1>
          <p className="text-lg text-muted-foreground">
            Plan your conference experience — browse sessions by track and time,
            build your personal agenda, and manage events as an organiser.
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
            {adminRegistrationAvailable && (
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/register/admin">
                  <Shield className="mr-2 h-4 w-4" />
                  Register as Admin
                </Link>
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
