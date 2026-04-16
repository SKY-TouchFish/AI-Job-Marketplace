import { JobPostForm } from "@/components/jobs/job-post-form";
import { requireUser } from "@/lib/auth";

export default async function NewJobPage() {
  await requireUser();

  return (
    <main className="shell">
      <div className="container card-grid">
        <JobPostForm />
      </div>
    </main>
  );
}
