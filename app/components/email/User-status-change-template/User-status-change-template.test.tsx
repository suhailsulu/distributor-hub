import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { UserStatusChangeEmailTemplate } from "./User-status-change-template";

describe("UserStatusChangeEmailTemplate", () => {
  it.each([
    ["approved", "approved by the review team"],
    ["rejected", "rejected by the review team"],
    ["blocked", "blocked by the review team"],
    ["reactivated", "reactivated"],
  ] as const)("renders %s status content", (status, expectedSnippet) => {
    const html = renderToStaticMarkup(
      <UserStatusChangeEmailTemplate
        email="user@example.com"
        status={status}
      />,
    );

    expect(html).toContain("user@example.com");
    expect(html).toContain(expectedSnippet);
  });
});
