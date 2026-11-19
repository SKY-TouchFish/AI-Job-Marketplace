"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

// 在浏览器端复用 Supabase 客户端，供登录、注册和退出共用。
// Reuse a single browser-side Supabase client for sign-in, sign-up, and sign-out.
let browserClient: SupabaseClient | null = null;

export function createClient() {
  if (browserClient) {
    return browserClient;
  }

  const { url, anonKey } = getSupabaseEnv();
  browserClient = createBrowserClient(url, anonKey);

  return browserClient;
}
