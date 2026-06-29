import { ApiError } from "../types";

describe("ApiError", () => {
  it("carries the HTTP status and message", () => {
    const error = new ApiError("Unauthorized", 401);
    expect(error.message).toBe("Unauthorized");
    expect(error.status).toBe(401);
    expect(error.name).toBe("ApiError");
  });

  it("is a real Error instance (catchable as Error, instanceof works)", () => {
    const error = new ApiError("Forbidden", 403);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
  });
});
