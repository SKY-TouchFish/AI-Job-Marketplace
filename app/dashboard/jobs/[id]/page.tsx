import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getJobById } from "@/lib/jobs/queries";

type JobDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const user = await requireUser();
  const { id } = await params;

  try {
    const job = await getJobById(id);
    const isCreator = job.created_by === user.id;

    return (
      <main className="shell">
        <div className="container card-grid">
          <section className="panel">
            <div className="panel-inner stack">
              <div className="stack" style={{ gap: 8 }}>
                <p className="eyebrow">Job details</p>
                <h1 style={{ margin: 0, fontSize: "2.2rem" }}>{job.title}</h1>
                <p className="helper-text">
                  Full job details in the same minimal layout as the posting flow.
                </p>
              </div>

              <section className="detail-block stack">
                <h2 className="section-title">Description</h2>
                <p className="helper-text">{job.description}</p>
              </section>

              <section className="detail-block stack">
                <h2 className="section-title">Required skills</h2>
                <div className="skill-list">
                  {job.required_skills.map((skill) => (
                    <span className="skill-chip" key={`${job.id}-${skill}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              <div className="inline-actions">
                {isCreator ? (
                  <Link className="button" href={`/dashboard/jobs/${job.id}/edit`}>
                    Edit job
                  </Link>
                ) : null}
                <Link className="pill" href="/dashboard">
                  Back to dashboard
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  } catch {
    notFound();
  }
}
