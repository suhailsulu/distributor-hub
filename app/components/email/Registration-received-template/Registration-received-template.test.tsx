import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RegistrationReceivedEmailTemplate } from "./Registration-received-template";

describe("RegistrationReceivedEmailTemplate", () => {
  it("includes the recipient email and confirmation copy", () => {
    const html = renderToStaticMarkup(
      <RegistrationReceivedEmailTemplate email="user@example.com" />,
    );

    expect(html).toContain("user@example.com");
    expect(html).toContain("Registration request received");
    expect(html).toContain("review team");
  });
});
