"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import SessionForm, {
  SessionFormValues,
  formValuesToPayload,
} from "@/sections/organiser/session-form"
import { createSession } from "@/services/session"

export default function SessionCreateView() {
  const router = useRouter()

  const handleSubmit = async (values: SessionFormValues) => {
    try {
      await createSession(formValuesToPayload(values))
      toast.success("Session created.")
      router.push("/organiser/sessions")
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: string; errors?: string[] } }
      }
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.errors?.[0] ||
          "Failed to create session."
      )
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">New Session</h1>
        <p className="mt-1 text-muted-foreground">Add a new session to the schedule.</p>
      </div>
      <SessionForm onSubmit={handleSubmit} submitLabel="Create Session" />
    </div>
  )
}
