"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { LoginInput, loginSchema } from "@/lib/auth/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function fieldError(errors: Record<string, unknown>, name: string) {
  const error = errors[name] as { message?: string } | undefined;
  return error?.message;
}

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin";
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginInput) => {
    setServerError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message =
          typeof payload?.message === "string"
            ? payload.message
            : "Authentication failed. Please try again.";
        setServerError(message);
        toast.error(message);
        return;
      }

      toast.success("Welcome back.");
      router.replace(nextPath.startsWith("/") ? nextPath : "/admin");
      router.refresh();
    } catch {
      const message = "Could not reach the server. Check your connection and try again.";
      setServerError(message);
      toast.error(message);
    }
  };

  const errors = form.formState.errors as Record<string, unknown>;

  return (
    <div className="rounded-lg border border-black/5 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b99525]">
          Admin Access
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1a1e1d]">
          Sign in to Fixora
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Use your admin credentials to manage bookings, professionals, and operations.
        </p>
      </div>

      <form className="mt-7 space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@domain.com"
              className={cn("h-11 bg-slate-50 pl-10", fieldError(errors, "email") && "border-red-500")}
              aria-invalid={!!fieldError(errors, "email")}
              {...form.register("email")}
            />
          </div>
          {fieldError(errors, "email") && (
            <p className="text-sm font-medium text-red-600">{fieldError(errors, "email")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="At least 8 characters"
              className={cn("h-11 bg-slate-50 pl-10 pr-10", fieldError(errors, "password") && "border-red-500")}
              aria-invalid={!!fieldError(errors, "password")}
              {...form.register("password")}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-slate-500 hover:bg-slate-100"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {fieldError(errors, "password") && (
            <p className="text-sm font-medium text-red-600">{fieldError(errors, "password")}</p>
          )}
        </div>

        {serverError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {serverError}
          </div>
        )}

        <Button
          type="submit"
          className="h-11 w-full bg-[#1a1e1d] text-white hover:bg-[#2a302e]"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Sign in
        </Button>
      </form>
    </div>
  );
}
