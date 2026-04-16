import type { JobRecord } from "@/lib/jobs/queries";

type JobListProps = {
  jobs: JobRecord[];
};

export function JobList({ jobs }: JobListProps) {
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
        <article className="panel job-card" key={job.id}>
          <div className="panel-inner stack">
            <div className="stack" style={{ gap: 10 }}>
              <p className="eyebrow">Open role</p>
              <h2 style={{ margin: 0, fontSize: "1.6rem" }}>{job.title}</h2>
              <p className="helper-text">{job.description}</p>
            </div>

            <div className="skill-list">
              {job.required_skills.map((skill) => (
                <span className="skill-chip" key={`${job.id}-${skill}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
