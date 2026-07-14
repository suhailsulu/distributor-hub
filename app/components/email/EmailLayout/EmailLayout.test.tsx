import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EmailLayout } from "./EmailLayout";

describe("EmailLayout", () => {
  it("renders title, subtitle, children, and footer", () => {
    const html = renderToStaticMarkup(
      <EmailLayout title="Hello" subtitle="Welcome">
        <p>Body content</p>
      </EmailLayout>,
    );

    expect(html).toContain("Hello");
    expect(html).toContain("Welcome");
    expect(html).toContain("Body content");
    expect(html).toContain("Copyright 2026 Distributor Hub");
  });

  it("omits subtitle when not provided", () => {
    const html = renderToStaticMarkup(
      <EmailLayout title="Hello">
        <p>Body</p>
      </EmailLayout>,
    );

    expect(html).toContain("Hello");
    expect(html).not.toContain("<p>Welcome</p>");
  });
});
