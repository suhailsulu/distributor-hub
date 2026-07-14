import { describe, expect, it } from "vitest";
import { sessionOptions } from "./session";

describe("sessionOptions", () => {
  it("uses the distributor hub cookie name", () => {
    expect(sessionOptions.cookieName).toBe("distributor_hub_session");
  });

  it("secures cookies only in production", () => {
    expect(sessionOptions.cookieOptions?.secure).toBe(
      process.env.NODE_ENV === "production",
    );
  });
});
