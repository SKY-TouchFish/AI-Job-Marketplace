"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    const payload = {
      displayName: String(formData.get("displayName") || ""),
      skills: String(formData.get("skills") || "")
    };

    const validation = validateProfileInput(payload);

    setError(null);
    setMessage(null);

    if (!validation.success) {
      setError(validation.error);
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

      const result = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        setError(result.error || "Unable to update profile.");
        return;
      }

      setMessage(result.message || "Profile updated successfully.");
      router.refresh();
    });
  }

  return (
    <section className="panel">
      <div className="panel-inner stack">
        <div className="stack" style={{ gap: 8 }}>
          <h1 style={{ margin: 0, fontSize: "2.2rem" }}>Profile settings</h1>
        </div>

        <form action={handleSubmit} className="stack">
          <label className="field">
            <span className="label">Display name</span>
            <input
              className="input"
              type="text"
              name="displayName"
              required
              defaultValue={initialValues.displayName}
            />
          </label>

          <label className="field">
            <span className="label">Email address</span>
            <input className="input" type="email" value={email} readOnly disabled />
          </label>

          <label className="field">
            <span className="label">Skills</span>
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
              {isPending ? "Saving..." : "Save profile"}
            </button>
            <Link className="pill" href="/dashboard">
              Back to dashboard
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
