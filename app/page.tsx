import Link from 'next/link';
import Topbar from './components/Layout/topbar';
import { Toast } from './components/utilities/Toast';
import ToastTest from './components/utilities/toast-test';

const featureCards = [
  {
    title: 'Distributor-specific assets',
    description:
      'Share tailored documents, links, product resources, and campaign materials with each connected distributor company.',
  },
  {
    title: 'Controlled access',
    description:
      'Every partner company gets access only to the assets relevant to their relationship, market, and approved use case.',
  },
  {
    title: 'Centralized distribution',
    description:
      'Manage business-critical assets from one platform instead of sending files manually across email threads and spreadsheets.',
  },
];

export default function Home() {

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#eef5fb] text-[#17314d]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-[#6ab6eb]/30 blur-3xl" />
        <div className="absolute right-[-6rem] top-24 h-80 w-80 rounded-full bg-[#0f82ca]/15 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/3 h-72 w-72 rounded-full bg-[#1a2f4c]/10 blur-3xl" />
      </div>
      <Topbar></Topbar>
      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="grid w-full gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-[#a6c9e6] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#0f75bd] shadow-sm">
              Distributor Hub
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight text-[#10253d] sm:text-5xl lg:text-6xl">
              A secure asset-sharing platform for distributor networks in a large pharma ecosystem.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#466a91] sm:text-xl">
              Distributor Hub helps a large pharmaceutical company share documents, links, and other business
              assets with the distributor companies connected to it. Each distributor can have a different set
              of approved resources based on its role, access level, and business needs.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0f82ca] px-6 text-sm font-semibold text-white transition hover:bg-[#0b70b0]"
              >
                Go to Login
              </Link>
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-[#b8cade] bg-white px-6 text-sm font-semibold text-[#1a2f4c] transition hover:bg-[#f3f8fd]"
              >
                Request Access
              </Link>
              <div>
                <ToastTest></ToastTest>
              </div>
             
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {featureCards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-2xl border border-white/70 bg-white/75 p-5 shadow-[0_16px_30px_rgba(18,56,92,0.08)] backdrop-blur"
                >
                  <h2 className="text-base font-semibold text-[#17314d]">{card.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#5b7899]">{card.description}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-[#d3e0ec] bg-[#10253d] p-7 text-white shadow-[0_24px_50px_rgba(16,37,61,0.22)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#85c9f3]">How It Works</p>
            <div className="mt-6 space-y-5">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-[#9ed8fb]">01</p>
                <h3 className="mt-2 text-lg font-semibold">Central company manages assets</h3>
                <p className="mt-2 text-sm leading-6 text-[#c6d8e9]">
                  Corporate teams upload and organize documents, commercial links, training material, and
                  reference assets in one place.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-[#9ed8fb]">02</p>
                <h3 className="mt-2 text-lg font-semibold">Access is assigned per distributor</h3>
                <p className="mt-2 text-sm leading-6 text-[#c6d8e9]">
                  Different distributor companies can receive different collections of assets depending on
                  geography, product scope, or partnership status.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-[#9ed8fb]">03</p>
                <h3 className="mt-2 text-lg font-semibold">Partners access the right resources faster</h3>
                <p className="mt-2 text-sm leading-6 text-[#c6d8e9]">
                  Approved users sign in and retrieve the exact assets they need without waiting for manual
                  sharing or repeated email requests.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
