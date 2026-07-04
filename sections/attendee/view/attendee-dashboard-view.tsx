"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarDays, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/providers/auth-provider"
import { getMyAgenda } from "@/services/agenda"

export default function AttendeeDashboardView() {
  const { user } = useAuth()
  const [agendaCount, setAgendaCount] = useState(0)

  useEffect(() => {
    getMyAgenda()
      .then((data) => setAgendaCount(data.agenda_items.length))
      .catch(() => setAgendaCount(0))
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
              My Agenda
            </CardTitle>
            <CardDescription>
              {agendaCount} session{agendaCount !== 1 ? "s" : ""} saved
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/attendee/agenda">View Agenda</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-5 w-5" />
              Browse Schedule
            </CardTitle>
            <CardDescription>
              Explore sessions and add them to your agenda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href="/schedule">View Schedule</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
