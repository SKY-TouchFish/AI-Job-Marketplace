import Link from "next/link";
import { getUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getUser();

  return (
    <main className="shell">
      <div className="container hero">
        <section className="panel">
          <div className="panel-inner">
            <p className="eyebrow">AI Job Marketplace</p>
            <h1 className="title">Simple Supabase auth, ready for your App Router MVP.</h1>
            <p className="lead">
              This starter gives you email and password signup, login, session-aware middleware,
              and a protected dashboard route you can build on.
            </p>
          </div>
        </section>

        <section className="panel">
          <div className="panel-inner stack">
            <div className="pill-links">
              <Link className="pill" href={user ? "/dashboard" : "/login"}>
                {user ? "Open dashboard" : "Log in"}
              </Link>
              <Link className="pill" href="/signup">
                Create account
              </Link>
            </div>
            <p className="lead">
              Auth state is stored with Supabase cookies and refreshed in middleware so protected
              routes stay in sync on server and client renders.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
