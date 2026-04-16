import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <main className="shell">
      <div className="container">
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
      </div>
    </main>
  );
}
