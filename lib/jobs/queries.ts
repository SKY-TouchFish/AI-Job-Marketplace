import { createClient } from "@/lib/supabase/server";

export type JobRecord = {
  id: string;
  title: string;
  description: string;
  required_skills: string[];
  created_at: string;
};

export async function getJobs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("id, title, description, required_skills, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as JobRecord[];
}
