import Constants from "expo-constants";
import { createClient } from "@supabase/supabase-js";
import { secureStorage } from "./secureStorage";

const extra = Constants.expoConfig?.extra ?? {};
const supabaseUrl = extra.supabaseUrl as string | undefined;
const supabaseAnonKey = extra.supabaseAnonKey as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY. Check your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: secureStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    // PKCE so password-reset deep links carry a short-lived `code` param
    // instead of token fragments, which RN can't reliably parse from a URL.
    flowType: "pkce",
  },
});

export function getApiBaseUrl(): string {
  const url = extra.apiBaseUrl as string | undefined;
  if (!url) {
    throw new Error("Missing EXPO_PUBLIC_API_BASE_URL. Check your .env file.");
  }
  return url;
}
