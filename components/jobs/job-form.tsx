"use client";

import {useTranslations} from "next-intl";
import { DeleteJobButton } from "@/components/jobs/delete-job-button";
import Image from "next/image";
import {Link} from "@/i18n/navigation";
import {useRouter} from "@/i18n/navigation";
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
  const t = useTranslations();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isGeneratingSkills, startGeneratingSkills] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  // 将已有技能数组转为逗号分隔的文本，方便直接编辑。
  // Convert the existing skills array to comma-separated text for editing.
  const [requiredSkills, setRequiredSkills] = useState(
    initialValues?.requiredSkills.join(", ") || ""
  );

  function handleSubmit() {
    const payload = {
      title,
      description,
      requiredSkills
    };

    // 在发起请求前，使用职位接口共用的规则校验表单。
    // Validate the form before sending the request using the same rules as the jobs API.
    const validation = validateCreateJobInput(payload);

    setError(null);
    setMessage(null);

    if (!validation.success) {
      setError(!title.trim() ? t("titleIsRequired") : !description.trim() ? t("descriptionIsRequired") : t("atLeastOneRequiredSkillIs"));
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


      if (!response.ok) {
        setError(t("unableToSaveJob"));
        return;
      }

      setMessage(mode === "create" ? t("jobCreatedSuccessfully") : t("jobUpdatedSuccessfully"));

      if (mode === "edit" && jobId) {
        router.replace(`/dashboard/jobs/${jobId}`);
      } else {
        router.refresh();
      }
    });
  }

  // 生成结果只替换表单里的技能草稿，保存由表单提交触发。
  // Generation only replaces the skill draft in the form. Submitting the form saves it.
  function handleGenerateSkills() {
    setError(null);
    setMessage(null);

    if (!description.trim()) {
      setError(t("addAJobDescriptionBeforeGenerating"));
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
        setError(t("unableToGenerateSkills"));
        return;
      }

      setRequiredSkills(result.skills.join(", "));
      setMessage(t("skillsGeneratedWithAi"));
    });
  }

  return (
    <section className="panel">
      <div className="panel-inner stack">
        {/* <div className="stack" style={{ gap: 8 }}>
          <h1 style={{ margin: 0, fontSize: "2.2rem" }}>
            {mode === "create" ? t("postANewJob") : t("editJob")}
          </h1>
        </div> */}

        <form action={handleSubmit} className="stack">
          <label className="field">
            <span className="label">{t("title")}</span>
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
            <span className="label">{t("description")}</span>
            <textarea
              className="input input-textarea"
              name="description"
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <div className="field">
            <label className="label" htmlFor="requiredSkills">{t("requiredSkills")}</label>
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
                {isGeneratingSkills ? t("generating") : t("generateSkillsWithAi")}
              </button>
            </div>
            <input
              id="requiredSkills"
              className="input"
              type="text"
              name="requiredSkills"
              required
              placeholder="React, TypeScript, Supabase"
              value={requiredSkills}
              onChange={(event) => setRequiredSkills(event.target.value)}
            />
          </div>

          {error ? <div className="notice notice-error">{error}</div> : null}
          {message ? <div className="notice notice-success">{message}</div> : null}

          <div className="inline-actions">
            <button className="button" type="submit" disabled={isPending}>
              {isPending
                ? mode === "create"
                  ? t("publishing")
                  : t("saving")
                : mode === "create"
                  ? t("publishJob")
                  : t("saveChanges")}
            </button>
            <Link className="pill" href={mode === "edit" && jobId ? `/dashboard/jobs/${jobId}` : "/dashboard"}>
              {mode === "edit" ? t("backToJob") : t("backToDashboard")}
            </Link>
            {mode === "edit" && jobId ? <DeleteJobButton inline jobId={jobId} /> : null}
          </div>
        </form>
      </div>
    </section>
  );
}
