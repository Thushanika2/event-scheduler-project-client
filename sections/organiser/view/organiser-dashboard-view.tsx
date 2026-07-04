"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarPlus, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/providers/auth-provider"
import { getOrganiserSessions } from "@/services/session"

export default function OrganiserDashboardView() {
  const { user } = useAuth()
  const [sessionCount, setSessionCount] = useState(0)

  useEffect(() => {
    getOrganiserSessions()
      .then((data) => setSessionCount(data.sessions.length))
      .catch(() => setSessionCount(0))
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back{user?.email ? `, ${user.email}` : ""}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <List className="h-5 w-5" />
              My Sessions
            </CardTitle>
            <CardDescription>
              {sessionCount} session{sessionCount !== 1 ? "s" : ""} created
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/organiser/sessions">Manage Sessions</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarPlus className="h-5 w-5" />
              Create Session
            </CardTitle>
            <CardDescription>Add a new session to the schedule.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href="/organiser/sessions/new">New Session</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
