"use client";

import {useLocale, useTranslations} from "next-intl";
import {usePathname, useRouter} from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  return (
    <select className="pill" aria-label={t("language")} value={locale} onChange={event =>
      router.replace(pathname + window.location.search + window.location.hash, {locale: event.target.value})
    }>
      <option value="en" lang="en">English</option>
      <option value="zh-CN" lang="zh-CN">简体中文</option>
    </select>
  );
}
