import {useTranslations, useLocale} from "next-intl";
import {Link} from "@/i18n/navigation";
import { formatJobDate } from "@/lib/jobs/format";
import { MatchScoreGauge } from "@/components/jobs/match-score-gauge";
import type { JobRecord } from "@/lib/jobs/queries";

type JobListProps = {
  jobs: JobRecord[];
  currentUserId?: string;
};

// 同一列表用于公开职位页和控制面板，只有发布者会看到快捷编辑入口。
// Share the list between the public job board and dashboard, with an edit shortcut for the creator.
export function JobList({ jobs, currentUserId }: JobListProps) {
  const t = useTranslations();
  const locale = useLocale();
  if (jobs.length === 0) {
    return (
      <section className="panel">
        <div className="panel-inner">
          <p className="eyebrow">{t("noListingsYet")}</p>
          <h2 style={{ margin: "8px 0 12px", fontSize: "1.8rem" }}>{t("noJobsHaveBeenPosted")}</h2>
          <p className="helper-text">{t("onceEmployersCreateJobPostsThey")}</p>
        </div>
      </section>
    );
  }

  return (
    <div className="jobs-grid">
      {jobs.map((job) => (
        <article className="panel job-card job-card-clickable" key={job.id}>
          {job.created_by === currentUserId ? (
            <Link
              aria-label={t("editTitle", {title: job.title})}
              className="icon-button job-card-edit"
              href={`/dashboard/jobs/${job.id}/edit`}
            >
              <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
                <path
                  d="M4 20h4l10-10-4-4L4 16v4Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
                <path
                  d="m13 7 4 4"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            </Link>
          ) : null}

          <Link className="job-card-link panel-inner stack" href={`/dashboard/jobs/${job.id}`}>
            <div className="job-card-header">
              <div className="stack" style={{ gap: 10 }}>
                <p className="eyebrow">{t("openRole")}</p>
                <h2 style={{ margin: 0, fontSize: "1.6rem" }}>{job.title}</h2>
                <p className="job-meta">{formatJobDate(job.created_at, locale)}</p>
                <p className="helper-text preserve-lines">{job.description}</p>
              </div>
            </div>

            <div className="job-card-skills">
              <div className="skill-list">
                {job.required_skills.map((skill) => (
                  <span className="skill-chip" key={`${job.id}-${skill}`}>
                    {skill}
                  </span>
                ))}
              </div>
              <div className="job-card-score">
                <p className="job-card-score-label">{t("matchScore")}</p>
                <MatchScoreGauge value={job.match_score} />
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
