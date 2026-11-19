import {getTranslations} from "next-intl/server";
import { ProfileForm } from "@/components/profile/profile-form";
import { requireUser } from "@/lib/auth";
import { getProfileByUserId } from "@/lib/profile/queries";

export default async function ProfilePage() {
  const t = await getTranslations();
  const user = await requireUser();
  // 从资料表预填显示名称和技能，邮箱则取自认证账户。
  // Prefill the display name and skills from the profile, and take the email from the auth account.
  const profile = await getProfileByUserId(user.id);

  return (
    <main className="shell">
      <div className="container card-grid">
        <h1 className="page-heading">{t("profile")}</h1>

        <ProfileForm
          email={user.email || ""}
          initialValues={{
            displayName: profile.display_name || "",
            skills: profile.skills || []
          }}
        />
      </div>
    </main>
  );
}
