"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatTimeRange } from "@/lib/format"
import { deleteSession, getOrganiserSessions } from "@/services/session"
import { Session } from "@/types/session"

export default function SessionListView() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const data = await getOrganiserSessions()
      setSessions(data.sessions)
    } catch {
      toast.error("Failed to load sessions.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  const handleDelete = async () => {
    if (!sessionToDelete) return
    setIsDeleting(true)
    try {
      await deleteSession(sessionToDelete.id)
      toast.success("Session deleted.")
      setSessionToDelete(null)
      fetchSessions()
    } catch {
      toast.error("Failed to delete session.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">My Sessions</h1>
          <p className="mt-1 text-muted-foreground">
            Create and manage your conference sessions.
          </p>
        </div>
        <Button asChild>
          <Link href="/organiser/sessions/new">
            <Plus className="mr-2 h-4 w-4" />
            New Session
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Track</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Loading sessions...
                </TableCell>
              </TableRow>
            ) : sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No sessions yet. Create your first session.
                </TableCell>
              </TableRow>
            ) : (
              sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.title}</TableCell>
                  <TableCell>{session.track}</TableCell>
                  <TableCell>{session.room}</TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {formatTimeRange(session.start_time, session.end_time)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>
                        {session.booking_count ?? 0}/{session.capacity}
                      </span>
                      {session.is_full && (
                        <Badge variant="destructive">Full</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/organiser/sessions/edit/${session.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSessionToDelete(session)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!sessionToDelete} onOpenChange={() => setSessionToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete session?</DialogTitle>
            <DialogDescription>
              This will permanently delete &quot;{sessionToDelete?.title}&quot;.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSessionToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
