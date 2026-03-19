'use server';

import { Resend } from "resend";
import { createElement, type ReactNode } from "react";
import { OTPEmailTemplate } from "../components/email/OTP-template";
import { ForgotPasswordEmailTemplate } from "../components/email/forgot-password-template";
import { RegistrationReceivedEmailTemplate } from "../components/email/Registration-received-template";
import { UserStatusChangeEmailTemplate } from "../components/email/User-status-change-template";

const resend = new Resend(process.env.RESEND_API_KEY);


async function sendEmail(to: string, subject: string, template: ReactNode) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'distributortesting26@gmail.com',
            to: [to],
            subject: subject,
            react: template,
        });

        if (error) {
            return Response.json({ error }, { status: 500 });
        }

        return Response.json(data);
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
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
