export interface Session {
  id: number
  organiser_id: number
  title: string
  speaker: string
  track: string
  room: string
  start_time: string
  end_time: string
  capacity: number
  booking_count?: number
  is_full?: boolean
}
