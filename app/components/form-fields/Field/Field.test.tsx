import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Field } from "./Field";

describe("Field", () => {
  it("renders the label and children", () => {
    render(
      <Field label="Email *">
        <input aria-label="email-input" />
      </Field>,
    );

    expect(screen.getByText("Email *")).toBeInTheDocument();
    expect(screen.getByLabelText("email-input")).toBeInTheDocument();
  });

  it("renders an error message when provided", () => {
    render(
      <Field label="Email *" error="Email is required.">
        <input />
      </Field>,
    );

    expect(screen.getByText("Email is required.")).toBeInTheDocument();
  });

  it("omits the error message when not provided", () => {
    const { container } = render(
      <Field label="Email *">
        <input />
      </Field>,
    );

    expect(container.querySelector(".text-red-600")).toBeNull();
  });
});
