'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { Field } from '../components/form-fields/Field';
import { PasswordInput } from '../components/form-fields/PasswordInput';
import { OtpModal } from '../components/modals/otp-modal';

const AltchaWidget = dynamic(() => import('../components/altcha/AltchaWrapper'), {
    ssr: false,
    loading: () => <p className="text-sm text-[#6f8aa8]">Loading verification...</p>,
});

type FormValues = {
    fullName: string;
    workEmail: string;
    company: string;
    purpose: string;
    password: string;
    confirmPassword: string;
    altcha: string;
    acceptedTerms: boolean;
};

const inputClass = (hasError: boolean) =>
    `h-11 w-full rounded-lg border bg-white px-3 text-[#1b2f49] outline-none transition focus:ring-2 ${hasError
        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
        : 'border-[#d6deea] focus:border-[#1377c5] focus:ring-[#1377c5]/20'
    }`;

const textareaClass = (hasError: boolean) =>
    `min-h-24 w-full rounded-lg border bg-white px-3 py-2 text-[#1b2f49] outline-none transition focus:ring-2 ${hasError
        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
        : 'border-[#d6deea] focus:border-[#1377c5] focus:ring-[#1377c5]/20'
    }`;

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [success, setSuccess] = useState('');
    const [submissionError, setSubmissionError] = useState('');
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [pendingEmail, setPendingEmail] = useState('');
    const [resendCountdown, setResendCountdown] = useState(60);
    const [resendMessage, setResendMessage] = useState('');
    const [resendError, setResendError] = useState('');
    const [isResendingOtp, setIsResendingOtp] = useState(false);
    const [isFetchingCompany, setIsFetchingCompany] = useState(false);
    const [companyLocked, setCompanyLocked] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        clearErrors,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({ mode: 'onSubmit', reValidateMode: 'onChange' });

    useEffect(() => {
        if (!isOtpModalOpen) {
            setResendCountdown(60);
            setResendMessage('');
            setResendError('');
            return;
        }

        if (resendCountdown <= 0) {
            return;
        }

        const timer = window.setTimeout(() => {
            setResendCountdown((prev) => Math.max(prev - 1, 0));
        }, 1000);

        return () => window.clearTimeout(timer);
    }, [isOtpModalOpen, resendCountdown]);

    const onSubmit = async (data: FormValues) => {
        setSubmissionError('');
        setSuccess('');

        try {
            await submitRegistration(data);
            setPendingEmail(data.workEmail);
            setResendCountdown(60);
            setResendMessage('');
            setResendError('');
            setIsOtpModalOpen(true);
        } catch (err) {
            setSubmissionError(err instanceof Error ? err.message : 'An error occurred during registration. Please try again.');
        }
    };

    const submitRegistration = async (data: FormValues) => {
        const response = await fetch('/api/account/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData?.message || 'Registration failed');
        }

        return responseData;
    };

    const submitOtpVerification = async (values: { otp: string; altcha: string }) => {
        const response = await fetch('/api/account/validateotp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: pendingEmail,
                otp: values.otp,
                altcha: values.altcha,
                otp_type: 'registration',
            }),
        });

        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData?.message || 'OTP verification failed');
        }

        setIsOtpModalOpen(false);
        setPendingEmail('');
        setResendCountdown(60);
        setResendMessage('');
        setResendError('');
        setSuccess(responseData?.message || 'Registration request submitted. We will review your application shortly.');
        reset();
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    const handleEmailBlur = async (email: string) => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
        setIsFetchingCompany(true);
        try {
            const response = await fetch('/api/account/company-lookup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json() as { companyName: string | null };
            if (data.companyName) {
                setValue('company', data.companyName, { shouldValidate: true });
                setCompanyLocked(true);
            }
        } catch {
            // silently ignore lookup errors
        } finally {
            setIsFetchingCompany(false);
        }
    };

    const resendOtp = async () => {
        if (!pendingEmail || resendCountdown > 0) {
            return;
        }

        setIsResendingOtp(true);
        setResendError('');
        setResendMessage('');

        try {
            const response = await fetch('/api/account/resend-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: pendingEmail,
                    otp_type: 'registration',
                }),
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData?.message || 'Unable to resend OTP');
            }

            setResendCountdown(60);
            setResendMessage(responseData?.message || 'OTP resent successfully.');
        } catch (error) {
            setResendError(error instanceof Error ? error.message : 'Unable to resend OTP');
        } finally {
            setIsResendingOtp(false);
        }
    };


    return (
        <main className="relative min-h-screen overflow-hidden bg-[#5aa3dd] px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-10 top-8 h-32 w-32 rotate-12 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm" />
                <div className="absolute right-16 top-16 h-36 w-36 -rotate-12 rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm" />
                <div className="absolute left-12 bottom-16 h-28 w-28 rotate-6 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm" />
            </div>

            <section className="relative mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/40 bg-[#f6f8fc] shadow-[0_20px_40px_rgba(10,50,90,0.28)] md:grid-cols-[1fr_1.3fr]">
                <div className="flex min-h-[260px] flex-col justify-center gap-4 border-b border-[#cfddec] px-8 py-10 md:border-b-0 md:border-r md:border-r-[#cfddec] md:px-10 lg:px-12">
                    <p className="text-[2rem] font-semibold leading-tight text-[#1a2f4c]">Register for Accessing</p>
                    <div>
                        <p className="text-4xl font-bold text-[#03589e]">Distributor Asset Hub</p>
                    </div>
                    <p className="max-w-sm text-xl italic text-[#2a6ba4]">
                        Submit your information for approval to access the Distributor Hub.
                    </p>
                </div>

                <div className="px-6 py-8 sm:px-10 sm:py-10">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Full Name *" error={errors.fullName?.message}>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    className={inputClass(!!errors.fullName)}
                                    {...register('fullName', { required: 'Full name is required.' })}
                                />
                            </Field>

                            <Field label="Work Email *" error={errors.workEmail?.message}>
                                {(() => {
                                    const reg = register('workEmail', {
                                        required: 'Work email is required.',
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: 'Enter a valid email address.',
                                        },
                                    });
                                    return (
                                        <input
                                            type="email"
                                            placeholder="Enter your work email"
                                            className={inputClass(!!errors.workEmail)}
                                            {...reg}
                                            onBlur={(e) => {
                                                reg.onBlur(e);
                                                handleEmailBlur(e.target.value);
                                            }}
                                            onChange={(e) => {
                                                reg.onChange(e);
                                                if (companyLocked) {
                                                    setCompanyLocked(false);
                                                    setValue('company', '');
                                                }
                                            }}
                                        />
                                    );
                                })()}
                            </Field>
                        </div>

                        <Field label="Company *" error={errors.company?.message}>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={isFetchingCompany ? 'Fetching company details…' : 'Enter your company name'}
                                    disabled={companyLocked || isFetchingCompany}
                                    className={`${inputClass(!!errors.company)}${isFetchingCompany || companyLocked ? ' pr-10' : ''}${companyLocked ? ' cursor-not-allowed border-[#85b8e0] bg-[#edf5ff]' : ''}${isFetchingCompany ? ' cursor-wait' : ''}`}
                                    {...register('company', { required: 'Company is required.' })}
                                />
                                {isFetchingCompany && (
                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                                        <span className="block h-4 w-4 animate-spin rounded-full border-2 border-[#1377c5] border-t-transparent" />
                                    </span>
                                )}
                                {companyLocked && !isFetchingCompany && (
                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#3a7fc1]">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 116 0v3H9z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                )}
                            </div>
                            {isFetchingCompany && (
                                <p className="mt-1 text-xs text-[#6f8aa8]">Fetching company details from your email domain…</p>
                            )}
                            {companyLocked && !isFetchingCompany && (
                                <p className="mt-1 text-xs text-[#3a7fc1]">Company auto-filled from your email domain.</p>
                            )}
                        </Field>

                        <Field label="Purpose of Access *" error={errors.purpose?.message}>
                            <textarea
                                placeholder="Describe why you need access to the distributor hub"
                                className={textareaClass(!!errors.purpose)}
                                {...register('purpose', { required: 'Purpose of access is required.' })}
                            />
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Password *" error={errors.password?.message}>
                                <PasswordInput
                                    isVisible={showPassword}
                                    onToggleVisibility={() => setShowPassword((prev) => !prev)}
                                    placeholder="Create a password"
                                    hasError={!!errors.password}
                                    registration={register('password', {
                                        required: 'Password is required.',
                                        minLength: { value: 8, message: 'Password must be at least 8 characters.' },
                                    })}
                                />
                            </Field>

                            <Field label="Confirm Password *" error={errors.confirmPassword?.message}>
                                <PasswordInput
                                    isVisible={showConfirmPassword}
                                    onToggleVisibility={() => setShowConfirmPassword((prev) => !prev)}
                                    placeholder="Confirm your password"
                                    hasError={!!errors.confirmPassword}
                                    registration={register('confirmPassword', {
                                        required: 'Please confirm your password.',
                                        validate: (v) => v === watch('password') || 'Passwords do not match.',
                                    })}
                                />
                            </Field>
                        </div>

                        <div className="space-y-1 text-sm text-[#253f5f]">
                            {/* Hidden input lets RHF track the ALTCHA payload as a real field */}
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
                            {errors.altcha ? (
                                <p className="text-xs text-red-600 mt-1">{errors.altcha.message as string}</p>
                            ) : null}
                        </div>

                        <div className="space-y-1">
                            <label className="flex items-start gap-2 text-sm text-[#253f5f]">
                                <input
                                    type="checkbox"
                                    className="mt-0.5 h-4 w-4 rounded border-[#9db5ce] text-[#1377c5] focus:ring-[#1377c5]"
                                    {...register('acceptedTerms', {
                                        required: 'You must accept the Terms of Service and Privacy Policy.',
                                    })}
                                />
                                <span>
                                    I agree to the{' '}
                                    <a href="#" className="text-[#1170b8] hover:underline">
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a href="#" className="text-[#1170b8] hover:underline">
                                        Privacy Policy
                                    </a>
                                </span>
                            </label>
                            {errors.acceptedTerms ? (
                                <p className="text-xs text-red-600">{errors.acceptedTerms.message}</p>
                            ) : null}
                        </div>

                        {submissionError ? <p className="text-sm text-red-600">{submissionError}</p> : null}
                        {success ? <p className="text-sm text-green-700">{success}</p> : null}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-11 w-full rounded-lg bg-[#0f82ca] text-sm font-semibold text-white transition hover:bg-[#0b70b0] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Registration Request'}
                        </button>

                        <p className="text-sm text-[#325377]">
                            Already have an account?{' '}
                            <Link href="/login" className="font-semibold text-[#0f75bd] hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </section>

            <OtpModal
                isOpen={isOtpModalOpen}
                title="Verify Your Email"
                disableClose={true}
                content={
                    <div className="space-y-3">
                        <p>
                            Registration request submitted. Enter the OTP sent to <strong>{pendingEmail}</strong> to verify
                            your email address and complete the application process.
                        </p>
                        <div className="rounded-xl border border-[#d6deea] bg-white/70 p-3 text-sm text-[#325377]">
                            <p className="font-semibold text-[#1a2f4c]">Didn&apos;t receive the OTP?</p>
                            <p className="mt-1">
                                {resendCountdown > 0
                                    ? `You can resend after ${resendCountdown} seconds.`
                                    : 'You can resend the OTP now.'}
                            </p>
                            <button
                                type="button"
                                onClick={resendOtp}
                                disabled={resendCountdown > 0 || isResendingOtp}
                                className="mt-3 text-sm font-semibold text-[#0f75bd] transition hover:underline disabled:cursor-not-allowed disabled:text-[#8ba3bc] disabled:no-underline"
                            >
                                {isResendingOtp ? 'Resending OTP...' : 'Resend OTP'}
                            </button>
                            {resendMessage ? <p className="mt-2 text-sm text-green-700">{resendMessage}</p> : null}
                            {resendError ? <p className="mt-2 text-sm text-red-600">{resendError}</p> : null}
                        </div>
                    </div>
                }
                submitLabel="Verify OTP"
                onClose={() => undefined}
                onSubmitAction={submitOtpVerification}
            />
        </main>
    );
}


