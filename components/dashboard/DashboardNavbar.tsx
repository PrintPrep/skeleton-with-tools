// components/dashboard/DashboardNavbar.tsx

import Link from "next/link";

export function DashboardNavbar() {
    return (
        <header className="flex items-center justify-between relative z-10 mb-8">
            <div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
                <p className="mt-3 text-slate-600 text-lg font-medium">
                    Welcome to PrintPrep. Choose a tool to get started.
                </p>
            </div>

            <Link
                href="/"
                className="inline-flex items-center px-4 py-2 text-sm text-slate-600 hover:text-slate-900 font-semibold rounded-xl hover:bg-white/70 backdrop-blur-sm transition-all"
            >
                ← Back to Home
            </Link>
        </header>
    );
}