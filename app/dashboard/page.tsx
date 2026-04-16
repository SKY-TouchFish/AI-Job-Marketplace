import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { JobList } from "@/components/jobs/job-list";
import { JobMatchForm } from "@/components/jobs/job-match-form";
import { requireUser } from "@/lib/auth";
import { getJobs, parseSkillSearch } from "@/lib/jobs/queries";

type DashboardPageProps = {
  searchParams?: Promise<{
    title?: string;
    skills?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await requireUser();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const title = resolvedSearchParams?.title || "";
  const skills = resolvedSearchParams?.skills || "";
  const jobs = await getJobs({
    title,
    skills: parseSkillSearch(skills)
  });
  const hasFilters = Boolean(title.trim() || skills.trim());

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
              <p className="eyebrow">Job matching</p>
              <h2 style={{ margin: 0, fontSize: "1.8rem" }}>Find matching roles</h2>
              <p className="helper-text">
                Search runs only on the server. Enter a job title and skills, then the dashboard
                renders matching jobs from Supabase.
              </p>
            </div>

            <JobMatchForm defaultTitle={title} defaultSkills={skills} />

            <div className="results-meta">
              <p className="helper-text">
                {hasFilters
                  ? `Found ${jobs.length} matching ${jobs.length === 1 ? "job" : "jobs"}.`
                  : `Showing ${jobs.length} available ${jobs.length === 1 ? "job" : "jobs"}.`}
              </p>
            </div>

            {jobs.length === 0 && hasFilters ? (
              <p className="helper-text">
                No jobs matched this title and skills combination. Try fewer skills or a broader
                title.
              </p>
            ) : jobs.length === 0 ? (
              <p className="helper-text">
                No jobs posted yet. Create the first one from the employer tools above.
              </p>
            ) : (
              <JobList jobs={jobs} currentUserId={user.id} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
