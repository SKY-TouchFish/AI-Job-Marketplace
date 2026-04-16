import Link from "next/link";
import { MatchScoreGauge } from "@/components/jobs/match-score-gauge";
import type { JobRecord } from "@/lib/jobs/queries";

type JobListProps = {
  jobs: JobRecord[];
  currentUserId?: string;
};

export function JobList({ jobs, currentUserId }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <section className="panel">
        <div className="panel-inner">
          <p className="eyebrow">No listings yet</p>
          <h2 style={{ margin: "8px 0 12px", fontSize: "1.8rem" }}>No jobs have been posted.</h2>
          <p className="helper-text">
            Once employers create job posts, they&apos;ll show up here for jobseekers to browse.
          </p>
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
              aria-label={`Edit ${job.title}`}
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
                <p className="eyebrow">Open role</p>
                <h2 style={{ margin: 0, fontSize: "1.6rem" }}>{job.title}</h2>
                <p className="helper-text preserve-lines">{job.description}</p>
              </div>
            </div>

            <div className="job-card-score">
              <p className="job-card-score-label">Match Score</p>
              <MatchScoreGauge value={job.match_score} />
            </div>

            <div className="skill-list">
              {job.required_skills.map((skill) => (
                <span className="skill-chip" key={`${job.id}-${skill}`}>
                  {skill}
                </span>
              ))}
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
