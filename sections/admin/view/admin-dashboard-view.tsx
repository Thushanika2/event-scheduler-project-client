"use client"

import { useEffect, useState } from "react"
import { CalendarDays, List, Users } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AdminStats, getAdminStats } from "@/services/admin"

export default function AdminDashboardView() {
  const [stats, setStats] = useState<AdminStats | null>(null)

  useEffect(() => {
    getAdminStats()
      .then((data) => setStats(data.stats))
      .catch(() => setStats(null))
  }, [])

  const items = stats
    ? [
        { label: "Total Users", value: stats.users, icon: Users },
        { label: "Attendees", value: stats.attendees, icon: Users },
        { label: "Organisers", value: stats.organisers, icon: Users },
        { label: "Sessions", value: stats.sessions, icon: CalendarDays },
        { label: "Agenda Items", value: stats.agenda_items, icon: List },
      ]
    : []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Overview of all users, sessions, and agenda activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 ? (
          <p className="text-muted-foreground">Loading stats...</p>
        ) : (
          items.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.label}>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </CardDescription>
                  <CardTitle className="text-3xl">{item.value}</CardTitle>
                </CardHeader>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
