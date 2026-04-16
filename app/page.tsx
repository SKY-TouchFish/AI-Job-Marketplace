import Link from "next/link";
import { getUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getUser();

  return (
    <main className="shell">
      <div className="container hero">
        <section className="panel">
          <div className="panel-inner">
            <h1 className="title">Find work and hire faster.</h1>
            <p className="lead">A simple AI job marketplace for posting roles and discovering matches.</p>
          </div>
        </section>

        <section className="panel">
          <div className="panel-inner stack">
            <div className="pill-links">
              <Link className="pill" href={user ? "/dashboard" : "/login"}>
                {user ? "Open dashboard" : "Log in"}
              </Link>
              <Link className="pill" href="/jobs">
                Browse jobs
              </Link>
              <Link className="pill" href="/signup">
                Create account
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
