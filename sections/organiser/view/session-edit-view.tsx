"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import SessionForm, {
  SessionFormValues,
  formValuesToPayload,
  sessionToFormValues,
} from "@/sections/organiser/session-form"
import { getSession, updateSession } from "@/services/session"

interface SessionEditViewProps {
  sessionId: string
}

export default function SessionEditView({ sessionId }: SessionEditViewProps) {
  const router = useRouter()
  const [defaultValues, setDefaultValues] = useState<SessionFormValues | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSession(sessionId)
      .then((data) => setDefaultValues(sessionToFormValues(data.session)))
      .catch(() => toast.error("Session not found."))
      .finally(() => setLoading(false))
  }, [sessionId])

  const handleSubmit = async (values: SessionFormValues) => {
    try {
      await updateSession(sessionId, formValuesToPayload(values))
      toast.success("Session updated.")
      router.push("/organiser/sessions")
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: string; errors?: string[] } }
      }
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.errors?.[0] ||
          "Failed to update session."
      )
    }
  }

  if (loading) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Loading session...
      </div>
    )
  }

  if (!defaultValues) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Session not found.
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Edit Session</h1>
        <p className="mt-1 text-muted-foreground">Update session details.</p>
      </div>
      <SessionForm
        key={sessionId}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        submitLabel="Update Session"
      />
    </div>
  )
}
