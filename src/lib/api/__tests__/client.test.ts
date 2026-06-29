import { apiClient } from "../client";
import { ApiError } from "../types";

jest.mock("@/lib/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      signOut: jest.fn(),
    },
  },
  getApiBaseUrl: jest.fn(() => "https://example.com"),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { supabase } = require("@/lib/supabase/client");

function mockSession(token: string | null) {
  (supabase.auth.getSession as jest.Mock).mockResolvedValue({
    data: { session: token ? { access_token: token } : null },
  });
}

function mockFetchResponse(status: number, body: unknown) {
  (globalThis.fetch as jest.Mock).mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    text: async () => (body === undefined ? "" : JSON.stringify(body)),
  });
}

beforeEach(() => {
  globalThis.fetch = jest.fn();
  (supabase.auth.signOut as jest.Mock).mockReset();
});

describe("apiClient.get", () => {
  it("attaches the Bearer token from the current Supabase session", async () => {
    mockSession("real-token-123");
    mockFetchResponse(200, { hello: "world" });

    await apiClient.get("/teacher/stats");

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://example.com/api/teacher/stats",
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer real-token-123" }),
      })
    );
  });

  it("encodes query params and omits undefined values", async () => {
    mockSession("t");
    mockFetchResponse(200, {});

    await apiClient.get("/student/grades", { page: 2, page_size: 20, course_id: undefined });

    const calledUrl = (globalThis.fetch as jest.Mock).mock.calls[0][0];
    expect(calledUrl).toBe("https://example.com/api/student/grades?page=2&page_size=20");
  });

  it("throws ApiError without calling fetch when there is no session", async () => {
    mockSession(null);

    await expect(apiClient.get("/teacher/stats")).rejects.toThrow(ApiError);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("returns the parsed JSON body on success", async () => {
    mockSession("t");
    mockFetchResponse(200, { courses: 3 });

    const result = await apiClient.get("/teacher/stats");
    expect(result).toEqual({ courses: 3 });
  });
});

describe("apiClient error handling", () => {
  it("signs out and throws ApiError(401) on an expired/invalid session", async () => {
    mockSession("stale-token");
    mockFetchResponse(401, { error: "Unauthorized" });

    await expect(apiClient.get("/teacher/stats")).rejects.toMatchObject({
      status: 401,
      message: "Unauthorized",
    });
    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });

  it("signs out and throws on a disabled account (403 + exact message)", async () => {
    mockSession("token");
    mockFetchResponse(403, { error: "Account disabled" });

    await expect(apiClient.get("/teacher/stats")).rejects.toMatchObject({
      status: 403,
      message: "Account disabled",
    });
    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });

  it("does NOT sign out on an ordinary 403 Forbidden (role mismatch, not disabled)", async () => {
    mockSession("token");
    mockFetchResponse(403, { error: "Forbidden" });

    await expect(apiClient.get("/teacher/stats")).rejects.toMatchObject({
      status: 403,
      message: "Forbidden",
    });
    expect(supabase.auth.signOut).not.toHaveBeenCalled();
  });

  it("surfaces the backend's {error} message for other failures", async () => {
    mockSession("token");
    mockFetchResponse(400, { error: "score cannot exceed max_score" });

    await expect(apiClient.post("/teacher/grades", {})).rejects.toMatchObject({
      status: 400,
      message: "score cannot exceed max_score",
    });
  });

  it("falls back to a generic message when the body has no {error} field", async () => {
    mockSession("token");
    mockFetchResponse(500, {});

    await expect(apiClient.get("/teacher/stats")).rejects.toMatchObject({
      status: 500,
      message: "Request failed with status 500",
    });
  });
});

describe("apiClient.upload", () => {
  it("sends FormData without setting a Content-Type header", async () => {
    mockSession("token");
    mockFetchResponse(200, { success: true, url: "https://x" });

    const formData = new FormData();
    formData.append("title", "Lecture 1");

    await apiClient.upload("/teacher/materials", formData);

    const callArgs = (globalThis.fetch as jest.Mock).mock.calls[0][1];
    expect(callArgs.body).toBe(formData);
    expect(callArgs.headers["Content-Type"]).toBeUndefined();
  });
});

describe("apiClient.post / patch / delete", () => {
  it("JSON-encodes the body and sets Content-Type for post", async () => {
    mockSession("token");
    mockFetchResponse(200, {});

    await apiClient.post("/teacher/announcements", { title: "Hi" });

    const callArgs = (globalThis.fetch as jest.Mock).mock.calls[0][1];
    expect(callArgs.method).toBe("POST");
    expect(callArgs.headers["Content-Type"]).toBe("application/json");
    expect(callArgs.body).toBe(JSON.stringify({ title: "Hi" }));
  });

  it("uses the DELETE method", async () => {
    mockSession("token");
    mockFetchResponse(200, {});

    await apiClient.delete("/teacher/grades", { id: "abc" });

    const callArgs = (globalThis.fetch as jest.Mock).mock.calls[0][1];
    expect(callArgs.method).toBe("DELETE");
  });
});
