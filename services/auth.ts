import apiClient from "@/lib/api-client"
import { User, UserRole } from "@/types/user"

export interface RegisterPayload {
  email: string
  password: string
  role: UserRole
  full_name?: string
  organisation?: string
  phone?: string
}

export interface LoginResponse {
  message: string
  access_token: string
  user: User
}

export interface RegisterResponse extends LoginResponse {}

export const login = async (email: string, password: string) => {
  const response = await apiClient.post<LoginResponse>("/api/auth/login", {
    email,
    password,
  })
  return response.data
}

export const register = async (payload: RegisterPayload) => {
  const response = await apiClient.post<RegisterResponse>(
    "/api/auth/register",
    payload
  )
  return response.data
}

export const logout = async () => {
  const response = await apiClient.post<{ message: string }>("/api/auth/logout")
  return response.data
}

export const getProfile = async () => {
  const response = await apiClient.get<{ user: User }>("/api/auth/profile")
  return response.data
}
