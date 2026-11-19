import {hasLocale, NextIntlClientProvider} from "next-intl";
import {getTranslations} from "next-intl/server";
import {notFound} from "next/navigation";
import Image from "next/image";
import {routing} from "@/i18n/routing";
import {Link} from "@/i18n/navigation";
import {SignOutButton} from "@/components/auth/sign-out-button";
import {LanguageSwitcher} from "@/components/language-switcher";
import {getUser} from "@/lib/auth";
import "../globals.css";

export async function generateMetadata() {
  const t = await getTranslations();
  return {
    title: t("aiJobMarketplace"),
    description: t("aSimpleAiJobMarketplaceFor"),
    icons: {icon: {url: "/logo.svg", type: "image/svg+xml", sizes: "any"}},
  };
}

export default async function RootLayout({children, params}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [t, user] = await Promise.all([getTranslations(), getUser()]);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <header className="site-header">
            <div className="container topbar">
              <Link className="site-name" href="/dashboard">
                <Image className="site-logo" src="/logo.svg" alt="" width={36} height={36} />
                <span>{t("aiJobMarketplace")}</span>
              </Link>
              <div className="topbar-actions">
                {user ? (
                  <SignOutButton />
                ) : (
                  <>
                    <Link className="pill" href="/login">{t("logIn")}</Link>
                    <Link className="button" href="/signup">{t("signUp")}</Link>
                  </>
                )}
                <LanguageSwitcher />
              </div>
            </div>
          </header>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
