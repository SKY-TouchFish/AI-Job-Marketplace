"use client";

import { DeleteJobButton } from "@/components/jobs/delete-job-button";
import Image from "next/image";
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
  const [isGeneratingSkills, startGeneratingSkills] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [requiredSkills, setRequiredSkills] = useState(
    initialValues?.requiredSkills.join(", ") || ""
  );

  function handleSubmit() {
    const payload = {
      title,
      description,
      requiredSkills
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

  function handleGenerateSkills() {
    setError(null);
    setMessage(null);

    if (!description.trim()) {
      setError("Add a job description before generating skills.");
      return;
    }

    startGeneratingSkills(async () => {
      const response = await fetch("/api/ai/generate-skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ description })
      });

      const result = (await response.json()) as { error?: string; skills?: string[] };

      if (!response.ok || !result.skills) {
        setError(result.error || "Unable to generate skills.");
        return;
      }

      setRequiredSkills(result.skills.join(", "));
      setMessage("Skills generated with AI.");
    });
  }

  return (
    <section className="panel">
      <div className="panel-inner stack">
        {/* <div className="stack" style={{ gap: 8 }}>
          <h1 style={{ margin: 0, fontSize: "2.2rem" }}>
            {mode === "create" ? "Post a new job" : "Edit job"}
          </h1>
        </div> */}

        <form action={handleSubmit} className="stack">
          <label className="field">
            <span className="label">Title</span>
            <input
              className="input"
              type="text"
              name="title"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>

          <label className="field">
            <span className="label">Description</span>
            <textarea
              className="input input-textarea"
              name="description"
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <label className="field">
            <span className="label">Required skills</span>
            <div className="field-toolbar">
              <button
                className="pill ai-button"
                type="button"
                onClick={handleGenerateSkills}
                disabled={isGeneratingSkills}
              >
                <span className="ai-button-icon" aria-hidden="true">
                  <Image alt="" height={16} src="/openai.svg" width={16} />
                </span>
                {isGeneratingSkills ? "Generating..." : "Generate Skills with AI"}
              </button>
            </div>
            <input
              className="input"
              type="text"
              name="requiredSkills"
              required
              placeholder="React, TypeScript, Supabase"
              value={requiredSkills}
              onChange={(event) => setRequiredSkills(event.target.value)}
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
