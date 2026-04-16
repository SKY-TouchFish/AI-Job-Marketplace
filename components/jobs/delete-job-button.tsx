"use client";

import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    const confirmed = window.confirm("Delete this job permanently?");

    if (!confirmed) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE"
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(result.error || "Unable to delete job.");
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
        {isPending ? "Deleting..." : "Delete job"}
      </button>
    </div>
  );
}
