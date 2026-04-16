import { createClient } from "@/lib/supabase/server";

export type JobRecord = {
  id: string;
  title: string;
  description: string;
  required_skills: string[];
  created_at: string;
  created_by: string;
};

export type JobMatchFilters = {
  title?: string;
  skills?: string[];
};

function normalizeSearchValue(value?: string) {
  return value?.trim() || "";
}

export function parseSkillSearch(value?: string) {
  return (value || "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
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

  return (data || []) as JobRecord[];
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

  return data as JobRecord;
}
