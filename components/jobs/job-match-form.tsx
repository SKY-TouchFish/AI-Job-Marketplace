import {useTranslations, useLocale} from "next-intl";
type JobMatchFormProps = {
  defaultTitle?: string;
  defaultSkills?: string;
};

// 通过 GET 提交将筛选条件写入控制面板 URL，并用当前参数回填表单。
// Submit filters in the dashboard URL with GET and populate the form from the current parameters.
export function JobMatchForm({
  defaultTitle = "",
  defaultSkills = ""
}: JobMatchFormProps) {
  const t = useTranslations();
  const locale = useLocale();
  return (
    <form action={`/${locale}/dashboard`} className="stack">
      <div className="match-grid">
        <label className="field">
          <span className="label">{t("jobTitle")}</span>
          <input
            className="input"
            type="text"
            name="title"
            defaultValue={defaultTitle}
            placeholder={t("frontendEngineer")}
          />
        </label>

        <label className="field">
          <span className="label">{t("jobSkills")}</span>
          <input
            className="input"
            type="text"
            name="skills"
            defaultValue={defaultSkills}
            placeholder="React, TypeScript, Supabase"
          />
        </label>
      </div>

      <div className="inline-actions">
        <button className="button" type="submit">{t("findMatches")}</button>
        <a className="pill" href={`/${locale}/dashboard`}>{t("reset")}</a>
      </div>
    </form>
  );
}
