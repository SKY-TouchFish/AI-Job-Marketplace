import {getTranslations} from "next-intl/server";
import { JobPostForm } from "@/components/jobs/job-post-form";
import { requireUser } from "@/lib/auth";

// 在渲染发布表单前要求用户登录。
// Require sign-in before rendering the job posting form.
export default async function NewJobPage() {
  const t = await getTranslations();
  await requireUser();

  return (
    <main className="shell">
      <div className="container card-grid">
        <div className="topbar">
          <div>
            <p className="eyebrow">{t("aiJobMarketplace")}</p>
            <h1 style={{ margin: "8px 0 0", fontSize: "2.4rem" }}>{t("postAJob")}</h1>
          </div>
        </div>
        <JobPostForm />
      </div>
    </main>
  );
}
