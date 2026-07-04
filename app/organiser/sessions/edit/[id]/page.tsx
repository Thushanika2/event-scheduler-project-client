import SessionEditView from "@/sections/organiser/view/session-edit-view"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditSessionPage({ params }: PageProps) {
  const { id } = await params
  return <SessionEditView sessionId={id} />
}
