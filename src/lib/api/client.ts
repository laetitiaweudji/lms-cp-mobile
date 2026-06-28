import { supabase, getApiBaseUrl } from "@/lib/supabase/client";
import { ApiError } from "./types";

type Query = Record<string, string | number | boolean | undefined>;

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Query;
  formData?: FormData;
};

async function getAccessToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) {
    throw new ApiError("Not authenticated", 401);
  }
  return token;
}

function buildUrl(path: string, query?: Query): string {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");

  const params = Object.entries(query ?? {}).filter(([, value]) => value !== undefined);
  const qs = params
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join("&");

  return `${base}/api/${cleanPath}${qs ? `?${qs}` : ""}`;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = await getAccessToken();
  const url = buildUrl(path, options.query);

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  let body: BodyInit | undefined;
  if (options.formData) {
    // Don't set Content-Type for FormData — fetch derives the multipart boundary itself.
    body = options.formData;
  } else if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers,
    body,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  const message = data && typeof data.error === "string" ? data.error : null;

  // Session invalid/expired, or the account was disabled mid-session: sign out
  // so every role-guarded route's <Redirect> kicks the user back to login.
  if (response.status === 401 || (response.status === 403 && message === "Account disabled")) {
    await supabase.auth.signOut();
    throw new ApiError(message ?? "Unauthorized", response.status);
  }

  if (!response.ok) {
    throw new ApiError(message ?? `Request failed with status ${response.status}`, response.status);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(path: string, query?: Query) => request<T>(path, { method: "GET", query }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string, body?: unknown) => request<T>(path, { method: "DELETE", body }),
  upload: <T>(path: string, formData: FormData) => request<T>(path, { method: "POST", formData }),
};
