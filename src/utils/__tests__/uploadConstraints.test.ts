import { formatFileSize, MATERIAL_ALLOWED_MIME_TYPES, MATERIAL_MAX_SIZE_BYTES } from "../uploadConstraints";

describe("formatFileSize", () => {
  it("formats sub-megabyte sizes in KB", () => {
    expect(formatFileSize(500 * 1024)).toBe("500KB");
  });

  it("formats megabyte-and-up sizes in MB with one decimal", () => {
    expect(formatFileSize(2.5 * 1024 * 1024)).toBe("2.5MB");
  });
});

describe("MATERIAL_MAX_SIZE_BYTES", () => {
  it("matches the documented 50MB limit", () => {
    expect(MATERIAL_MAX_SIZE_BYTES).toBe(50 * 1024 * 1024);
  });
});

describe("MATERIAL_ALLOWED_MIME_TYPES", () => {
  it("includes the spec'd document and image types", () => {
    expect(MATERIAL_ALLOWED_MIME_TYPES).toEqual(
      expect.arrayContaining(["application/pdf", "image/png", "image/jpeg", "image/gif"])
    );
  });

  it("does not include video/audio types (materials are documents/images only)", () => {
    expect(MATERIAL_ALLOWED_MIME_TYPES.some((t) => t.startsWith("audio/"))).toBe(false);
    expect(MATERIAL_ALLOWED_MIME_TYPES.some((t) => t.startsWith("video/"))).toBe(false);
  });
});
