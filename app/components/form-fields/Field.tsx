export function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <span className="block text-sm font-semibold text-[#273f5e]">{label}</span>
            {children}
            {error ? <p className="text-xs text-red-600">{error}</p> : null}
        </div>
    );
}
