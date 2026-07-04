import apiClient from "@/lib/api-client"
import { Session } from "@/types/session"
import { User } from "@/types/user"

export interface AdminStats {
  users: number
  attendees: number
  organisers: number
  sessions: number
  agenda_items: number
}

export const getAdminStats = async () => {
  const response = await apiClient.get<{ stats: AdminStats }>("/api/admin/stats")
  return response.data
}

export const getAdminUsers = async () => {
  const response = await apiClient.get<{ users: User[] }>("/api/admin/users")
  return response.data
}

export const getAdminSessions = async () => {
  const response = await apiClient.get<{ sessions: Session[] }>(
    "/api/admin/sessions"
  )
  return response.data
}

export const updateAdminUser = async (id: number, isActive: boolean) => {
  const response = await apiClient.put<{ message: string; user: User }>(
    `/api/admin/users/${id}`,
    { is_active: isActive }
  )
  return response.data
}

export const deleteAdminUser = async (id: number) => {
  const response = await apiClient.delete<{ message: string }>(
    `/api/admin/users/${id}`
  )
  return response.data
}

export const deleteAdminSession = async (id: number) => {
  const response = await apiClient.delete<{ message: string }>(
    `/api/admin/sessions/${id}`
  )
  return response.data
}
