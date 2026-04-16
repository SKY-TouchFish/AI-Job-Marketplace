import { createClient } from "@/lib/supabase/server";

export type ProfileRecord = {
  id: string;
  display_name: string;
  skills: string[];
};

export async function getProfileByUserId(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, skills")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data || {
    id: userId,
    display_name: "",
    skills: []
  }) as ProfileRecord;
}
