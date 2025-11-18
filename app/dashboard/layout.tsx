import Link from "next/link";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E0F7F4] to-gray-100 text-gray-800">
            {/* ===== DASHBOARD NAVBAR ===== */}

            {/* ===== MAIN CONTENT WRAPPER ===== */}
            <main className="px-6 md:px-12 lg:px-24 py-12 relative z-10">{children}</main>
        </div>
    );
}
