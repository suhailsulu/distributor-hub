import { EmailLayout } from "./EmailLayout";

interface RegistrationReceivedEmailTemplateProps {
	email: string;
}

export function RegistrationReceivedEmailTemplate({ email }: RegistrationReceivedEmailTemplateProps) {
	return (
		<EmailLayout title="Registration request received" subtitle="Distributor Hub application update">
			<p>Dear {email},</p>
			<p>
				Your registration request for accessing Distributor Hub is received. You will get a confirmation
				email once the review team reviews your application.
			</p>
			<p>Your application can be approved or rejected based on the review outcome.</p>
			<p>Thank you for your patience.</p>
		</EmailLayout>
	);
}
