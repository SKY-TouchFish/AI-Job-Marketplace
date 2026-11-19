import {getTranslations} from "next-intl/server";
import {Link} from "@/i18n/navigation";
import { JobList } from "@/components/jobs/job-list";
import { getJobs } from "@/lib/jobs/queries";

export default async function JobsPage() {
  const t = await getTranslations();
  // 公开职位列表不传入个人技能，因此卡片使用默认匹配分数。
  // The public job board supplies no profile skills, so cards use the default match score.
  const jobs = await getJobs();

  return (
    <main className="shell">
      <div className="container card-grid">
        <section className="panel">
          <div className="panel-inner stack">
            <p className="eyebrow">{t("jobBoard")}</p>
            <h1 className="title" style={{ marginBottom: 0 }}>{t("browseOpenRoles")}</h1>
            <p className="lead">{t("aMinimalListingPageThatPulls")}</p>
            <div className="pill-links">
              <Link className="pill" href="/">{t("home")}</Link>
              <Link className="pill" href="/dashboard/jobs/new">{t("postAJob")}</Link>
            </div>
          </div>
        </section>

        <JobList jobs={jobs} />
      </div>
    </main>
  );
}
