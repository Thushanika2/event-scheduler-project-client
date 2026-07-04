import { format, parseISO } from "date-fns"

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—"
  try {
    return format(parseISO(iso), "MMM d, yyyy h:mm a")
  } catch {
    return iso
  }
}

export function formatTimeRange(
  start: string | null | undefined,
  end: string | null | undefined
): string {
  if (!start || !end) return "—"
  try {
    const startDate = parseISO(start)
    const endDate = parseISO(end)
    return `${format(startDate, "MMM d, h:mm a")} – ${format(endDate, "h:mm a")}`
  } catch {
    return `${start} – ${end}`
  }
}

export function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return ""
  try {
    const date = parseISO(iso)
    const pad = (n: number) => String(n).padStart(2, "0")
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  } catch {
    return ""
  }
}
