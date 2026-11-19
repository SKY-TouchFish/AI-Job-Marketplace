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
  return (
    <form action="/dashboard" className="stack">
      <div className="match-grid">
        <label className="field">
          <span className="label">Job title</span>
          <input
            className="input"
            type="text"
            name="title"
            defaultValue={defaultTitle}
            placeholder="Frontend Engineer"
          />
        </label>

        <label className="field">
          <span className="label">Job skills</span>
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
        <button className="button" type="submit">
          Find matches
        </button>
        <a className="pill" href="/dashboard">
          Reset
        </a>
      </div>
    </form>
  );
}
