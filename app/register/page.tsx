'use client';

import Link from 'next/link';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { Field } from '../components/form-fields/Field';
import { PasswordInput } from '../components/form-fields/PasswordInput';

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

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        clearErrors,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({ mode: 'onSubmit', reValidateMode: 'onChange' });

    const onSubmit = async (_data: FormValues) => {
        await new Promise((resolve) => setTimeout(resolve, 900));
        setSuccess('Registration request submitted. We will review and contact you shortly.');
        reset();
        setShowPassword(false);
        setShowConfirmPassword(false);
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
                                <input
                                    type="email"
                                    placeholder="Enter your work email"
                                    className={inputClass(!!errors.workEmail)}
                                    {...register('workEmail', {
                                        required: 'Work email is required.',
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: 'Enter a valid email address.',
                                        },
                                    })}
                                />
                            </Field>
                        </div>

                        <Field label="Company *" error={errors.company?.message}>
                            <input
                                type="text"
                                placeholder="Enter your company name"
                                className={inputClass(!!errors.company)}
                                {...register('company', { required: 'Company is required.' })}
                            />
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
        </main>
    );
}


