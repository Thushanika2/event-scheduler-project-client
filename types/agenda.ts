import { Session } from "./session"

export interface AgendaItem {
  id: number
  attendee_id: number
  session_id: number
  added_at: string | null
  session?: Session
}
