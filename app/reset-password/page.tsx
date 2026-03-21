import Link from 'next/link';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, type SessionData } from '@/app/lib/session';
import { ResetPasswordClient } from './ResetPasswordClient';

type PageProps = {
    searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: PageProps) {
    const { token } = await searchParams;
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    const isLoggedIn = !!session.isLoggedIn && !!session.userId;

    if (!token && !isLoggedIn) {
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

    return <ResetPasswordClient token={token ?? null} isLoggedIn={isLoggedIn} />;
}