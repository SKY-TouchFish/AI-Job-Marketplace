import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

type CookieToSet = {
  name: string;
  value: string;
  options?: Parameters<Awaited<ReturnType<typeof cookies>>["set"]>[2];
};

// 使用当前请求的 Cookie 初始化服务端 Supabase 客户端。
// Initialize the server-side Supabase client with cookies from the current request.
export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // 服务端组件可能无法写入 Cookie，由会话中间件在匹配的页面路由上刷新会话。
          // Server Components may be unable to write cookies. Middleware refreshes sessions on matched page routes.
        }
      }
    }
  });
}
