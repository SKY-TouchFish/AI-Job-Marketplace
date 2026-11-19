"use client";

import {useTranslations, useLocale} from "next-intl";
import {Link} from "@/i18n/navigation";
import {useRouter} from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  // 读取登录后的返回地址，默认进入控制面板。
  // Read the post-login destination, defaulting to the dashboard.
  const redirectTo = useMemo(
    () => {
      const path = searchParams.get("redirectTo") || "";
      return /^\/(?:dashboard|profile)(?:[/?]|$)/.test(path) && !path.includes("\\") ? path : "/dashboard";
    },
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
                    ? `${window.location.origin}/${locale}/dashboard`
                    : undefined
              }
            });

      if (result.error) {
        setError(result.error.code === "invalid_credentials" ? t("invalidEmailOrPassword") : result.error.code === "email_not_confirmed" ? t("pleaseConfirmYourEmail") : t("authenticationFailed"));
        return;
      }

      // 将注册响应中的空身份列表视为邮箱已注册。
      // Treat an empty identities array in the sign-up response as an existing account.
      if (
        mode === "signup" &&
        result.data.user &&
        Array.isArray(result.data.user.identities) &&
        result.data.user.identities.length === 0
      ) {
        setError(t("anAccountWithThisEmailAlready"));
        return;
      }

      // 注册成功但尚未建立会话时，提示用户通过邮件确认。
      // Prompt for email confirmation when sign-up succeeds without creating a session.
      if (mode === "signup" && !result.data.session) {
        setMessage(t("accountCreatedCheckYourEmailTo"));
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
            <p className="eyebrow">{mode === "login" ? t("welcomeBack") : t("createAccount")}</p>
            <h1 style={{ margin: "8px 0 0", fontSize: "2rem" }}>
              {mode === "login" ? t("logInToContinue") : t("signUpInMinutes")}
            </h1>
          </div>

          <form action={handleSubmit} className="stack">
            <label className="field">
              <span className="label">{t("email")}</span>
              <input className="input" type="email" name="email" required autoComplete="email" />
            </label>

            <label className="field">
              <span className="label">{t("password")}</span>
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
                  ? t("loggingIn")
                  : t("creatingAccount")
                : mode === "login"
                  ? t("logIn")
                  : t("createAccount")}
            </button>
          </form>

          <p style={{ margin: 0, color: "var(--muted)" }}>
            {mode === "login" ? t("needAnAccount") : t("alreadyRegistered")}{" "}
            <Link
              className="subtle-link"
              href={mode === "login" ? "/signup" : "/login"}
            >
              {mode === "login" ? t("signUp") : t("logIn")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
