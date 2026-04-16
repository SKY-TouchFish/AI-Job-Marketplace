import { notFound, redirect } from "next/navigation";
import { JobForm } from "@/components/jobs/job-form";
import { requireUser } from "@/lib/auth";
import { getJobById } from "@/lib/jobs/queries";

type EditJobPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditJobPage({ params }: EditJobPageProps) {
  const user = await requireUser();
  const { id } = await params;

  try {
    const job = await getJobById(id);

    if (job.created_by !== user.id) {
      redirect(`/dashboard/jobs/${id}`);
    }

    return (
      <main className="shell">
        <div className="container card-grid">
          <div className="topbar">
            <div>
              <p className="eyebrow">AI Job Marketplace</p>
              <h1 style={{ margin: "8px 0 0", fontSize: "2.4rem" }}>Edit Job</h1>
            </div>
          </div>
          <JobForm
            mode="edit"
            jobId={job.id}
            initialValues={{
              title: job.title,
              description: job.description,
              requiredSkills: job.required_skills
            }}
          />
        </div>
      </main>
    );
  } catch {
    notFound();
  }
}
