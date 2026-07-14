import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("verifyAltchaToken", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.doUnmock("altcha-lib");
  });

  it("returns 500 when HMAC_KEY is not set", async () => {
    vi.stubEnv("HMAC_KEY", "");
    const { verifyAltchaToken } = await import("./altcha");

    await expect(verifyAltchaToken("payload")).resolves.toEqual({
      isValid: false,
      status: 500,
      error: "HMAC_KEY not set",
    });
  });

  it("returns 400 when verification fails", async () => {
    vi.stubEnv("HMAC_KEY", "test-key");
    vi.doMock("altcha-lib", () => ({
      verifySolution: vi.fn().mockResolvedValue(false),
    }));
    const { verifyAltchaToken } = await import("./altcha");

    await expect(verifyAltchaToken("payload")).resolves.toEqual({
      isValid: false,
      status: 400,
      error: "Altcha verification failed",
    });
  });

  it("returns 200 when verification succeeds", async () => {
    vi.stubEnv("HMAC_KEY", "test-key");
    vi.doMock("altcha-lib", () => ({
      verifySolution: vi.fn().mockResolvedValue(true),
    }));
    const { verifyAltchaToken } = await import("./altcha");

    await expect(verifyAltchaToken("payload")).resolves.toEqual({
      isValid: true,
      status: 200,
    });
  });

  it("returns 502 when verification throws", async () => {
    vi.stubEnv("HMAC_KEY", "test-key");
    vi.doMock("altcha-lib", () => ({
      verifySolution: vi.fn().mockRejectedValue(new Error("boom")),
    }));
    const { verifyAltchaToken } = await import("./altcha");

    await expect(verifyAltchaToken("payload")).resolves.toEqual({
      isValid: false,
      status: 502,
      error: "Unable to verify Altcha token",
    });
  });
});
