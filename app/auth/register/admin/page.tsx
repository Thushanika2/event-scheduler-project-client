import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Logo } from "@/components/logo"
import RegisterView from "@/sections/auth/view/register-view"
import { getAdminRegistrationStatus } from "@/services/auth"

export default async function AdminRegisterPage() {
  const adminRegistrationAvailable = await getAdminRegistrationStatus()

  if (!adminRegistrationAvailable) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-linear-to-b from-background to-primary/5 p-6 dark:to-primary/10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
        <Card className="w-full border-primary/20 shadow-lg sm:max-w-md">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <Logo showText size={40} />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Admin Registration Closed
            </CardTitle>
            <CardDescription>
              An administrator account already exists. Sign in with that account
              or contact your system administrator.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return <RegisterView role="admin" />
}
