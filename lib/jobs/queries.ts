import { createClient } from "@/lib/supabase/server";

export type JobRecord = {
  id: string;
  title: string;
  description: string;
  required_skills: string[];
  created_at: string;
  created_by: string;
  match_score: number;
};

export type JobMatchFilters = {
  title?: string;
  skills?: string[];
  profileSkills?: string[];
};

function normalizeSearchValue(value?: string) {
  return value?.trim() || "";
}

function normalizeSkill(value: string) {
  return value.trim().toLowerCase();
}

export function parseSkillSearch(value?: string) {
  return (value || "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function computeMatchScore(
  job: Omit<JobRecord, "match_score">,
  filters?: JobMatchFilters
) {
  const profileSkills = filters?.profileSkills?.map(normalizeSkill).filter(Boolean) || [];

  if (profileSkills.length === 0) {
    return 0;
  }

  const normalizedJobSkills = job.required_skills.map(normalizeSkill);
  const matchedSkills = normalizedJobSkills.filter((skill) => profileSkills.includes(skill)).length;

  if (normalizedJobSkills.length === 0) {
    return 0;
  }

  return Math.round((matchedSkills / normalizedJobSkills.length) * 100);
}

export async function getJobs(filters?: JobMatchFilters) {
  const supabase = await createClient();
  let query = supabase
    .from("jobs")
    .select("id, title, description, required_skills, created_at, created_by")
    .order("created_at", { ascending: false });

  const title = normalizeSearchValue(filters?.title);
  const skills = filters?.skills?.map((skill) => skill.trim()).filter(Boolean) || [];

  if (title) {
    query = query.ilike("title", `%${title}%`);
  }

  if (skills.length > 0) {
    query = query.overlaps("required_skills", skills);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return ((data || []) as Omit<JobRecord, "match_score">[]).map((job) => ({
    ...job,
    match_score: computeMatchScore(job, filters)
  }));
}

export async function getJobById(jobId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("id, title, description, required_skills, created_at, created_by")
    .eq("id", jobId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    ...(data as Omit<JobRecord, "match_score">),
    match_score: 0
  };
}
