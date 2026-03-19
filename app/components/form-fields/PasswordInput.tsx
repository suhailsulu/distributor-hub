import type { UseFormRegisterReturn } from 'react-hook-form';

export function PasswordInput({
    isVisible,
    onToggleVisibility,
    placeholder,
    hasError,
    registration,
}: {
    isVisible: boolean;
    onToggleVisibility: () => void;
    placeholder: string;
    hasError: boolean;
    registration: UseFormRegisterReturn;
}) {
    const cls = `h-11 w-full rounded-lg border bg-white px-3 pr-11 text-[#1b2f49] outline-none transition focus:ring-2 ${
        hasError
            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
            : 'border-[#d6deea] focus:border-[#1377c5] focus:ring-[#1377c5]/20'
    }`;

    return (
        <div className="relative">
            <input
                type={isVisible ? 'text' : 'password'}
                placeholder={placeholder}
                className={cls}
                {...registration}
            />
            <button
                type="button"
                aria-label={isVisible ? 'Hide password' : 'Show password'}
                onClick={onToggleVisibility}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#6f8aa8] transition hover:text-[#2f537a]"
            >
                {isVisible ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                            d="M3 3L21 21M10.58 10.58A2 2 0 0 0 13.42 13.42M9.88 5.09A10.74 10.74 0 0 1 12 4.9C16.55 4.9 20.21 7.7 21.5 12C21.06 13.5 20.23 14.83 19.13 15.9M14.11 14.12A3 3 0 0 1 9.88 9.88"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M6.1 6.1C4.27 7.4 2.89 9.44 2.5 12C3.79 16.3 7.45 19.1 12 19.1C13.36 19.1 14.67 18.84 15.88 18.35"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                            d="M2.5 12C3.79 7.7 7.45 4.9 12 4.9C16.55 4.9 20.21 7.7 21.5 12C20.21 16.3 16.55 19.1 12 19.1C7.45 19.1 3.79 16.3 2.5 12Z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <circle
                            cx="12"
                            cy="12"
                            r="3"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
            </button>
        </div>
    );
}
