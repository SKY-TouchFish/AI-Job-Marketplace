import Link from "next/link";
import { JobList } from "@/components/jobs/job-list";
import { getJobs } from "@/lib/jobs/queries";

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <main className="shell">
      <div className="container card-grid">
        <section className="panel">
          <div className="panel-inner stack">
            <p className="eyebrow">Job board</p>
            <h1 className="title" style={{ marginBottom: 0 }}>
              Browse open roles.
            </h1>
            <p className="lead">
              A minimal listing page that pulls jobs from Supabase and presents title,
              description, and required skills in clean cards.
            </p>
            <div className="pill-links">
              <Link className="pill" href="/">
                Home
              </Link>
              <Link className="pill" href="/dashboard/jobs/new">
                Post a job
              </Link>
            </div>
          </div>
        </section>

        <JobList jobs={jobs} />
      </div>
    </main>
  );
}
