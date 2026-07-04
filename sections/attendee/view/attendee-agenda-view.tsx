"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Download, Trash2 } from "lucide-react"
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
import {
  deleteAgendaItem,
  downloadMyAgenda,
  getMyAgenda,
} from "@/services/agenda"
import { AgendaItem } from "@/types/agenda"

export default function AttendeeAgendaView() {
  const [items, setItems] = useState<AgendaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [itemToDelete, setItemToDelete] = useState<AgendaItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchAgenda = async () => {
    setLoading(true)
    try {
      const data = await getMyAgenda()
      setItems(data.agenda_items)
    } catch {
      toast.error("Failed to load agenda.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgenda()
  }, [])

  const handleDelete = async () => {
    if (!itemToDelete) return
    setIsDeleting(true)
    try {
      await deleteAgendaItem(itemToDelete.id)
      toast.success("Session removed from agenda.")
      setItemToDelete(null)
      fetchAgenda()
    } catch {
      toast.error("Failed to remove session.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDownload = async () => {
    try {
      const blob = await downloadMyAgenda()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "my-agenda.pdf"
      link.click()
      window.URL.revokeObjectURL(url)
      toast.success("Agenda downloaded.")
    } catch {
      toast.error("Failed to download agenda.")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">My Agenda</h1>
          <p className="mt-1 text-muted-foreground">
            Your personal schedule, sorted by start time.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button asChild>
            <Link href="/schedule">Browse Schedule</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Session</TableHead>
              <TableHead>Speaker</TableHead>
              <TableHead>Track</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Loading agenda...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No sessions in your agenda yet.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.session?.title || `#${item.session_id}`}
                  </TableCell>
                  <TableCell>{item.session?.speaker || "—"}</TableCell>
                  <TableCell>{item.session?.track || "—"}</TableCell>
                  <TableCell>{item.session?.room || "—"}</TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {item.session
                      ? formatTimeRange(item.session.start_time, item.session.end_time)
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {item.session?.is_full && (
                      <Badge variant="destructive">Full</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setItemToDelete(item)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove from agenda?</DialogTitle>
            <DialogDescription>
              Remove &quot;{itemToDelete?.session?.title}&quot; from your agenda?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setItemToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
