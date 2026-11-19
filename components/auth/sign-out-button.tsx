"use client";

import {useTranslations} from "next-intl";
import {useRouter} from "@/i18n/navigation";
import { useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const t = useTranslations();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace("/login");
      // 刷新服务端渲染的数据，使其反映退出登录后的会话状态。
      // Refresh server-rendered data so it reflects the signed-out session.
      router.refresh();
    });
  }

  return (
    <button className="button" onClick={handleSignOut} disabled={isPending}>
      {isPending ? t("signingOut") : t("signOut")}
    </button>
  );
}
