'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { Field } from '../components/form-fields/Field';
import { Toast } from '../components/utilities/Toast';

const AltchaWidget = dynamic(() => import('../components/altcha/AltchaWrapper'), {
    ssr: false,
    loading: () => <p className="text-sm text-[#6f8aa8]">Loading verification...</p>,
});

type ResetPasswordValues = {
    altcha: string;
    newPassword: string;
    confirmPassword: string;
};

const inputClass = (hasError: boolean) =>
    `h-11 w-full rounded-lg border bg-white px-3 text-[#1b2f49] outline-none transition focus:ring-2 ${hasError
        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
        : 'border-[#d6deea] focus:border-[#1377c5] focus:ring-[#1377c5]/20'
    }`;

export default function ResetPasswordPage() {
    return (
        <Suspense>
            <ResetPasswordContent />
        </Suspense>
    );
}

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [toastMessage, setToastMessage] = useState('');

    const blockClipboard = (e: React.ClipboardEvent) => {
        e.preventDefault();
        setToastMessage('Copy & paste is disabled for security reasons.');
    };

    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        formState: { errors, isSubmitting },
        watch
    } = useForm<ResetPasswordValues>({ mode: 'onSubmit', reValidateMode: 'onChange' });

    const onSubmit = async (data: ResetPasswordValues) => {
        setMessage('');
        setErrorMessage('');

        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword: data.newPassword, confirmPassword: data.confirmPassword, altchaToken: data.altcha }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData?.message || 'Unable to reset password');
            }

            setMessage(responseData?.message || 'Your password has been reset successfully.');
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'An error occurred. Please try again.');
        }
    };

    if (!token) {
        return (
            <main className="relative min-h-screen overflow-hidden bg-[#5aa3dd] px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center">
                <section className="relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-white/40 bg-[#f6f8fc] px-6 py-8 shadow-[0_20px_40px_rgba(10,50,90,0.28)] sm:px-10 sm:py-10 text-center">
                    <h1 className="text-2xl font-bold text-[#1a2f4c]">Link not valid</h1>
                    <p className="mt-3 text-sm text-[#466a91]">This password reset link is invalid or has already been used. Please request a new one.</p>
                    <Link href="/forgot-password" className="mt-6 inline-block text-sm font-semibold text-[#0f75bd] hover:underline">
                        Request a new reset link
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <>
        <main className="relative min-h-screen overflow-hidden bg-[#5aa3dd] px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-10 top-8 h-32 w-32 rotate-12 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm" />
                <div className="absolute right-16 top-16 h-36 w-36 -rotate-12 rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm" />
                <div className="absolute left-12 bottom-16 h-28 w-28 rotate-6 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm" />
            </div>

            <section className="relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-white/40 bg-[#f6f8fc] px-6 py-8 shadow-[0_20px_40px_rgba(10,50,90,0.28)] sm:px-10 sm:py-10">
                <h1 className="text-3xl font-bold text-[#1a2f4c]">Reset Password</h1>
                <p className="mt-2 text-sm text-[#466a91]">Enter your new password and complete verification to reset your password.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5" noValidate>
                    <Field label="New Password *" error={errors.newPassword?.message}>
                        <input
                            type="password"
                            placeholder="Enter your new password"
                            className={inputClass(!!errors.newPassword)}
                            onCopy={blockClipboard}
                            onPaste={blockClipboard}
                            onCut={blockClipboard}
                            {...register('newPassword', {
                                required: 'New password is required.',
                                minLength: {
                                    value: 8,
                                    message: 'Password must be at least 8 characters long.',
                                },
                            })}
                        />
                    </Field>

                    <Field label="Confirm Password *" error={errors.confirmPassword?.message}>
                        <input
                            type="password"
                            placeholder="Confirm your new password"
                            className={inputClass(!!errors.confirmPassword)}
                            onCopy={blockClipboard}
                            onPaste={blockClipboard}
                            onCut={blockClipboard}
                            {...register('confirmPassword', {
                                required: 'Please confirm your new password.',
                                validate: (value) => value === watch('newPassword') || 'Passwords do not match.',
                            })}
                        />
                    </Field>

                    <div className="space-y-1 text-sm text-[#253f5f]">
                        <input
                            type="hidden"
                            {...register('altcha', {
                                validate: (v) => !!v || 'Please complete the CAPTCHA verification.',
                            })}
                        />
                        <AltchaWidget
                            expireMs={6000}
                            onStateChange={(ev) => {
                                if ('detail' in ev) {
                                    const detail = (ev as CustomEvent<{ payload?: string; state?: string }>).detail;
                                    if (detail?.state === 'verifying') {
                                        clearErrors('altcha');
                                        setValue('altcha', detail.payload ?? '', { shouldValidate: false });
                                        return;
                                    }
                                    setValue('altcha', detail?.payload ?? '', { shouldValidate: true });
                                }
                            }}
                        />
                        {errors.altcha ? <p className="text-xs text-red-600 mt-1">{errors.altcha.message}</p> : null}
                    </div>

                    {errorMessage ? <p className="text-sm text-red-600 mt-1">{errorMessage}</p> : null}
                    {message ? <p className="text-sm text-green-700 mt-1">{message}</p> : null}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-11 w-full rounded-lg bg-[#0f82ca] text-sm font-semibold text-white transition hover:bg-[#0b70b0] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting ? 'Sending...' : 'Reset Password'}
                    </button>

                    <p className="text-sm text-[#325377]">
                        Back to{' '}
                        <Link href="/login" className="font-semibold text-[#0f75bd] hover:underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            </section>
        </main>
        {toastMessage ? <Toast message={toastMessage} onClose={() => setToastMessage('')} /> : null}
        </>
    );
}