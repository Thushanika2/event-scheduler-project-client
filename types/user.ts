import { Attendee } from "./attendee"
import { Organiser } from "./organiser"

export type UserRole = "attendee" | "organiser" | "admin"

export interface User {
  id: number
  email: string
  role: UserRole
  is_active: boolean
  created_at: string | null
  attendee?: Attendee
  organiser?: Organiser
}
