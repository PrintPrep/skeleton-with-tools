import Link from "next/link";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E0F7F4] to-gray-100 text-gray-800">
            {/* ===== DASHBOARD NAVBAR ===== */}
            <nav className="w-full border-b bg-[#E0F7F4]/80 backdrop-blur px-6 md:px-12 lg:px-24 py-4 flex items-center justify-between">
                <Link href="/dashboard" className="text-xl font-bold">
                    PrintPrev
                </Link>

                <div className="flex items-center gap-6 text-sm">
                    <Link
                        href="/dashboard"
                        className="hover:text-blue-600 transition"
                    >
                        Dashboard
                    </Link>

                    <Link
                        href="/tools"
                        className="hover:text-blue-600 transition"
                    >
                        Tools
                    </Link>

                    <Link
                        href="/"
                        className="hover:text-blue-600 transition"
                    >
                        Home
                    </Link>
                </div>
            </nav>

            {/* ===== MAIN CONTENT WRAPPER ===== */}
            <main className="px-6 md:px-12 lg:px-24 py-12 relative z-10">{children}</main>
        </div>
    );
}
