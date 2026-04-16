import { JobPostForm } from "@/components/jobs/job-post-form";
import { requireUser } from "@/lib/auth";

export default async function NewJobPage() {
  await requireUser();

  return (
    <main className="shell">
      <div className="container card-grid">
        <div className="topbar">
          <div>
            <p className="eyebrow">AI Job Marketplace</p>
            <h1 style={{ margin: "8px 0 0", fontSize: "2.4rem" }}>Post a Job</h1>
          </div>
        </div>
        <JobPostForm />
      </div>
    </main>
  );
}
