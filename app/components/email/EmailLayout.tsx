import type { ReactNode } from "react";

interface EmailLayoutProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
}

export function EmailLayout({ title, subtitle, children }: EmailLayoutProps) {
    return (
        <div>
            <header>
                <h1>{title}</h1>
                {subtitle ? <p>{subtitle}</p> : null}
                <hr />
            </header>

            <main>{children}</main>

            <footer>
                <hr />
                <p>Copyright 2026 Distributor Hub. All rights reserved.</p>
                <p>This is an automated message. Please do not reply to this email.</p>
            </footer>
        </div>
    );
}