import Link from "next/link";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E0F7F4] to-gray-100 text-gray-800">
            {/* ===== DASHBOARD NAVBAR ===== */}

            {/* ===== MAIN CONTENT WRAPPER ===== */}
            <main>{children}</main>
        </div>
    );
}
