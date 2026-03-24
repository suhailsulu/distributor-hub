import Link from 'next/link';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, type SessionData } from '../lib/session';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    //check if session extists and is valid, if not redirect to login page
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn || !session.userId) {
        //redirect to logi with return url
        redirect(`/login?returnUrl=${encodeURIComponent('/dashboard')}`);
    }


    return (
        <main className="min-h-screen bg-[#eef5fb] text-[#17314d]">
            <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-12 sm:px-10 lg:px-16">
                <div className="rounded-3xl border border-[#d5e2ee] bg-white p-8 shadow-[0_20px_40px_rgba(10,50,90,0.08)]">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0f75bd]">Dashboard</p>
                    <h1 className="mt-4 text-3xl font-bold text-[#10253d]">Distributor assets workspace</h1>
                    <p className="mt-4 max-w-3xl text-base leading-7 text-[#587796]">
                        This is the dashboard area for managing and accessing distributor-specific assets such as documents,
                        links, training resources, and other approved materials.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <Link
                            href="/"
                            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0f82ca] px-5 text-sm font-semibold text-white transition hover:bg-[#0b70b0]"
                        >
                            Back to Home
                        </Link>
                        <Link
                            href="/reset-password"
                            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#c8d7e5] bg-white px-5 text-sm font-semibold text-[#1a2f4c] transition hover:bg-[#f5f9fd]"
                        >
                            Reset Password
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
