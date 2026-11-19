export type UpdateProfileInput = {
  displayName: string;
  skills: string[];
};

export type ProfileValidationResult =
  | {
      success: true;
      data: UpdateProfileInput;
    }
  | {
      success: false;
      error: string;
    };

export function parseSkills(value?: string) {
  return (value || "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

// 要求填写显示名称，技能可以留空，也可以用文本或数组提供。
// Require a display name and accept optional skills as text or an array.
export function validateProfileInput(input: {
  displayName?: string;
  skills?: string | string[];
}): ProfileValidationResult {
  const displayName = input.displayName?.trim() || "";
  const skills = Array.isArray(input.skills)
    ? input.skills.map((skill) => skill.trim()).filter(Boolean)
    : parseSkills(input.skills);

  if (!displayName) {
    return { success: false, error: "Display name is required." };
  }

  return {
    success: true,
    data: {
      displayName,
      skills
    }
  };
}
