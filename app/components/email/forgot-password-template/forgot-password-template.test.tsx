import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ForgotPasswordEmailTemplate } from "./forgot-password-template";

describe("ForgotPasswordEmailTemplate", () => {
  it("includes the reset link and recipient email", () => {
    const html = renderToStaticMarkup(
      <ForgotPasswordEmailTemplate
        email="user@example.com"
        link="https://example.com/reset?token=abc"
      />,
    );

    expect(html).toContain("user@example.com");
    expect(html).toContain("https://example.com/reset?token=abc");
    expect(html).toContain("Reset your password");
  });
});
