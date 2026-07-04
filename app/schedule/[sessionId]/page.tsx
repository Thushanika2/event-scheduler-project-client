import SessionDetailView from "@/sections/schedule/view/session-detail-view"

interface PageProps {
  params: Promise<{ sessionId: string }>
}

export default async function SessionDetailPage({ params }: PageProps) {
  const { sessionId } = await params
  return (
    <div className="min-h-svh bg-background px-6 py-8">
      <SessionDetailView sessionId={sessionId} />
    </div>
  )
}
