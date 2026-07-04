"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { ArrowLeft } from "lucide-react"
import { GuestRoute } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { getDashboardPath, useAuth } from "@/providers/auth-provider"
import { UserRole } from "@/types/user"

const baseSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  email: z.string().min(1, "Email is required.").email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  phone: z.string().optional(),
  organisation: z.string().optional(),
})

interface RegisterViewProps {
  role: UserRole
}

export default function RegisterView({ role }: RegisterViewProps) {
  const { register: registerUser } = useAuth()
  const router = useRouter()
  const isOrganiser = role === "organiser"

  const formSchema = baseSchema.superRefine((data, ctx) => {
    if (isOrganiser && !data.organisation?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Organisation is required.",
        path: ["organisation"],
      })
    }
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phone: "",
      organisation: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const response = await registerUser({
        email: data.email,
        password: data.password,
        role,
        full_name: data.fullName,
        phone: data.phone || undefined,
        organisation: isOrganiser ? data.organisation : undefined,
      })
      toast.success("Registration successful!")
      router.push(getDashboardPath(response.user.role))
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: string; errors?: string[] } }
      }
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.errors?.[0] ||
          "Registration failed."
      )
    }
  }

  return (
    <GuestRoute>
      <div className="flex min-h-svh flex-col items-center justify-center bg-linear-to-b from-background to-zinc-50/50 p-6 dark:to-zinc-950/20">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
        <Card className="w-full border-zinc-200/50 shadow-lg sm:max-w-md dark:border-zinc-800/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {isOrganiser ? "Register as Organiser" : "Register as Attendee"}
            </CardTitle>
            <CardDescription>
              Create your account to {isOrganiser ? "manage sessions" : "build your agenda"}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="fullName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                      <Input {...field} id={field.name} placeholder="Jane Doe" />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                {isOrganiser && (
                  <Controller
                    name="organisation"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Organisation</FieldLabel>
                        <Input {...field} id={field.name} placeholder="Acme Events" />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                )}
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="email"
                        autoComplete="email"
                        placeholder="name@example.com"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                      />
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
                      <FieldLabel htmlFor={field.name}>Phone (optional)</FieldLabel>
                      <Input {...field} id={field.name} placeholder="+1 555 0100" />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" form="register-form" className="w-full font-semibold">
              Create Account
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-primary underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </GuestRoute>
  )
}
