// components/home/HomeNavbar.tsx

import Link from "next/link";

export function HomeNavbar() {
    return (
        <nav className="relative z-20 px-6 md:px-12 lg:px-24 py-6 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0">
            <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <span className="text-white text-xl font-bold">P</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">PrintPrep</span>
                </Link>

                <div className="flex items-center space-x-8">
                    <Link
                        href="/tools"
                        className="text-slate-600 hover:text-slate-900 font-semibold transition-colors"
                    >
                        Tools
                    </Link>
                    <Link
                        href="/pricing"
                        className="text-slate-600 hover:text-slate-900 font-semibold transition-colors"
                    >
                        Pricing
                    </Link>
                    <Link
                        href="/contact"
                        className="text-slate-600 hover:text-slate-900 font-semibold transition-colors"
                    >
                        Contact
                    </Link>
                    <Link
                        href="/dashboard"
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        Dashboard
                    </Link>
                </div>
            </div>
        </nav>
    );
}