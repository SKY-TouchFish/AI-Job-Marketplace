"use client";

import { JobForm } from "@/components/jobs/job-form";

// 将职位发布页接入共享表单的创建模式。
// Connect the posting page to the shared form in create mode.
export function JobPostForm() {
  return <JobForm mode="create" />;
}
