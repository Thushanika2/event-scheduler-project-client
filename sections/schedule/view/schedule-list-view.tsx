"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Eye } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatTimeRange } from "@/lib/format"
import { getSessions } from "@/services/session"
import { Session } from "@/types/session"

export default function ScheduleListView() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [trackFilter, setTrackFilter] = useState<string>("all")
  const [startFilter, setStartFilter] = useState("")
  const [endFilter, setEndFilter] = useState("")
  const [loading, setLoading] = useState(true)

  const tracks = useMemo(
    () => Array.from(new Set(sessions.map((s) => s.track))).sort(),
    [sessions]
  )

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const filters: { track?: string; start_time?: string; end_time?: string } =
        {}
      if (trackFilter !== "all") filters.track = trackFilter
      if (startFilter) filters.start_time = new Date(startFilter).toISOString()
      if (endFilter) filters.end_time = new Date(endFilter).toISOString()

      const data = await getSessions(filters)
      setSessions(data.sessions)
    } catch {
      toast.error("Failed to load schedule.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackFilter, startFilter, endFilter])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Track</label>
          <Select
            value={trackFilter}
            onValueChange={(value) => setTrackFilter(value ?? "all")}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All tracks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tracks</SelectItem>
              {tracks.map((track) => (
                <SelectItem key={track} value={track}>
                  {track}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">From</label>
          <Input
            type="datetime-local"
            value={startFilter}
            onChange={(e) => setStartFilter(e.target.value)}
            className="w-full sm:w-56"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Until</label>
          <Input
            type="datetime-local"
            value={endFilter}
            onChange={(e) => setEndFilter(e.target.value)}
            className="w-full sm:w-56"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setTrackFilter("all")
            setStartFilter("")
            setEndFilter("")
          }}
        >
          Clear filters
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Speaker</TableHead>
              <TableHead>Track</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Loading sessions...
                </TableCell>
              </TableRow>
            ) : sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No sessions found.
                </TableCell>
              </TableRow>
            ) : (
              sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.title}</TableCell>
                  <TableCell>{session.speaker}</TableCell>
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
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/schedule/${session.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
