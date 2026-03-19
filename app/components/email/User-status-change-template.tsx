import { EmailLayout } from "./EmailLayout";

type UserStatus = "approved" | "rejected" | "blocked" | "reactivated";

interface UserStatusChangeEmailTemplateProps {
    email: string;
    status: UserStatus;
}

const statusContent: Record<UserStatus, { title: string; subtitle: string; message: string }> = {
    approved: {
        title: "Application status updated",
        subtitle: "Your Distributor Hub application is approved",
        message:
            "Your registration request has been approved by the review team. You can now access Distributor Hub using your credentials.",
    },
    rejected: {
        title: "Application status updated",
        subtitle: "Your Distributor Hub application is rejected",
        message:
            "Your registration request has been rejected by the review team. If you need more information, please contact support.",
    },
    blocked: {
        title: "Account status changed",
        subtitle: "Your Distributor Hub account is blocked",
        message:
            "Your account has been blocked by the review team. If you think this is a mistake, please contact support for further assistance.",
    },
    reactivated: {
        title: "Account status changed",
        subtitle: "Your Distributor Hub account is reactivated",
        message:
            "Your account has been reactivated and you can now access Distributor Hub again. You can log in using your existing credentials.",
    },
};

export function UserStatusChangeEmailTemplate({ email, status }: UserStatusChangeEmailTemplateProps) {
    const content = statusContent[status];

    return (
        <EmailLayout title={content.title} subtitle={content.subtitle}>
            <p>Dear {email},</p>
            <p>{content.message}</p>
        </EmailLayout>
    );
}
