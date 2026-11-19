"use client";

import {useLocale, useTranslations} from "next-intl";
import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const t = useTranslations();
  const locale = useLocale();
  const [error, setError] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    setError(false);
    startTransition(async () => {
      try {
        const supabase = createClient();
        const {error: signOutError} = await supabase.auth.signOut();
        if (signOutError) {
          setError(true);
          return;
        }
        // Reload the document to discard cached authenticated routes and client modules.
        window.location.replace(`/${locale}/dashboard`);
      } catch {
        setError(true);
      }
    });
  }

  return (
    <div className="stack">
      <button className="button" onClick={handleSignOut} disabled={isPending}>
        {isPending ? t("signingOut") : t("signOut")}
      </button>
      {error ? <p className="notice notice-error" role="alert">{t("unableToSignOut")}</p> : null}
    </div>
  );
}
