"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { validateCreateJobInput } from "@/lib/jobs/validation";

export function JobPostForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    const payload = {
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || ""),
      requiredSkills: String(formData.get("requiredSkills") || "")
    };

    const validation = validateCreateJobInput(payload);

    setError(null);
    setMessage(null);

    if (!validation.success) {
      setError(validation.error);
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        setError(result.error || "Unable to create job.");
        return;
      }

      setMessage(result.message || "Job posted successfully.");
      router.refresh();
    });
  }

  return (
    <section className="panel">
      <div className="panel-inner stack">
        <div className="stack" style={{ gap: 8 }}>
          <p className="eyebrow">Employer tools</p>
          <h1 style={{ margin: 0, fontSize: "2.2rem" }}>Post a new job</h1>
          <p className="helper-text">
            Enter the basics and we&apos;ll store the listing in Supabase. Required skills should
            be comma-separated, for example `React, TypeScript, Supabase`.
          </p>
        </div>

        <form action={handleSubmit} className="stack">
          <label className="field">
            <span className="label">Title</span>
            <input className="input" type="text" name="title" required />
          </label>

          <label className="field">
            <span className="label">Description</span>
            <textarea className="input input-textarea" name="description" required />
          </label>

          <label className="field">
            <span className="label">Required skills</span>
            <input
              className="input"
              type="text"
              name="requiredSkills"
              required
              placeholder="React, TypeScript, Supabase"
            />
          </label>

          {error ? <div className="notice notice-error">{error}</div> : null}
          {message ? <div className="notice notice-success">{message}</div> : null}

          <div className="inline-actions">
            <button className="button" type="submit" disabled={isPending}>
              {isPending ? "Publishing..." : "Publish job"}
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
