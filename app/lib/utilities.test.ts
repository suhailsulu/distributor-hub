import { describe, expect, it } from "vitest";
import generateOTP, {
  hashPassword,
  validateEmail,
  verifyPassword,
} from "./utilities";

describe("utilities", () => {
  describe("hashPassword / verifyPassword", () => {
    it("hashes a password and verifies the correct password", async () => {
      const hash = await hashPassword("Secret123!");
      expect(hash).toMatch(/^[a-f0-9]+:[a-f0-9]+$/);
      await expect(verifyPassword("Secret123!", hash)).resolves.toBe(true);
    });

    it("rejects an incorrect password", async () => {
      const hash = await hashPassword("Secret123!");
      await expect(verifyPassword("WrongPassword", hash)).resolves.toBe(false);
    });

    it("returns false for a malformed hash", async () => {
      await expect(verifyPassword("Secret123!", "not-a-hash")).resolves.toBe(
        false,
      );
    });
  });

  describe("generateOTP", () => {
    it("returns a 6-digit numeric string", () => {
      const otp = generateOTP();
      expect(otp).toMatch(/^\d{6}$/);
    });
  });

  describe("validateEmail", () => {
    it("accepts valid email addresses", () => {
      expect(validateEmail("user@example.com")).toBe(true);
    });

    it("rejects invalid email addresses", () => {
      expect(validateEmail("not-an-email")).toBe(false);
      expect(validateEmail("user@")).toBe(false);
      expect(validateEmail("")).toBe(false);
    });
  });
});
