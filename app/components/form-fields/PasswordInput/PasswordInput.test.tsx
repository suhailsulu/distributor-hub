import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PasswordInput } from "./PasswordInput";

const registration = {
  name: "password",
  onChange: vi.fn(),
  onBlur: vi.fn(),
  ref: vi.fn(),
};

describe("PasswordInput", () => {
  it("renders a password field by default", () => {
    render(
      <PasswordInput
        isVisible={false}
        onToggleVisibility={vi.fn()}
        placeholder="Password"
        hasError={false}
        registration={registration}
      />,
    );

    expect(screen.getByPlaceholderText("Password")).toHaveAttribute(
      "type",
      "password",
    );
    expect(screen.getByLabelText("Show password")).toBeInTheDocument();
  });

  it("shows plain text when visible", () => {
    render(
      <PasswordInput
        isVisible
        onToggleVisibility={vi.fn()}
        placeholder="Password"
        hasError={false}
        registration={registration}
      />,
    );

    expect(screen.getByPlaceholderText("Password")).toHaveAttribute(
      "type",
      "text",
    );
    expect(screen.getByLabelText("Hide password")).toBeInTheDocument();
  });

  it("calls onToggleVisibility when the toggle is clicked", async () => {
    const user = userEvent.setup();
    const onToggleVisibility = vi.fn();

    render(
      <PasswordInput
        isVisible={false}
        onToggleVisibility={onToggleVisibility}
        placeholder="Password"
        hasError={false}
        registration={registration}
      />,
    );

    await user.click(screen.getByLabelText("Show password"));
    expect(onToggleVisibility).toHaveBeenCalledTimes(1);
  });
});
