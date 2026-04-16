import { createClient } from "@/lib/supabase/server";

export type JobRecord = {
  id: string;
  title: string;
  description: string;
  required_skills: string[];
  created_at: string;
  created_by: string;
};

export async function getJobs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("id, title, description, required_skills, created_at, created_by")
    .order("created_at", { ascending: false });

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
