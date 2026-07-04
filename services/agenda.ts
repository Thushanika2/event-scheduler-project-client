import apiClient from "@/lib/api-client"
import { AgendaItem } from "@/types/agenda"

export const addToAgenda = async (sessionId: number) => {
  const response = await apiClient.post<{
    message: string
    agenda_item: AgendaItem
    warning?: string
  }>("/api/agenda", { session_id: sessionId })
  return response.data
}

export const getMyAgenda = async () => {
  const response = await apiClient.get<{ agenda_items: AgendaItem[] }>(
    "/api/agenda/my"
  )
  return response.data
}

export const deleteAgendaItem = async (id: string | number) => {
  const response = await apiClient.delete<{ message: string }>(
    `/api/agenda/${id}`
  )
  return response.data
}

export const downloadMyAgenda = async () => {
  const response = await apiClient.get("/api/agenda/my/download", {
    responseType: "blob",
  })
  return response.data as Blob
}
