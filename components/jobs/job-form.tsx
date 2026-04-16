"use client";

import { DeleteJobButton } from "@/components/jobs/delete-job-button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { validateCreateJobInput } from "@/lib/jobs/validation";

type JobFormProps = {
  mode: "create" | "edit";
  jobId?: string;
  initialValues?: {
    title: string;
    description: string;
    requiredSkills: string[];
  };
};

export function JobForm({ mode, jobId, initialValues }: JobFormProps) {
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
      const response = await fetch(mode === "create" ? "/api/jobs" : `/api/jobs/${jobId}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        setError(result.error || `Unable to ${mode === "create" ? "create" : "update"} job.`);
        return;
      }

      setMessage(result.message || `Job ${mode === "create" ? "posted" : "updated"} successfully.`);

      if (mode === "edit" && jobId) {
        router.replace(`/dashboard/jobs/${jobId}`);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <section className="panel">
      <div className="panel-inner stack">
        <div className="stack" style={{ gap: 8 }}>
          <p className="eyebrow">Employer tools</p>
          <h1 style={{ margin: 0, fontSize: "2.2rem" }}>
            {mode === "create" ? "Post a new job" : "Edit job"}
          </h1>
          <p className="helper-text">
            Enter the basics and we&apos;ll store the listing in Supabase. Required skills should
            be comma-separated, for example `React, TypeScript, Supabase`.
          </p>
        </div>

        <form action={handleSubmit} className="stack">
          <label className="field">
            <span className="label">Title</span>
            <input
              className="input"
              type="text"
              name="title"
              required
              defaultValue={initialValues?.title || ""}
            />
          </label>

          <label className="field">
            <span className="label">Description</span>
            <textarea
              className="input input-textarea"
              name="description"
              required
              defaultValue={initialValues?.description || ""}
            />
          </label>

          <label className="field">
            <span className="label">Required skills</span>
            <input
              className="input"
              type="text"
              name="requiredSkills"
              required
              placeholder="React, TypeScript, Supabase"
              defaultValue={initialValues?.requiredSkills.join(", ") || ""}
            />
          </label>

          {error ? <div className="notice notice-error">{error}</div> : null}
          {message ? <div className="notice notice-success">{message}</div> : null}

          <div className="inline-actions">
            <button className="button" type="submit" disabled={isPending}>
              {isPending
                ? mode === "create"
                  ? "Publishing..."
                  : "Saving..."
                : mode === "create"
                  ? "Publish job"
                  : "Save changes"}
            </button>
            <Link className="pill" href={mode === "edit" && jobId ? `/dashboard/jobs/${jobId}` : "/dashboard"}>
              {mode === "edit" ? "Back to job" : "Back to dashboard"}
            </Link>
            {mode === "edit" && jobId ? <DeleteJobButton inline jobId={jobId} /> : null}
          </div>
        </form>
      </div>
    </section>
  );
}
