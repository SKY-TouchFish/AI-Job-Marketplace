"use client";

import {useTranslations} from "next-intl";
import {useRouter} from "@/i18n/navigation";
import { useState, useTransition } from "react";

type DeleteJobButtonProps = {
  jobId: string;
  redirectTo?: string;
  inline?: boolean;
};

export function DeleteJobButton({
  jobId,
  redirectTo = "/dashboard",
  inline = false
}: DeleteJobButtonProps) {
  const t = useTranslations();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // 先确认永久删除，接口成功后再跳转。
  // Confirm the permanent deletion and navigate only after the API succeeds.
  function handleDelete() {
    const confirmed = window.confirm(t("deleteThisJobPermanently"));

    if (!confirmed) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE"
      });


      if (!response.ok) {
        setError(t("unableToDeleteJob"));
        return;
      }

      router.replace(redirectTo);
      router.refresh();
    });
  }

  return (
    <div className={inline ? "delete-job-inline" : "delete-job-stack"}>
      {error ? <div className="notice notice-error">{error}</div> : null}
      <button className="button button-danger" onClick={handleDelete} disabled={isPending} type="button">
        {isPending ? t("deleting") : t("deleteJob")}
      </button>
    </div>
  );
}
