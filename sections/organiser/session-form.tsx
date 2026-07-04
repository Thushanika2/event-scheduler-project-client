"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Session } from "@/types/session"

const formSchema = z
  .object({
    title: z.string().min(1, "Title is required."),
    speaker: z.string().min(1, "Speaker is required."),
    track: z.string().min(1, "Track is required."),
    room: z.string().min(1, "Room is required."),
    startTime: z.string().min(1, "Start time is required."),
    endTime: z.string().min(1, "End time is required."),
    capacity: z.number({ error: "Capacity is required." }).min(1, "Capacity must be at least 1."),
  })
  .refine(
    (data) => new Date(data.endTime) > new Date(data.startTime),
    { message: "End time must be after start time.", path: ["endTime"] }
  )

export type SessionFormValues = z.infer<typeof formSchema>

interface SessionFormProps {
  defaultValues?: Partial<SessionFormValues>
  onSubmit: (values: SessionFormValues) => Promise<void>
  submitLabel?: string
}

export function sessionToFormValues(session: Session): SessionFormValues {
  const toLocal = (iso: string) => {
    const date = new Date(iso)
    const pad = (n: number) => String(n).padStart(2, "0")
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  return {
    title: session.title,
    speaker: session.speaker,
    track: session.track,
    room: session.room,
    startTime: toLocal(session.start_time),
    endTime: toLocal(session.end_time),
    capacity: session.capacity,
  }
}

export function formValuesToPayload(values: SessionFormValues) {
  return {
    title: values.title,
    speaker: values.speaker,
    track: values.track,
    room: values.room,
    start_time: new Date(values.startTime).toISOString(),
    end_time: new Date(values.endTime).toISOString(),
    capacity: values.capacity,
  }
}

export default function SessionForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save Session",
}: SessionFormProps) {
  const form = useForm<SessionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      speaker: "",
      track: "",
      room: "",
      startTime: "",
      endTime: "",
      capacity: 50,
      ...defaultValues,
    },
  })

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Session Details</CardTitle>
        <CardDescription>Fill in the session information below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                  <Input {...field} id={field.name} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="speaker"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Speaker</FieldLabel>
                  <Input {...field} id={field.name} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="track"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Track</FieldLabel>
                    <Input {...field} id={field.name} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="room"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Room</FieldLabel>
                    <Input {...field} id={field.name} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="startTime"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Start Time</FieldLabel>
                    <Input {...field} id={field.name} type="datetime-local" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="endTime"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>End Time</FieldLabel>
                    <Input {...field} id={field.name} type="datetime-local" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <Controller
              name="capacity"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Capacity</FieldLabel>
                  <Input {...field} id={field.name} type="number" min={1} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <Button type="submit">{submitLabel}</Button>
        </form>
      </CardContent>
    </Card>
  )
}
