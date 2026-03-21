'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { type ClipboardEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Field } from '../components/form-fields/Field';
import { Toast } from '../components/utilities/Toast';
import { PasswordInput } from '../components/form-fields/PasswordInput';

const AltchaWidget = dynamic(() => import('../components/altcha/AltchaWrapper'), {
    ssr: false,
    loading: () => <p className="text-sm text-[#6f8aa8]">Loading verification...</p>,
});

type ResetPasswordValues = {
    altcha: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

type ResetPasswordClientProps = {
    token: string | null;
    isLoggedIn: boolean;
};

export function ResetPasswordClient({ token, isLoggedIn }: ResetPasswordClientProps) {
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const blockClipboard = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        setToastMessage('Copy & paste is disabled for security reasons.');
    };

    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<ResetPasswordValues>({ mode: 'onSubmit', reValidateMode: 'onChange' });

    const onSubmit = async (data: ResetPasswordValues) => {
        setMessage('');
        setErrorMessage('');

        try {
            const body: Record<string, string> = {
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
                altcha: data.altcha,
            };

            if (isLoggedIn) {
                body.currentPassword = data.currentPassword;
            } else if (token) {
                body.token = token;
            }

            const response = await fetch('/api/account/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData?.message || 'Unable to reset password');
            }

            setMessage(responseData?.message || 'Your password has been reset successfully.');
            // Clear form fields
            setValue('currentPassword', '');
            setValue('newPassword', '');
            setValue('confirmPassword', '');
            setValue('altcha', '');
            clearErrors();
            //remove token from url
            if (token) {
                const url = new URL(window.location.href);  
                url.searchParams.delete('token');
                window.history.replaceState({}, '', url.toString());
            }
            // set timeout redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'An error occurred. Please try again.');
            setToastMessage('Password reset failed. Please check the form and try again.');
        }
    };

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
                        {isLoggedIn && (
                            <Field label="Current Password *" error={errors.currentPassword?.message}>
                                <PasswordInput
                                    isVisible={showCurrentPassword}
                                    onToggleVisibility={() => setShowCurrentPassword((p) => !p)}
                                    placeholder="Enter your current password"
                                    hasError={!!errors.currentPassword}
                                    onCopy={blockClipboard}
                                    onPaste={blockClipboard}
                                    onCut={blockClipboard}
                                    registration={register('currentPassword', {
                                        required: 'Current password is required.',
                                        maxLength: {
                                            value: 20,
                                            message: 'Password must be at most 20 characters long.',
                                        },
                                    })}
                                />
                            </Field>
                        )}

                        <Field label="New Password *" error={errors.newPassword?.message}>
                            <PasswordInput
                                isVisible={showNewPassword}
                                onToggleVisibility={() => setShowNewPassword((p) => !p)}
                                placeholder="Enter your new password"
                                hasError={!!errors.newPassword}
                                onCopy={blockClipboard}
                                onPaste={blockClipboard}
                                onCut={blockClipboard}
                                registration={register('newPassword', {
                                    required: 'New password is required.',
                                    minLength: {
                                        value: 8,
                                        message: 'Password must be at least 8 characters long.',
                                    },
                                    maxLength: {
                                        value: 20,
                                        message: 'Password must be at most 20 characters long.',
                                    },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                        message: 'Password must contain uppercase, lowercase, number, and special character.',
                                    },
                                })}
                            />
                        </Field>

                        <Field label="Confirm Password *" error={errors.confirmPassword?.message}>
                            <PasswordInput
                                isVisible={showConfirmPassword}
                                onToggleVisibility={() => setShowConfirmPassword((p) => !p)}
                                placeholder="Confirm your new password"
                                hasError={!!errors.confirmPassword}
                                onCopy={blockClipboard}
                                onPaste={blockClipboard}
                                onCut={blockClipboard}
                                registration={register('confirmPassword', {
                                    required: 'Please confirm your new password.',
                                    validate: (value) => value === watch('newPassword') || 'Passwords do not match.',
                                    maxLength: {
                                        value: 20,
                                        message: 'Password must be at most 20 characters long.',
                                    },
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
                                expireMs={15000}
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
                            {isSubmitting ? 'Saving...' : 'Reset Password'}
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
            {toastMessage ? <Toast message={toastMessage} onClose={() => setToastMessage('')} durationMs={3000} /> : null}
        </>
    );
}
