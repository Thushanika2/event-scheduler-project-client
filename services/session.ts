import apiClient from "@/lib/api-client"
import { Session } from "@/types/session"

export interface CreateSessionPayload {
  title: string
  speaker: string
  track: string
  room: string
  start_time: string
  end_time: string
  capacity: number
}

export interface UpdateSessionPayload extends CreateSessionPayload {}

export interface SessionFilters {
  track?: string
  start_time?: string
  end_time?: string
}

export const getSessions = async (filters?: SessionFilters) => {
  const response = await apiClient.get<{ sessions: Session[] }>("/api/sessions", {
    params: filters,
  })
  return response.data
}

export const getSession = async (id: string | number) => {
  const response = await apiClient.get<{ session: Session }>(
    `/api/sessions/${id}`
  )
  return response.data
}

export const getOrganiserSessions = async () => {
  const response = await apiClient.get<{ sessions: Session[] }>(
    "/api/organiser/sessions"
  )
  return response.data
}

export const createSession = async (payload: CreateSessionPayload) => {
  const response = await apiClient.post<{ message: string; session: Session }>(
    "/api/sessions",
    payload
  )
  return response.data
}

export const updateSession = async (
  id: string | number,
  payload: UpdateSessionPayload
) => {
  const response = await apiClient.put<{ message: string; session: Session }>(
    `/api/sessions/${id}`,
    payload
  )
  return response.data
}

export const deleteSession = async (id: string | number) => {
  const response = await apiClient.delete<{ message: string }>(
    `/api/sessions/${id}`
  )
  return response.data
}

export const getSessionPopularity = async (id: string | number) => {
  const response = await apiClient.get<{
    session_id: number
    title: string
    capacity: number
    booking_count: number
    is_full: boolean
    spots_remaining: number
  }>(`/api/sessions/${id}/popularity`)
  return response.data
}
