
'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Field } from '../components/form-fields/Field';
import { PasswordInput } from '../components/form-fields/PasswordInput';

const AltchaWidget = dynamic(() => import('../components/altcha/AltchaWrapper'), {
    ssr: false,
    loading: () => <p className="text-sm text-[#6f8aa8]">Loading verification...</p>,
});

type LoginFormValues = {
    workEmail: string;
    password: string;
    altcha: string;
};

const inputClass = (hasError: boolean) =>
    `h-11 w-full rounded-lg border bg-white px-3 text-[#1b2f49] outline-none transition focus:ring-2 ${hasError
        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
        : 'border-[#d6deea] focus:border-[#1377c5] focus:ring-[#1377c5]/20'
    }`;

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState('');

    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({ mode: 'onSubmit', reValidateMode: 'onChange' });

    const onSubmit = async (data: LoginFormValues) => {
        setAuthError('');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: data.workEmail,
                    password: data.password,
                    altcha: data.altcha,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Login failed');
            }

            router.push('/dashboard');
        } catch (err) {
            setAuthError(err instanceof Error ? err.message : 'An error occurred');
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
                    <p className="text-[2rem] font-semibold leading-tight text-[#1a2f4c]">Login to Access</p>
                    <div>
                        <p className="text-4xl font-bold text-[#03589e]">Distributor Asset Hub</p>
                    </div>
                    <p className="max-w-sm text-xl italic text-[#2a6ba4]">
                        Sign in to access resources, assets, and distributor tools.
                    </p>
                </div>

                <div className="px-6 py-8 sm:px-10 sm:py-10">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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

                        <Field label="Password *" error={errors.password?.message}>
                            <PasswordInput
                                isVisible={showPassword}
                                onToggleVisibility={() => setShowPassword((prev) => !prev)}
                                placeholder="Enter your password"
                                hasError={!!errors.password}
                                registration={register('password', {
                                    required: 'Password is required.',
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
                        <div className="text-sm text-[#325377]">
                            <Link href="/forgot-password" className="font-semibold text-[#0f75bd] hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        {authError ? <p className="text-sm text-red-600">{authError}</p> : null}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-11 w-full rounded-lg bg-[#0f82ca] text-sm font-semibold text-white transition hover:bg-[#0b70b0] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                        </button>

                        <p className="text-sm text-[#325377]">
                            Need access?{' '}
                            <Link href="/register" className="font-semibold text-[#0f75bd] hover:underline">
                                Register
                            </Link>
                        </p>
                    </form>
                </div>
            </section>
        </main>
    );
}