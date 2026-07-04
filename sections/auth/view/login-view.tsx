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
import { PasswordInput } from "@/components/password-input"
import { Logo } from "@/components/logo"
import { getDashboardPath, useAuth } from "@/providers/auth-provider"

const formSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
})

export default function LoginView() {
  const { login } = useAuth()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const response = await login(data.email, data.password)
      toast.success("Logged in successfully!")
      router.push(getDashboardPath(response.user.role))
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: string; errors?: string[] } }
      }
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.errors?.[0] ||
          "Failed to log in."
      )
    }
  }

  return (
    <GuestRoute>
      <div className="flex min-h-svh flex-col items-center justify-center bg-linear-to-b from-background to-primary/5 p-6 dark:to-primary/10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
        <Card className="w-full border-primary/20 shadow-lg sm:max-w-md">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <Logo showText size={40} />
            </div>
            <div className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Sign In
            </CardTitle>
            <CardDescription>
              Enter your credentials to access your portal.
            </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
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
                      <PasswordInput
                        {...field}
                        id={field.name}
                        autoComplete="current-password"
                        placeholder="••••••••"
                      />
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
            <Button type="submit" form="login-form" className="w-full font-semibold">
              Sign In
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="font-medium text-primary underline">
                Register as Attendee
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </GuestRoute>
  )
}
