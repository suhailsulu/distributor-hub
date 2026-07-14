import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { OTPEmailTemplate } from "./OTP-template";

describe("OTPEmailTemplate", () => {
  it("includes the recipient email and OTP code", () => {
    const html = renderToStaticMarkup(
      <OTPEmailTemplate email="user@example.com" otp="123456" />,
    );

    expect(html).toContain("user@example.com");
    expect(html).toContain("123456");
    expect(html).toContain("Verification Code");
  });
});
