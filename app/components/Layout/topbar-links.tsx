'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TopbarLinks() {
    const pathname = usePathname();
    const isRoot = pathname === '/';
    const [showLinks, setShowLinks] = useState(false);
    const toggleLinks = () => setShowLinks((prev) => !prev);

    useEffect(() => {
        setShowLinks(false);
    }, []);

    return (

        <div className="relative user-icon-topbar z-50">
            <button type="button" onClick={toggleLinks} title="User menu" className="rounded-full bg-gray-200 p-2 text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 cursor-pointer">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 5.1-2.4 5.1-5.1S14.7 1.8 12 1.8 6.9 4.2 6.9 6.9s2.4 5.1 5.1 5.1zm0 2.4c-3.3 0-9.9 1.7-9.9 5v2.4h19.8V19c0-3.3-6.6-5-9.9-5z" />
                </svg>
            </button>

            {showLinks && (
                <>
                    <button
                        type="button"
                        aria-label="Close user menu"
                        className="fixed inset-0 z-40 bg-transparent"
                        onClick={() => setShowLinks(false)}
                    />
                    <div className="absolute right-0 z-50 mt-2 min-w-30 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="flex flex-col items-center gap-4 p-2">
                            {isRoot && <Link href="/dashboard" className="text-sm text-[#1a2f4c] hover:text-[#1377c5]">Dashboard</Link>}
                            <Link href="/reset-password" className="text-sm text-[#1a2f4c] hover:text-[#1377c5]">Reset Password</Link>
                            <Link href="/api/logout" className="text-sm text-[#1a2f4c] hover:text-[#1377c5]">Logout</Link>
                        </div>
                    </div>
                </>
            )}
        </div >
    );
}