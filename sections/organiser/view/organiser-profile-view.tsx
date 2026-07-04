"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
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
import { useAuth } from "@/providers/auth-provider"
import { getProfile } from "@/services/auth"
import { updateOrganiser } from "@/services/organiser"

const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  organisation: z.string().min(1, "Organisation is required."),
  phone: z.string().optional(),
})

export default function OrganiserProfileView() {
  const { user, refreshProfile } = useAuth()
  const [organiserId, setOrganiserId] = useState<number | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: "", organisation: "", phone: "" },
  })

  useEffect(() => {
    getProfile()
      .then((data) => {
        if (data.user.organiser) {
          setOrganiserId(data.user.organiser.id)
          form.reset({
            fullName: data.user.organiser.full_name,
            organisation: data.user.organiser.organisation,
            phone: data.user.organiser.phone || "",
          })
        }
      })
      .catch(() => toast.error("Failed to load profile."))
  }, [form])

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!organiserId) return
    try {
      await updateOrganiser(organiserId, {
        full_name: data.fullName,
        organisation: data.organisation,
        phone: data.phone || undefined,
      })
      await refreshProfile()
      toast.success("Profile updated.")
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: string; errors?: string[] } }
      }
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.errors?.[0] ||
          "Failed to update profile."
      )
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Profile</h1>
        <p className="mt-1 text-muted-foreground">Manage your organiser details.</p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>{user?.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup>
              <Controller
                name="fullName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                    <Input {...field} id={field.name} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="organisation"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Organisation</FieldLabel>
                    <Input {...field} id={field.name} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                    <Input {...field} id={field.name} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
