'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Field } from '../form-fields/Field';

const AltchaWidget = dynamic(() => import('../altcha/AltchaWrapper'), {
	ssr: false,
	loading: () => <p className="text-sm text-[#6f8aa8]">Loading verification...</p>,
});

type OtpModalValues = {
	otp: string;
	altcha: string;
};

type OtpModalProps = {
	isOpen: boolean;
	title: string;
	content: React.ReactNode;
	submitLabel?: string | 'Submit';
	disableClose?: boolean;
	onClose: () => void;
	onSubmitAction: (values: OtpModalValues) => Promise<void> | void;
};

const inputClass = (hasError: boolean) =>
	`h-11 w-full rounded-lg border bg-white px-3 text-[#1b2f49] outline-none transition focus:ring-2 ${hasError
		? 'border-red-400 focus:border-red-500 focus:ring-red-200'
		: 'border-[#d6deea] focus:border-[#1377c5] focus:ring-[#1377c5]/20'
	}`;

export function OtpModal({
	isOpen,
	title,
	content,
	submitLabel = 'Submit',
	disableClose = false,
	onClose,
	onSubmitAction,
}: OtpModalProps) {
	const [submitError, setSubmitError] = useState('');

	const {
		register,
		handleSubmit,
		setValue,
		clearErrors,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<OtpModalValues>({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		defaultValues: {
			otp: '',
			altcha: '',
		},
	});

	useEffect(() => {
		if (!isOpen) {
			reset();
			setSubmitError('');
		}
	}, [isOpen, reset]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && !isSubmitting && !disableClose) {
				onClose();
			}
		};

		window.addEventListener('keydown', handleEscape);
		return () => window.removeEventListener('keydown', handleEscape);
	}, [disableClose, isOpen, isSubmitting, onClose]);

	const submitOtp = handleSubmit(async (values) => {
		setSubmitError('');

		try {
			await onSubmitAction(values);
		} catch (error) {
			setSubmitError(error instanceof Error ? error.message : 'Unable to verify OTP.');
		}
	});

	if (!isOpen) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-[#10253d]/55 px-4 py-6 backdrop-blur-sm"
			onClick={() => {
				if (!isSubmitting && !disableClose) {
					onClose();
				}
			}}
		>
			<section
				className="relative w-full max-w-md rounded-3xl border border-white/40 bg-[#f6f8fc] px-6 py-7 shadow-[0_20px_40px_rgba(10,50,90,0.28)] sm:px-8"
				onClick={(event) => event.stopPropagation()}
				aria-modal="true"
				role="dialog"
				aria-labelledby="otp-modal-title"
			>
				{!disableClose ? (
					<button
						type="button"
						onClick={onClose}
						disabled={isSubmitting}
						className="absolute right-4 top-4 rounded-full p-2 text-[#55789c] transition hover:bg-[#e8eef6] hover:text-[#1a2f4c] disabled:cursor-not-allowed disabled:opacity-60"
						aria-label="Close modal"
					>
						<svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
							<path d="M4.22 4.22a.75.75 0 0 1 1.06 0L10 8.94l4.72-4.72a.75.75 0 1 1 1.06 1.06L11.06 10l4.72 4.72a.75.75 0 1 1-1.06 1.06L10 11.06l-4.72 4.72a.75.75 0 0 1-1.06-1.06L8.94 10 4.22 5.28a.75.75 0 0 1 0-1.06Z" />
						</svg>
					</button>
				) : null}

				<h2 id="otp-modal-title" className="pr-10 text-2xl font-bold text-[#1a2f4c]">
					{title}
				</h2>

				<div className="mt-3 text-sm leading-6 text-[#466a91]">{content}</div>

				<form onSubmit={submitOtp} className="mt-6 space-y-5" noValidate>
					<Field label="OTP *" error={errors.otp?.message}>
						<input
							type="text"
							inputMode="numeric"
							maxLength={6}
							placeholder="Enter 6-digit OTP"
							className={inputClass(!!errors.otp)}
							{...register('otp', {
								required: 'OTP is required.',
								pattern: {
									value: /^\d{6}$/,
									message: 'Enter a valid 6-digit OTP.',
								},
							})}
						/>
					</Field>

					<div className="space-y-1 text-sm text-[#253f5f]">
						<input
							type="hidden"
							{...register('altcha', {
								validate: (value) => !!value || 'Please complete the CAPTCHA verification.',
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

						{errors.altcha ? <p className="mt-1 text-xs text-red-600">{errors.altcha.message}</p> : null}
					</div>

					{submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}

					<div className="flex items-center justify-end gap-3 pt-2">
						{!disableClose ? (
							<button
								type="button"
								onClick={onClose}
								disabled={isSubmitting}
								className="h-11 rounded-lg border border-[#cfddec] px-4 text-sm font-semibold text-[#325377] transition hover:bg-[#e9f0f7] disabled:cursor-not-allowed disabled:opacity-60"
							>
								Cancel
							</button>
						) : null}
						<button
							type="submit"
							disabled={isSubmitting}
							className="h-11 rounded-lg bg-[#0f82ca] px-5 text-sm font-semibold text-white transition hover:bg-[#0b70b0] disabled:cursor-not-allowed disabled:opacity-70"
						>
							{isSubmitting ? 'Submitting...' : submitLabel}
						</button>
					</div>
				</form>
			</section>
		</div>
	);
}

export type { OtpModalProps, OtpModalValues };
