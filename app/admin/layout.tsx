import { PortalLayout } from "@/components/portal-layout"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PortalLayout role="admin" title="AgendaFlow Admin">
      {children}
    </PortalLayout>
  )
}
