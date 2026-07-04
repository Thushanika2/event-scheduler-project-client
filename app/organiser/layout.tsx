import { PortalLayout } from "@/components/portal-layout"

export default function OrganiserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PortalLayout role="organiser" title="AgendaFlow Organiser">
      {children}
    </PortalLayout>
  )
}
