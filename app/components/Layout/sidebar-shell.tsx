'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type UserRole = 'user' | 'admin';
type IconName =
    | 'home'
    | 'folder'
    | 'search'
    | 'settings'
    | 'link'
    | 'distributors'
    | 'users'
    | 'feedback'
    | 'menu'
    | 'chevronLeft';

type NavItem = {
    label: string;
    href?: string;
    icon: IconName;
    disabled?: boolean;
    match?: string[];
};

type NavSection = {
    title: string;
    items: NavItem[];
};

const userSections: NavSection[] = [
    {
        title: 'User View',
        items: [
            { label: 'Dashboard', href: '/dashboard', icon: 'home', match: ['/dashboard'] },
            { label: 'Browse Assets', icon: 'folder', href: '/browse', match: ['/browse'] },
            { label: 'Search', icon: 'search', href: '/search', match: ['/search'] },
        ],
    },
];

const adminSections: NavSection[] = [
    {
        title: 'Administration',
        items: [
            { label: 'Admin Dashboard', icon: 'settings', href: '/admin', match: ['/admin'] },
            { label: 'Manage Folders', icon: 'folder', href: '/admin/folders', match: ['/admin/folders', '/admin/folders/*'] },
            { label: 'Link Assets', icon: 'link', href: '/admin/link-assets', match: ['/admin/link-assets'] },
            { label: 'Manage Distributors', icon: 'distributors', href: '/admin/distributors', match: ['/admin/distributors'] },
            { label: 'Manage Users', icon: 'users', href: '/admin/users', match: ['/admin/users'] },
            { label: 'Feedback Center', icon: 'feedback', href: '/admin/feedback', match: ['/admin/feedback'] },
        ],
    },
];

function iconPath(name: IconName) {
    switch (name) {
        case 'home':
            return <path d="M3.75 10.5 12 3.75l8.25 6.75v8.25a1.5 1.5 0 0 1-1.5 1.5h-4.5v-6h-4.5v6h-4.5a1.5 1.5 0 0 1-1.5-1.5Z" />;
        case 'folder':
            return <path d="M3.75 7.5A1.5 1.5 0 0 1 5.25 6h4.125l1.5 1.5h7.875A1.5 1.5 0 0 1 20.25 9v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5Z" />;
        case 'search':
            return <path d="M10.5 4.5a6 6 0 1 0 3.778 10.661l4.28 4.28 1.061-1.061-4.28-4.28A6 6 0 0 0 10.5 4.5Z" />;
        case 'settings':
            return <path d="m9.665 4.49.554-1.74h2.562l.554 1.74a7.714 7.714 0 0 1 1.635.95l1.666-.8 1.812 1.81-.8 1.667c.37.51.69 1.06.95 1.635l1.74.554v2.562l-1.74.554a7.71 7.71 0 0 1-.95 1.635l.8 1.666-1.81 1.812-1.667-.8a7.712 7.712 0 0 1-1.635.95l-.554 1.74h-2.562l-.554-1.74a7.71 7.71 0 0 1-1.635-.95l-1.666.8-1.812-1.81.8-1.667a7.714 7.714 0 0 1-.95-1.635l-1.74-.554v-2.562l1.74-.554a7.714 7.714 0 0 1 .95-1.635l-.8-1.666 1.81-1.812 1.667.8a7.712 7.712 0 0 1 1.635-.95ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />;
        case 'link':
            return <path d="M9.75 14.25 14.25 9.75M8.25 16.5H6.75a3.75 3.75 0 0 1 0-7.5h3M15.75 7.5h1.5a3.75 3.75 0 0 1 0 7.5h-3" />;
        case 'distributors':
            return <path d="M8.25 10.5a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM15.75 12a1.875 1.875 0 1 0 0-3.75 1.875 1.875 0 0 0 0 3.75ZM3.75 18a4.5 4.5 0 0 1 9 0v.75h-9Zm8.25.75a3.75 3.75 0 0 1 7.5 0Z" />;
        case 'users':
            return <path d="M12 11.25a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5ZM4.5 19.5a7.5 7.5 0 0 1 15 0Z" />;
        case 'feedback':
            return <path d="M6.75 18.75h6.375l4.125 2.25V5.25a1.5 1.5 0 0 0-1.5-1.5H6.75a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3Z" />;
        case 'menu':
            return <path d="M4.5 7.5h15M4.5 12h15M4.5 16.5h15" />;
        case 'chevronLeft':
            return <path d="m14.25 6.75-5.25 5.25 5.25 5.25" />;
        default:
            return null;
    }
}

function SidebarIcon({ name, className = 'h-5 w-5' }: { name: IconName; className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            {iconPath(name)}
        </svg>
    );
}

function isItemActive(pathname: string, item: NavItem) {
    if (!item.href) {
        return false;
    }

    if (pathname === item.href) {
        return true;
    }

    return item.match?.some((value) => pathname.startsWith(value)) || false;
}

function DesktopNav({ pathname, email, role }: { pathname: string; email: string; role: UserRole }) {
    const sections = role === 'admin' ? [...userSections, ...adminSections] : userSections;

    return (
        <aside className="hidden h-[calc(100vh)] w-[17.5rem] shrink-0 border-r border-[#d7e4ef] bg-[#f7fbff] lg:sticky lg:flex lg:flex-col lg:top-0">
            <div className="flex items-center h-16 px-4 py-4">
                <span className="text-lg font-bold text-[#0f75bd]">Distributor Hub</span>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto px-4 py-5">
                <div className="mt-6 space-y-6">
                    {sections.map((section) => (
                        <div key={section.title}>
                            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f93aa]">
                                {section.title}
                            </p>
                            <div className="mt-3 space-y-1.5">
                                {section.items.map((item) => {
                                    const active = isItemActive(pathname, item);
                                    const className = `group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${active
                                        ? 'bg-[#dfeeff] text-[#0f75bd] shadow-[0_10px_22px_rgba(15,117,189,0.13)]'
                                        : 'text-[#4f6882] hover:bg-[#ecf4fb] hover:text-[#17314d]'
                                        } ${item.disabled ? 'cursor-default opacity-75' : ''}`;

                                    const content = (
                                        <>
                                            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? 'bg-white text-[#0f75bd]' : 'bg-[#f2f7fb] text-[#6d8198] group-hover:bg-white group-hover:text-[#17314d]'}`}>
                                                <SidebarIcon name={item.icon} />
                                            </span>
                                            <span>{item.label}</span>
                                        </>
                                    );

                                    if (item.disabled || !item.href) {
                                        return (
                                            <span key={item.label} className={className} aria-disabled="true">
                                                {content}
                                            </span>
                                        );
                                    }

                                    return (
                                        <Link key={item.label} href={item.href} className={className}>
                                            {content}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-[#d7e4ef] px-4 py-4">
                <div className="rounded-[1.25rem] bg-[#e9f2fa] px-4 py-3">
                    <p className="text-sm font-semibold text-[#17314d]">{email}</p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-[#5b7899]">{role}</p>
                </div>
            </div>
        </aside>
    );
}

function MobileRail({ pathname, onOpen, role }: { pathname: string; onOpen: () => void; role: UserRole }) {
    const sections = role === 'admin' ? [...userSections, ...adminSections] : userSections;

    return (
        <>
            <div className="w-20 shrink-0 lg:hidden" aria-hidden="true" />
            <aside className="fixed left-0 z-30 flex w-20 flex-col border-r border-[#d7e4ef] bg-[#f7fbff]/96 px-3 py-4 backdrop-blur lg:hidden h-[calc(100vh)]">
                <button
                    type="button"
                    onClick={onOpen}
                    className="flex h-12 w-12 items-center justify-center self-center rounded-2xl border border-[#d8e7f4] bg-white text-[#17314d] shadow-[0_12px_24px_rgba(16,37,61,0.08)] transition hover:border-[#bfd6e8] hover:text-[#0f75bd]"
                    aria-label="Expand sidebar"
                >
                    <SidebarIcon name="menu" className="h-5 w-5" />
                </button>

                <div className="mt-6 flex flex-1 flex-col items-center gap-2 overflow-y-auto pb-4">
                    {sections.flatMap((section) => section.items).map((item) => {
                        const active = isItemActive(pathname, item);
                        const className = `flex h-12 w-12 items-center justify-center rounded-2xl transition ${active
                            ? 'bg-[#dfeeff] text-[#0f75bd] shadow-[0_10px_20px_rgba(15,117,189,0.14)]'
                            : 'text-[#6b8198] hover:bg-[#ecf4fb] hover:text-[#17314d]'
                            } ${item.disabled ? 'cursor-default opacity-75' : ''}`;

                        if (item.disabled || !item.href) {
                            return (
                                <span key={item.label} className={className} title={item.label} aria-label={item.label}>
                                    <SidebarIcon name={item.icon} />
                                </span>
                            );
                        }

                        return (
                            <Link key={item.label} href={item.href} className={className} title={item.label} aria-label={item.label}>
                                <SidebarIcon name={item.icon} />
                            </Link>
                        );
                    })}
                </div>
            </aside>
        </>
    );
}

function MobileDrawer({ email, onClose, pathname, role }: { email: string; onClose: () => void; pathname: string; role: UserRole }) {
    const sections = role === 'admin' ? [...userSections, ...adminSections] : userSections;

    return (
        <>
            <button
                type="button"
                aria-label="Close sidebar"
                className="fixed inset-0 top-16 z-40 bg-[#10253d]/32 backdrop-blur-[2px] lg:hidden"
                onClick={onClose}
            />
            <aside className="fixed h-[calc(100vh)] left-0 z-50 flex w-[17.5rem] flex-col border-r border-[#d7e4ef] bg-[#f7fbff] shadow-[0_24px_60px_rgba(16,37,61,0.18)] lg:hidden">
                <div className="flex items-center justify-between border-b border-[#d7e4ef] px-4 py-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#79add3]">Navigation</p>
                        <p className="mt-1 text-base font-semibold text-[#17314d]">Distributor Hub</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#d8e7f4] bg-white text-[#17314d]"
                        aria-label="Collapse sidebar"
                    >
                        <SidebarIcon name="chevronLeft" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-5">
                    <div className="space-y-6">
                        {sections.map((section) => (
                            <div key={section.title}>
                                <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f93aa]">
                                    {section.title}
                                </p>
                                <div className="mt-3 space-y-1.5">
                                    {section.items.map((item) => {
                                        const active = isItemActive(pathname, item);
                                        const className = `group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${active
                                            ? 'bg-[#dfeeff] text-[#0f75bd] shadow-[0_10px_22px_rgba(15,117,189,0.13)]'
                                            : 'text-[#4f6882] hover:bg-[#ecf4fb] hover:text-[#17314d]'
                                            } ${item.disabled ? 'cursor-default opacity-75' : ''}`;

                                        const content = (
                                            <>
                                                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? 'bg-white text-[#0f75bd]' : 'bg-[#f2f7fb] text-[#6d8198] group-hover:bg-white group-hover:text-[#17314d]'}`}>
                                                    <SidebarIcon name={item.icon} />
                                                </span>
                                                <span>{item.label}</span>
                                            </>
                                        );

                                        if (item.disabled || !item.href) {
                                            return (
                                                <span key={item.label} className={className} aria-disabled="true">
                                                    {content}
                                                </span>
                                            );
                                        }

                                        return (
                                            <Link key={item.label} href={item.href} className={className} onClick={onClose}>
                                                {content}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-[#d7e4ef] px-4 py-4">
                    <div className="rounded-[1.25rem] bg-[#e9f2fa] px-4 py-3">
                        <p className="text-sm font-semibold text-[#17314d]">{email}</p>
                        <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-[#5b7899]">{role}</p>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default function SidebarShell({ email, role }: { email: string; role: UserRole }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    return (
        <>
            <MobileRail pathname={pathname} onOpen={() => setIsOpen(true)} role={role} />
            <DesktopNav pathname={pathname} email={email} role={role} />
            {isOpen ? <MobileDrawer email={email} onClose={() => setIsOpen(false)} pathname={pathname} role={role} /> : null}
        </>
    );
}