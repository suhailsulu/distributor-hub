import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, type SessionData } from '@/app/lib/session';
import TopbarLinks from './topbar-links';

export default async function Topbar() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    const isLoggedIn = !!session.isLoggedIn && !!session.userId;
    const email = session.email || 'User';
    if (!isLoggedIn) return null;
    return (
        <div className="w-full border-b border-gray-200" >
            <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <span className="text-lg font-bold text-[#0f75bd]">Distributor Hub</span>
                </div>
                <div className="flex items-center gap-4">

                    <span className="text-sm text-[#1a2f4c]">Welcome, {email}</span>
                    <div className="relative">


                        <TopbarLinks></TopbarLinks>

                    </div>
                </div>
            </div>
        </div>
    );
}