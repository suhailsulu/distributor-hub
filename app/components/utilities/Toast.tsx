'use client';

import { useEffect } from 'react';

interface ToastProps {
    message: string;
    onClose: () => void;
    durationMs?: number;
}

export function Toast({ message, onClose, durationMs = 3000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, durationMs);
        return () => clearTimeout(timer);
    }, [onClose, durationMs]);

    return (
        <div
            role="alert"
            aria-live="assertive"
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-[#1a2f4c] px-5 py-3 text-sm font-medium text-white shadow-lg"
        >
            {message}
        </div>
    );
}
