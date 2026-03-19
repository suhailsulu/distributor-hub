interface EmailTemplateProps {
    email: string;
    link: string;
}

import { EmailLayout } from "./EmailLayout";

export function ForgotPasswordEmailTemplate({ email, link }: EmailTemplateProps) {
    return (
        <EmailLayout title="Reset your password" subtitle="Secure password recovery">
            <p>Hello {email},</p>
            <p>We received a request to reset your password. Use the link below to set a new password:</p>
            <p>
                <a href={link}>Reset Password</a>
            </p>
            <div>
                <p>If the button does not work, copy and paste this link into your browser:</p>
                <p>{link}</p>
            </div>
            <p>This reset link is valid for 4 hours.</p>
            <p>If you did not request this, you can safely ignore this email.</p>
        </EmailLayout>
    );
}