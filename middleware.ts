import createMiddleware from "next-intl/middleware";
import {type NextRequest} from "next/server";
import {routing} from "@/i18n/routing";
import {updateSession} from "@/lib/supabase/middleware";

const localize = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const response = localize(request);
  if (response.headers.has("location")) return response;
  const [, locale, section] = request.nextUrl.pathname.split("/");
  if (!["dashboard", "profile", "login", "signup"].includes(section)) return response;
  return updateSession(request, response, locale);
}

export const config = {matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"]};
