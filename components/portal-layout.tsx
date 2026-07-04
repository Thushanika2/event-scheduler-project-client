"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Home,
  LayoutDashboard,
  List,
  LogOut,
  Menu,
  Moon,
  Sun,
  User,
  X,
} from "lucide-react"
import { AuthenticatedRoute } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/auth-provider"
import { UserRole } from "@/types/user"

interface MenuItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const attendeeMenu: MenuItem[] = [
  { title: "Dashboard", href: "/attendee/dashboard", icon: LayoutDashboard },
  { title: "My Agenda", href: "/attendee/agenda", icon: List },
  { title: "Profile", href: "/attendee/profile", icon: User },
]

const organiserMenu: MenuItem[] = [
  { title: "Dashboard", href: "/organiser/dashboard", icon: LayoutDashboard },
  { title: "My Sessions", href: "/organiser/sessions", icon: CalendarDays },
  { title: "Profile", href: "/organiser/profile", icon: User },
]

interface PortalLayoutProps {
  children: React.ReactNode
  role: UserRole
  title: string
}

export function PortalLayout({ children, role, title }: PortalLayoutProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const menuItems = role === "organiser" ? organiserMenu : attendeeMenu

  const activeLink = (href: string) => {
    if (href.endsWith("/dashboard")) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <AuthenticatedRoute allowedRoles={[role]}>
      <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
        {isMobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-xs md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out md:sticky md:z-10 ${
            isCollapsed ? "w-20" : "w-64"
          } ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          <div className="flex h-16 items-center justify-between border-b border-border/60 px-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 overflow-hidden hover:opacity-90"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <CalendarDays className="h-5 w-5" />
              </div>
              {!isCollapsed && (
                <span className="text-base font-bold tracking-tight">{title}</span>
              )}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeLink(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              )
            })}
          </nav>

          <div className="space-y-2.5 border-t border-border/60 p-3">
            <Link
              href="/schedule"
              className="group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <Home className="h-4.5 w-4.5 shrink-0" />
              {!isCollapsed && <span>Public Schedule</span>}
            </Link>

            <div className="flex items-center justify-between gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative flex h-9 w-full items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
                aria-label="Toggle theme"
              >
                <Sun className="h-4.5 w-4.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4.5 w-4.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden h-9 w-full items-center justify-center rounded-lg text-muted-foreground hover:text-foreground md:flex"
                aria-label="Toggle sidebar"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4.5 w-4.5" />
                ) : (
                  <ChevronLeft className="h-4.5 w-4.5" />
                )}
              </Button>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border/30 bg-muted/40 p-1.5">
              <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                <span className="text-xs font-bold uppercase">
                  {user?.email?.charAt(0) || "U"}
                </span>
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold leading-none text-foreground">
                    {user?.email}
                  </p>
                  <p className="pt-0.5 text-[10px] font-bold uppercase leading-none tracking-wider text-muted-foreground">
                    {user?.role}
                  </p>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 md:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <CalendarDays className="h-4.5 w-4.5" />
              </div>
              <span className="text-sm font-bold tracking-tight">{title}</span>
            </Link>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </header>

          <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthenticatedRoute>
  )
}
