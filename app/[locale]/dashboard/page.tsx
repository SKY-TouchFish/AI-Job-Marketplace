import {getTranslations} from "next-intl/server";
import {Link} from "@/i18n/navigation";
import { JobList } from "@/components/jobs/job-list";
import { JobMatchForm } from "@/components/jobs/job-match-form";
import { getUser } from "@/lib/auth";
import { getJobs, parseSkillSearch } from "@/lib/jobs/queries";
import { getProfileByUserId } from "@/lib/profile/queries";

type DashboardPageProps = {
  searchParams?: Promise<{
    title?: string;
    skills?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const t = await getTranslations();
  const user = await getUser();
  const profile = user ? await getProfileByUserId(user.id) : null;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const title = resolvedSearchParams?.title || "";
  const skills = resolvedSearchParams?.skills || "";
  // URL 中的标题和技能用于筛选职位，个人资料中的技能用于计算匹配分数。
  // Use the title and skills from the URL to filter jobs and the profile skills to calculate match scores.
  const jobs = await getJobs({
    title,
    skills: parseSkillSearch(skills),
    profileSkills: profile?.skills
  });
  const hasFilters = Boolean(title.trim() || skills.trim());
  const displayName = user
    ? profile?.display_name.trim() || user.email || t("user")
    : t("notLoggedIn");

  return (
    <main className="shell">
      <div className="container card-grid">
        <h1 className="page-heading">{t("dashboard")}</h1>

        <section className="panel">
          <div className="panel-inner stack">
            <div className="stack" style={{ gap: 10 }}>
              <h2 className="profile-name">{displayName}</h2>
              {user && profile ? <div className="profile-meta">
                <p className="lead">{user.email}</p>
                <div className="skill-list">
                  {profile.skills.length > 0 ? (
                    profile.skills.map((skill) => (
                      <span className="skill-chip" key={`profile-skill-${skill}`}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="lead">{t("noSkillsAddedYet")}</p>
                  )}
                </div>
              </div> : null}
            </div>
            <div className="pill-links">
              <Link className="pill" href="/dashboard/jobs/new">{t("postAJob")}</Link>
              {user ? (
                <Link className="pill" href="/profile">{t("profile")}</Link>
              ) : null}
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-inner stack">
            <div className="stack" style={{ gap: 8 }}>
              <h2 style={{ margin: 0, fontSize: "1.8rem" }}>{t("findMatchingRoles")}</h2>
            </div>

            <JobMatchForm defaultTitle={title} defaultSkills={skills} />

            <div className="results-meta">
              <p className="helper-text">
                {t(hasFilters ? "matches" : "available", {count: jobs.length})}
              </p>
            </div>

            {jobs.length === 0 && hasFilters ? (
              <p className="helper-text">{t("noJobsMatchedThisTitleAnd")}</p>
            ) : jobs.length === 0 ? (
              <p className="helper-text">{t("noJobsPostedYetCreateThe")}</p>
            ) : (
              <JobList jobs={jobs} currentUserId={user?.id} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
