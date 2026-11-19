import {getTranslations, getLocale} from "next-intl/server";
import {Link} from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { DeleteJobButton } from "@/components/jobs/delete-job-button";
import { requireUser } from "@/lib/auth";
import { formatJobDate } from "@/lib/jobs/format";
import { getJobById } from "@/lib/jobs/queries";

type JobDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const t = await getTranslations();
  const locale = await getLocale();
  const user = await requireUser();
  const { id } = await params;

  try {
    const job = await getJobById(id);
    // 依据发布者身份决定是否显示编辑和删除入口。
    // Use ownership to decide whether to show edit and delete controls.
    const isCreator = job.created_by === user.id;

    return (
      <main className="shell">
        <div className="container card-grid">
          <div className="topbar">
            <div>
              <p className="eyebrow">{t("aiJobMarketplace")}</p>
              <h1 style={{ margin: "8px 0 0", fontSize: "2.4rem" }}>{t("jobDetails")}</h1>
            </div>
          </div>

          <section className="panel">
            <div className="panel-inner stack">
              <div className="stack" style={{ gap: 8 }}>
                {/* <p className="eyebrow">Job details</p> */}
                <h1 style={{ margin: 0, fontSize: "2.2rem" }}>{job.title}</h1>
                <p className="job-meta">{formatJobDate(job.created_at, locale)}</p>
                {/* <p className="job-meta">
                  {[job.creator_display_name, job.creator_email, formatJobDate(job.created_at, locale)]
                    .filter(Boolean)
                    .join(" • ")}
                </p> */}
                {/* <p className="helper-text">
                  Full job details in the same minimal layout as the posting flow.
                </p> */}
              </div>

              <section className="detail-block stack">
                <h2 className="section-title">{t("description")}</h2>
                <p className="helper-text preserve-lines">{job.description}</p>
              </section>

              <section className="detail-block stack">
                <h2 className="section-title">{t("requiredSkills")}</h2>
                <div className="skill-list">
                  {job.required_skills.map((skill) => (
                    <span className="skill-chip" key={`${job.id}-${skill}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              <div className="inline-actions">
                {isCreator ? (
                  <Link className="button" href={`/dashboard/jobs/${job.id}/edit`}>{t("editJob")}</Link>
                ) : null}
                <Link className="pill" href="/dashboard">{t("backToDashboard")}</Link>
                {isCreator ? <DeleteJobButton inline jobId={job.id} /> : null}
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  } catch {
    notFound();
  }
}
