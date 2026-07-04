import { PortalLayout } from "@/components/portal-layout"

export default function AttendeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PortalLayout role="attendee" title="AgendaFlow Attendee">
      {children}
    </PortalLayout>
  )
}
