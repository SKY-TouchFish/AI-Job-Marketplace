"use client";

import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import {useRouter} from "@/i18n/navigation";
import { useState, useTransition } from "react";
import { validateProfileInput } from "@/lib/profile/validation";

type ProfileFormProps = {
  email: string;
  initialValues: {
    displayName: string;
    skills: string[];
  };
};

export function ProfileForm({ email, initialValues }: ProfileFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // 提交可编辑的显示名称和技能字段，邮箱仅用于展示。
  // Submit the editable display name and skills. The email is display-only.
  function handleSubmit(formData: FormData) {
    const payload = {
      displayName: String(formData.get("displayName") || ""),
      skills: String(formData.get("skills") || "")
    };

    const validation = validateProfileInput(payload);

    setError(null);
    setMessage(null);

    if (!validation.success) {
      setError(t("displayNameIsRequired"));
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });


      if (!response.ok) {
        setError(t("unableToUpdateProfile"));
        return;
      }

      setMessage(t("profileUpdatedSuccessfully"));
      // 保存后重新读取服务端提供的资料。
      // Reload the profile data supplied by the server after saving.
      router.refresh();
    });
  }

  return (
    <section className="panel">
      <div className="panel-inner stack">
        <div className="stack" style={{ gap: 8 }}>
          <h1 style={{ margin: 0, fontSize: "2.2rem" }}>{t("profileSettings")}</h1>
        </div>

        <form action={handleSubmit} className="stack">
          <label className="field">
            <span className="label">{t("displayName")}</span>
            <input
              className="input"
              type="text"
              name="displayName"
              required
              defaultValue={initialValues.displayName}
            />
          </label>

          <label className="field">
            <span className="label">{t("emailAddress")}</span>
            <input className="input" type="email" value={email} readOnly disabled />
          </label>

          <label className="field">
            <span className="label">{t("skills")}</span>
            <input
              className="input"
              type="text"
              name="skills"
              defaultValue={initialValues.skills.join(", ")}
              placeholder="React, TypeScript, Supabase"
            />
          </label>

          {error ? <div className="notice notice-error">{error}</div> : null}
          {message ? <div className="notice notice-success">{message}</div> : null}

          <div className="inline-actions">
            <button className="button" type="submit" disabled={isPending}>
              {isPending ? t("saving") : t("saveProfile")}
            </button>
            <Link className="pill" href="/dashboard">{t("backToDashboard")}</Link>
          </div>
        </form>
      </div>
    </section>
  );
}
