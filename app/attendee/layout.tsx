import { PortalLayout } from "@/components/portal-layout"

export default function AttendeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PortalLayout role="attendee" title="Attendee Portal">
      {children}
    </PortalLayout>
  )
}
