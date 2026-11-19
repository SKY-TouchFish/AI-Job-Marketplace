import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "./env";

type CookieToSet = {
  name: string;
  value: string;
  options?: Parameters<NextResponse["cookies"]["set"]>[2];
};

export async function updateSession(request: NextRequest, response: NextResponse, locale: string) {
  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        // 同时更新请求和响应的 Cookie，供本次请求及浏览器后续请求使用。
        // Update both request and response cookies for the current request and subsequent browser requests.
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
        response.headers.set("x-middleware-request-cookie", request.headers.get("cookie") || "");
        const overrides = response.headers.get("x-middleware-override-headers")?.split(",") || [];
        response.headers.set("x-middleware-override-headers", [...new Set([...overrides, "cookie"])].join(","));
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname.slice(locale.length + 1);
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname === "/profile";

  // 将原控制面板路径传给登录页，供登录成功后返回。
  // Pass the original dashboard path to the login page so users can return after signing in.
  if (isProtectedRoute && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${locale}/login`;
    redirectUrl.search = "";
    redirectUrl.searchParams.set("redirectTo", pathname + request.nextUrl.search);
    const redirect = NextResponse.redirect(redirectUrl);
    for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
    return redirect;
  }

  if (isAuthRoute && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${locale}/dashboard`;
    redirectUrl.search = "";
    const redirect = NextResponse.redirect(redirectUrl);
    for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
    return redirect;
  }

  return response;
}
