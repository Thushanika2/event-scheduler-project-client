import { PortalLayout } from "@/components/portal-layout"

export default function OrganiserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PortalLayout role="organiser" title="Organiser Portal">
      {children}
    </PortalLayout>
  )
}
