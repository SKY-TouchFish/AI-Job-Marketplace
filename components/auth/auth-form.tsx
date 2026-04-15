"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const redirectTo = useMemo(
    () => searchParams.get("redirectTo") || "/dashboard",
    [searchParams]
  );

  function handleSubmit(formData: FormData) {
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const supabase = createClient();

    setError(null);
    setMessage(null);

    startTransition(async () => {
      const result =
        mode === "login"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({
              email,
              password,
              options: {
                emailRedirectTo:
                  typeof window !== "undefined"
                    ? `${window.location.origin}/dashboard`
                    : undefined
              }
            });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (mode === "signup" && !result.data.session) {
        setMessage("Account created. Check your email to confirm the signup.");
        router.refresh();
        return;
      }

      router.replace(redirectTo);
      router.refresh();
    });
  }

  return (
    <div className="panel auth-card">
      <div className="panel-inner">
        <div className="stack">
          <div>
            <p className="eyebrow">{mode === "login" ? "Welcome back" : "Create account"}</p>
            <h1 style={{ margin: "8px 0 0", fontSize: "2rem" }}>
              {mode === "login" ? "Log in to continue" : "Sign up in minutes"}
            </h1>
          </div>

          <form action={handleSubmit} className="stack">
            <label className="field">
              <span className="label">Email</span>
              <input className="input" type="email" name="email" required autoComplete="email" />
            </label>

            <label className="field">
              <span className="label">Password</span>
              <input
                className="input"
                type="password"
                name="password"
                required
                minLength={8}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </label>

            {error ? <div className="notice notice-error">{error}</div> : null}
            {message ? <div className="notice notice-success">{message}</div> : null}

            <button className="button" type="submit" disabled={isPending}>
              {isPending
                ? mode === "login"
                  ? "Logging in..."
                  : "Creating account..."
                : mode === "login"
                  ? "Log in"
                  : "Create account"}
            </button>
          </form>

          <p style={{ margin: 0, color: "var(--muted)" }}>
            {mode === "login" ? "Need an account?" : "Already registered?"}{" "}
            <Link
              className="subtle-link"
              href={mode === "login" ? "/signup" : "/login"}
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
