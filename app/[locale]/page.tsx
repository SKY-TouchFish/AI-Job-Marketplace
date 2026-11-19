import {getTranslations} from "next-intl/server";
import {Link} from "@/i18n/navigation";
import { getUser } from "@/lib/auth";

export default async function HomePage() {
  const t = await getTranslations();
  // 根据会话状态，将首页的主要入口指向控制面板或登录页。
  // Point the main homepage link to the dashboard or login page based on the session.
  const user = await getUser();

  return (
    <main className="shell">
      <div className="container hero">
        <section className="panel">
          <div className="panel-inner">
            <h1 className="title">{t("findWorkAndHireFaster")}</h1>
            <p className="lead">{t("aSimpleAiJobMarketplaceFor")}</p>
          </div>
        </section>

        <section className="panel">
          <div className="panel-inner stack">
            <div className="pill-links">
              <Link className="pill" href={user ? "/dashboard" : "/login"}>
                {user ? t("openDashboard") : t("logIn")}
              </Link>
              <Link className="pill" href="/jobs">{t("browseJobs")}</Link>
              <Link className="pill" href="/signup">{t("createAccount")}</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
