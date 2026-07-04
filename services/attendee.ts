import apiClient from "@/lib/api-client"
import { Attendee } from "@/types/attendee"

export interface UpdateAttendeePayload {
  full_name: string
  phone?: string
}

export const getAttendee = async (id: string | number) => {
  const response = await apiClient.get<{ attendee: Attendee }>(
    `/api/attendees/${id}`
  )
  return response.data
}

export const updateAttendee = async (
  id: string | number,
  payload: UpdateAttendeePayload
) => {
  const response = await apiClient.put<{ message: string; attendee: Attendee }>(
    `/api/attendees/${id}`,
    payload
  )
  return response.data
}

export const deleteAttendee = async (id: string | number) => {
  const response = await apiClient.delete<{ message: string }>(
    `/api/attendees/${id}`
  )
  return response.data
}
