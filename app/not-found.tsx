import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="min-h-screen bg-[#eef5fb] text-[#17314d]">
            <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl items-center justify-center px-6 py-12 sm:px-10">
                <div className="w-full rounded-3xl border border-[#d5e2ee] bg-white p-8 text-center shadow-[0_20px_40px_rgba(10,50,90,0.08)] sm:p-12">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f75bd]">404</p>
                    <h1 className="mt-4 text-3xl font-bold text-[#10253d] sm:text-4xl">Page not found</h1>
                    <p className="mt-4 text-base leading-7 text-[#587796]">
                        The page you are trying to access does not exist or may have been moved.
                    </p>
                    <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                        <Link
                            href="/"
                            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0f82ca] px-5 text-sm font-semibold text-white transition hover:bg-[#0b70b0]"
                        >
                            Go to Home
                        </Link>
                        <Link
                            href="/login"
                            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#c8d7e5] bg-white px-5 text-sm font-semibold text-[#1a2f4c] transition hover:bg-[#f5f9fd]"
                        >
                            Go to Login
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
