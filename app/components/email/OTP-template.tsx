interface EmailTemplateProps {
    email: string;
    otp: string;
}

import { EmailLayout } from "./EmailLayout";

export function OTPEmailTemplate({ email, otp }: EmailTemplateProps) {
    return (
        <EmailLayout title="Verification Code" subtitle="Secure access to your account">
            <p>Hello {email},</p>
            <p>We received a request to verify your account. Use the code below to proceed:</p>
            <p>
                <strong>Your verification code:</strong> {otp}
            </p>
            <p>
                <strong>Valid for 10 minutes only.</strong>
            </p>
            <p>If you did not request this code, you can safely ignore this email.</p>
            <p>
                Security notice: Never share this code with anyone. We will never ask for your OTP via email or
                phone.
            </p>
        </EmailLayout>
    );
}