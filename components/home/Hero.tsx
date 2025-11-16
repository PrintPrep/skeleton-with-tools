// components/home/Hero.tsx

import Link from "next/link";

export function Hero() {
    return (
        <section className="relative px-6 md:px-12 lg:px-24 py-24 text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900">
                Prepare Print-Ready PDFs in{" "}
                <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                    Minutes
                </span>
            </h1>

            <p className="mt-6 text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
                PrintPrep is a browser-based toolkit for booklet imposition, ticket numbering,
                PDF manipulation, and sticker layouts — built for creators, schools, and print shops.
            </p>

            <div className="mt-10">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-2xl hover:shadow-cyan-500/50 hover:scale-105"
                >
                    Go to Dashboard
                    <span className="ml-2">→</span>
                </Link>
            </div>

            {/* Mock image placeholder */}
            <div className="mt-16 flex justify-center">
                <div className="w-full max-w-4xl h-80 bg-white rounded-3xl border-2 border-slate-200 shadow-2xl flex items-center justify-center text-slate-400 font-semibold text-lg overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 opacity-50"></div>
                    <span className="relative z-10">🎨 Screenshot / Tool Mockups Here</span>
                </div>
            </div>
        </section>
    );
}