import type { ManagedUser } from '@/app/lib/usermanagement';

type NewUsersProps = {
    users: ManagedUser[];
};

export default function NewUsers({ users }: NewUsersProps) {
    return (
        <section className="flex min-h-0 flex-1 flex-col">
            <div className="shrink-0">
                <h2 className="text-lg font-semibold text-[#10253d]">New Users</h2>
                <p className="mt-1 text-sm text-[#587796]">Users awaiting verification or admin approval.</p>
            </div>

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto rounded-xl border border-[#d5e2ee] bg-white">
                {users.length === 0 ? (
                    <p className="p-4 text-sm text-[#587796]">No new users.</p>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 z-10 border-b border-[#d5e2ee] bg-white">
                            <tr>
                                <th className="px-4 py-3 font-semibold text-[#10253d]">Name</th>
                                <th className="px-4 py-3 font-semibold text-[#10253d]">Email</th>
                                <th className="px-4 py-3 font-semibold text-[#10253d]">Status</th>
                                <th className="px-4 py-3 font-semibold text-[#10253d]">Company</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#d5e2ee]">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-4 py-3 font-medium text-[#10253d]">{user.full_name}</td>
                                    <td className="px-4 py-3 text-[#587796]">{user.work_email}</td>
                                    <td className="px-4 py-3 capitalize text-[#587796]">{user.user_status}</td>
                                    <td className="px-4 py-3 text-[#587796]">{user.company_name ?? '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </section>
    );
}
