"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import * as authService from "@/services/auth"
import { RegisterPayload } from "@/services/auth"
import { User } from "@/types/user"

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<authService.LoginResponse>
  register: (payload: RegisterPayload) => Promise<authService.RegisterResponse>
  logout: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function persistAuth(accessToken: string, authUser: User) {
  localStorage.setItem("token", accessToken)
  localStorage.setItem("user", JSON.stringify(authUser))
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }

    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password)
    persistAuth(data.access_token, data.user)
    setToken(data.access_token)
    setUser(data.user)
    return data
  }

  const register = async (payload: RegisterPayload) => {
    const data = await authService.register(payload)
    persistAuth(data.access_token, data.user)
    setToken(data.access_token)
    setUser(data.user)
    return data
  }

  const logout = () => {
    authService.logout().catch(() => {})
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
    router.push("/auth/login")
  }

  const refreshProfile = async () => {
    const data = await authService.getProfile()
    localStorage.setItem("user", JSON.stringify(data.user))
    setUser(data.user)
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function getDashboardPath(role: string): string {
  if (role === "admin") return "/admin/dashboard"
  if (role === "organiser") return "/organiser/dashboard"
  if (role === "attendee") return "/attendee/dashboard"
  return "/"
}
