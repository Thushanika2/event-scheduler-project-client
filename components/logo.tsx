import { cn } from "@/lib/utils"

interface LogoMarkProps {
  className?: string
  size?: number
  gradientId?: string
}

export function LogoMark({
  className,
  size = 32,
  gradientId = "agendaflow-gradient",
}: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="4"
          y1="28"
          x2="28"
          y2="4"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0f766e" />
          <stop offset="0.5" stopColor="#14b8a6" />
          <stop offset="1" stopColor="#2dd4bf" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill={`url(#${gradientId})`} />
      {/* Calendar header */}
      <rect x="8" y="9" width="16" height="3.5" rx="1.25" fill="white" fillOpacity="0.95" />
      <rect x="10.5" y="7" width="2" height="4" rx="1" fill="white" fillOpacity="0.85" />
      <rect x="19.5" y="7" width="2" height="4" rx="1" fill="white" fillOpacity="0.85" />
      {/* Calendar body */}
      <rect
        x="8"
        y="13.5"
        width="16"
        height="11"
        rx="1.5"
        fill="white"
        fillOpacity="0.18"
        stroke="white"
        strokeOpacity="0.55"
        strokeWidth="0.75"
      />
      {/* Session dots */}
      <circle cx="12" cy="17.5" r="1.35" fill="white" fillOpacity="0.9" />
      <circle cx="16" cy="17.5" r="1.35" fill="white" fillOpacity="0.9" />
      <circle cx="20" cy="17.5" r="1.35" fill="white" fillOpacity="0.65" />
      <circle cx="12" cy="21.5" r="1.35" fill="white" fillOpacity="0.65" />
      <circle cx="16" cy="21.5" r="1.35" fill="white" fillOpacity="0.45" />
    </svg>
  )
}

interface LogoProps {
  className?: string
  markClassName?: string
  showText?: boolean
  textClassName?: string
  size?: number
  subtitle?: string
}

export function Logo({
  className,
  markClassName,
  showText = true,
  textClassName,
  size = 32,
  subtitle,
}: LogoProps) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <LogoMark size={size} className={markClassName} />
      {showText && (
        <div className="min-w-0 leading-none">
          <span
            className={cn(
              "block truncate text-base font-bold tracking-tight text-foreground",
              textClassName
            )}
          >
            AgendaFlow
          </span>
          {subtitle && (
            <span className="mt-0.5 block truncate text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
