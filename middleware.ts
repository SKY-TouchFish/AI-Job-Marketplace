import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

// 仅让会话中间件匹配控制面板、登录页和注册页。
// Run the session middleware only on dashboard, login, and sign-up routes.
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"]
};
