import apiClient from "@/lib/api-client"
import { Organiser } from "@/types/organiser"

export interface UpdateOrganiserPayload {
  full_name: string
  organisation: string
  phone?: string
}

export const getOrganiser = async (id: string | number) => {
  const response = await apiClient.get<{ organiser: Organiser }>(
    `/api/organisers/${id}`
  )
  return response.data
}

export const updateOrganiser = async (
  id: string | number,
  payload: UpdateOrganiserPayload
) => {
  const response = await apiClient.put<{
    message: string
    organiser: Organiser
  }>(`/api/organisers/${id}`, payload)
  return response.data
}

export const deleteOrganiser = async (id: string | number) => {
  const response = await apiClient.delete<{ message: string }>(
    `/api/organisers/${id}`
  )
  return response.data
}
