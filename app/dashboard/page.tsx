import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { JobList } from "@/components/jobs/job-list";
import { JobMatchForm } from "@/components/jobs/job-match-form";
import { requireUser } from "@/lib/auth";
import { getJobs, parseSkillSearch } from "@/lib/jobs/queries";
import { getProfileByUserId } from "@/lib/profile/queries";

type DashboardPageProps = {
  searchParams?: Promise<{
    title?: string;
    skills?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await requireUser();
  const profile = await getProfileByUserId(user.id);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const title = resolvedSearchParams?.title || "";
  const skills = resolvedSearchParams?.skills || "";
  const jobs = await getJobs({
    title,
    skills: parseSkillSearch(skills),
    profileSkills: profile.skills
  });
  const hasFilters = Boolean(title.trim() || skills.trim());
  const displayName = profile.display_name.trim() || user.email || "User";

  return (
    <main className="shell">
      <div className="container card-grid">
        <div className="topbar">
          <div>
            <p className="eyebrow">AI Job Marketplace</p>
            <h1 style={{ margin: "8px 0 0", fontSize: "2.4rem" }}>Dashboard</h1>
          </div>
          <SignOutButton />
        </div>

        <section className="panel">
          <div className="panel-inner stack">
            <div className="stack" style={{ gap: 10 }}>
              <h2 className="profile-name">{displayName}</h2>
              <div className="profile-meta">
                <p className="lead">{user.email}</p>
                <div className="skill-list">
                  {profile.skills.length > 0 ? (
                    profile.skills.map((skill) => (
                      <span className="skill-chip" key={`profile-skill-${skill}`}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="lead">No skills added yet.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="pill-links">
              <Link className="pill" href="/dashboard/jobs/new">
                Post a job
              </Link>
              <Link className="pill" href="/profile">
                Profile
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
                Search runs only on the server. Filter by title and skills, while match scores are
                calculated from your saved profile skills against each job&apos;s required skills.
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
