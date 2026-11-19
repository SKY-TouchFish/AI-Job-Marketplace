import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// 读取当前会话对应的用户，供允许访客访问的页面使用。
// Read the user for the current session on pages that also allow guests.
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

// 受保护的页面通过此方法要求用户登录。
// Use this helper to require sign-in on protected pages.
export async function requireUser() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
