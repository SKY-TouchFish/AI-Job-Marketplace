import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { requireUser } from "@/lib/auth";
import { getJobs } from "@/lib/jobs/queries";

export default async function DashboardPage() {
  const user = await requireUser();
  const jobs = await getJobs();

  return (
    <main className="shell">
      <div className="container card-grid">
        <div className="topbar">
          <div>
            <p className="eyebrow">Protected route</p>
            <h1 style={{ margin: "8px 0 0", fontSize: "2.4rem" }}>Dashboard</h1>
          </div>
          <SignOutButton />
        </div>

        <section className="panel">
          <div className="panel-inner stack">
            <p className="lead" style={{ margin: 0 }}>
              You are logged in as <strong>{user.email}</strong>.
            </p>
            <p className="lead">
              This page is rendered on the server, and access is enforced in both middleware and
              the server auth helper.
            </p>
            <div className="pill-links">
              <Link className="pill" href="/dashboard/jobs/new">
                Post a job
              </Link>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-inner stack">
            <div className="stack" style={{ gap: 8 }}>
              <p className="eyebrow">Job listings</p>
              <h2 style={{ margin: 0, fontSize: "1.8rem" }}>Open roles</h2>
              <p className="helper-text">
                Jobs are loaded from Supabase and shown here in a simple card list.
              </p>
            </div>

            {jobs.length === 0 ? (
              <p className="helper-text">
                No jobs posted yet. Create the first one from the employer tools above.
              </p>
            ) : (
              <div className="jobs-grid">
                {jobs.map((job) => (
                  <article className="panel job-card" key={job.id}>
                    <div className="panel-inner stack">
                      <div className="stack" style={{ gap: 8 }}>
                        <h3 style={{ margin: 0, fontSize: "1.35rem" }}>{job.title}</h3>
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
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
