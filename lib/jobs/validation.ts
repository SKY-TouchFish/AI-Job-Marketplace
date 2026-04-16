export type CreateJobInput = {
  title: string;
  description: string;
  requiredSkills: string[];
};

export type ValidationResult =
  | {
      success: true;
      data: CreateJobInput;
    }
  | {
      success: false;
      error: string;
    };

function normalizeSkills(value: string) {
  return value
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

export function validateCreateJobInput(input: {
  title?: string;
  description?: string;
  requiredSkills?: string | string[];
}): ValidationResult {
  const title = input.title?.trim() || "";
  const description = input.description?.trim() || "";
  const requiredSkills = Array.isArray(input.requiredSkills)
    ? input.requiredSkills.map((skill) => skill.trim()).filter(Boolean)
    : normalizeSkills(input.requiredSkills || "");

  if (!title) {
    return { success: false, error: "Title is required." };
  }

  if (!description) {
    return { success: false, error: "Description is required." };
  }

  if (requiredSkills.length === 0) {
    return { success: false, error: "At least one required skill is required." };
  }

  return {
    success: true,
    data: {
      title,
      description,
      requiredSkills
    }
  };
}
