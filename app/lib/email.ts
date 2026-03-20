'use server';

import { Resend } from "resend";
import { createElement, type ReactNode } from "react";
import { render } from "@react-email/render";
import { OTPEmailTemplate } from "../components/email/OTP-template";
import { ForgotPasswordEmailTemplate } from "../components/email/forgot-password-template";
import { RegistrationReceivedEmailTemplate } from "../components/email/Registration-received-template";
import { UserStatusChangeEmailTemplate } from "../components/email/User-status-change-template";

const resend = new Resend(process.env.RESEND_API_KEY);


async function sendEmail(to: string, subject: string, template: ReactNode) {
    if (!process.env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY is not configured');
    }

    const html = await render(template);

    const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: ["distributortesting26@gmail.com"],
        subject,
        html,
    });

    if (error) {
        throw new Error(error.message || 'Failed to send email');
    }

    return data;
}

export async function sendOTPEmail(toEmail: string, otp: string) {
    const template = createElement(OTPEmailTemplate, { email: toEmail, otp });
    return await sendEmail(toEmail, 'Your OTP Code', template);
}

export async function sendForgotPasswordEmail(toEmail: string, link: string) {
    const template = createElement(ForgotPasswordEmailTemplate, { email: toEmail, link });
    return await sendEmail(toEmail, 'Reset your password (valid for 4 hours)', template);
}

export async function sendRegistrationReceivedEmail(toEmail: string) {
    const template = createElement(RegistrationReceivedEmailTemplate, { email: toEmail });
    return await sendEmail(toEmail, 'Registration request received', template);
}

export async function sendUserBlockedEmail(toEmail: string) {
    const template = createElement(UserStatusChangeEmailTemplate, { email: toEmail, status: 'blocked' });
    return await sendEmail(toEmail, 'Account status update: blocked', template);
}

export async function sendUserReactivatedEmail(toEmail: string) {
    const template = createElement(UserStatusChangeEmailTemplate, { email: toEmail, status: 'reactivated' });
    return await sendEmail(toEmail, 'Account status update: reactivated', template);
}

export async function sendUserApprovedEmail(toEmail: string) {
    const template = createElement(UserStatusChangeEmailTemplate, { email: toEmail, status: 'approved' });
    return await sendEmail(toEmail, 'Application status update: approved', template);
}

export async function sendUserRejectedEmail(toEmail: string) {
    const template = createElement(UserStatusChangeEmailTemplate, { email: toEmail, status: 'rejected' });
    return await sendEmail(toEmail, 'Application status update: rejected', template);
}
