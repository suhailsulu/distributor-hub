import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Altcha, { type AltchaHandle } from "./AltchaWrapper";
import { createRef } from "react";

vi.mock("altcha", () => ({}));

describe("AltchaWrapper", () => {
  it("renders the altcha widget element", () => {
    const { container } = render(<Altcha expireMs={10000} />);
    expect(container.querySelector("altcha-widget")).not.toBeNull();
  });

  it("exposes reset and value through the ref handle", () => {
    const ref = createRef<AltchaHandle>();
    render(<Altcha ref={ref} />);

    expect(ref.current).toMatchObject({
      value: null,
      reset: expect.any(Function),
    });
  });
});
