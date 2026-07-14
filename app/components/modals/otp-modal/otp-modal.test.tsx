import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OtpModal } from "./otp-modal";

vi.mock("next/dynamic", () => ({
  default: () => {
    function MockAltcha() {
      return <div data-testid="altcha-widget">Altcha</div>;
    }
    return MockAltcha;
  },
}));

describe("OtpModal", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <OtpModal
        isOpen={false}
        title="Verify OTP"
        content={<p>Enter your code</p>}
        onClose={vi.fn()}
        onSubmitAction={vi.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders title and content when open", () => {
    render(
      <OtpModal
        isOpen
        title="Verify OTP"
        content={<p>Enter your code</p>}
        onClose={vi.fn()}
        onSubmitAction={vi.fn()}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Verify OTP")).toBeInTheDocument();
    expect(screen.getByText("Enter your code")).toBeInTheDocument();
  });

  it("calls onClose when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <OtpModal
        isOpen
        title="Verify OTP"
        content={<p>Enter your code</p>}
        onClose={onClose}
        onSubmitAction={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows validation error when OTP is empty", async () => {
    const user = userEvent.setup();

    render(
      <OtpModal
        isOpen
        title="Verify OTP"
        content={<p>Enter your code</p>}
        onClose={vi.fn()}
        onSubmitAction={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(await screen.findByText("OTP is required.")).toBeInTheDocument();
  });
});
