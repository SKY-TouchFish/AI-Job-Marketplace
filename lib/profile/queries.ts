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

  // 用户还没有资料记录时，提供用于初始化页面的空资料。
  // Provide an empty profile for the page when the user has no saved profile yet.
  return (data || {
    id: userId,
    display_name: "",
    skills: []
  }) as ProfileRecord;
}
