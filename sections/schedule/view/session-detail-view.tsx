"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CalendarPlus } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatDateTime, formatTimeRange } from "@/lib/format"
import { useAuth } from "@/providers/auth-provider"
import { addToAgenda } from "@/services/agenda"
import { getSession } from "@/services/session"
import { Session } from "@/types/session"

interface SessionDetailViewProps {
  sessionId: string
}

export default function SessionDetailView({ sessionId }: SessionDetailViewProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    getSession(sessionId)
      .then((data) => setSession(data.session))
      .catch(() => toast.error("Session not found."))
      .finally(() => setLoading(false))
  }, [sessionId])

  const handleAddToAgenda = async () => {
    if (!session) return
    setAdding(true)
    try {
      const data = await addToAgenda(session.id)
      if (data.warning) {
        toast.warning(data.warning)
      } else {
        toast.success(data.message)
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } }
      toast.error(err.response?.data?.error || "Failed to add to agenda.")
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Loading session...
      </div>
    )
  }

  if (!session) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Session not found.</p>
        <Button variant="link" asChild className="mt-2">
          <Link href="/schedule">Back to schedule</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/schedule">
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to schedule
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{session.title}</CardTitle>
              <CardDescription className="mt-1">
                {session.speaker} · {session.track}
              </CardDescription>
            </div>
            {session.is_full && <Badge variant="destructive">Full</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <p className="font-medium text-muted-foreground">Room</p>
              <p>{session.room}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Time</p>
              <p>{formatTimeRange(session.start_time, session.end_time)}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Starts</p>
              <p>{formatDateTime(session.start_time)}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Capacity</p>
              <p>
                {session.booking_count ?? 0} / {session.capacity} booked
              </p>
            </div>
          </div>

          {user?.role === "attendee" && (
            <Button
              className="w-full sm:w-auto"
              disabled={session.is_full || adding}
              onClick={handleAddToAgenda}
            >
              <CalendarPlus className="mr-2 h-4 w-4" />
              {session.is_full ? "Session Full" : "Add to My Agenda"}
            </Button>
          )}

          {user?.role === "attendee" && (
            <Button variant="outline" onClick={() => router.push("/attendee/agenda")}>
              View My Agenda
            </Button>
          )}

          {!user && (
            <p className="text-sm text-muted-foreground">
              <Link href="/auth/login" className="text-primary underline">
                Sign in
              </Link>{" "}
              as an attendee to add this session to your agenda.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
