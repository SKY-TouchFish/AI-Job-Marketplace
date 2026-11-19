import {hasLocale, NextIntlClientProvider} from "next-intl";
import {getTranslations} from "next-intl/server";
import {notFound} from "next/navigation";
import {routing} from "@/i18n/routing";
import {LanguageSwitcher} from "@/components/language-switcher";
import "../globals.css";

export async function generateMetadata() {
  const t = await getTranslations();
  return {title: t("aiJobMarketplace"), description: t("aSimpleAiJobMarketplaceFor")};
}

export default async function RootLayout({children, params}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <LanguageSwitcher />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
