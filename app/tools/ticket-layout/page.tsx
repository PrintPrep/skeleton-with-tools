// app/tools/ticket-layout/page.tsx

import Link from "next/link";

export default function HomePage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#E0F7F4] to-gray-100 px-6 relative overflow-hidden">

            {/* Decorative blur blobs */}
            <div className="absolute -top-12 -left-12 w-80 h-80 rounded-full bg-[#00BFA6]/20 filter blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-96 h-96 rounded-full bg-[#00BFA6]/10 filter blur-3xl pointer-events-none" />

            <section className="text-center max-w-5xl z-10">
                <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl font-semibold text-gray-800 mb-8 leading-tight">
                    Design Stunning <span className="text-[#00BFA6]">Tickets</span> & Cards 🎨
                </h1>

                <p className="text-gray-600 text-xl sm:text-2xl md:text-3xl mb-14 leading-relaxed max-w-3xl mx-auto">
                    Create, customize, and export printable designs effortlessly — a Canva-style experience made just for ticket creators.
                </p>

                <Link href="/tools/ticket-layout/wizard" className="relative group inline-block select-none" aria-label="Start designing">
                    {/* Outer glowing aura */}
                    <div className="absolute -left-10 -right-10 -top-5 -bottom-5 rounded-full bg-gradient-to-r from-[#00BFA6]/40 to-[#00D1B2]/40 filter blur-3xl opacity-70 group-hover:opacity-90 transition-all duration-500" aria-hidden="true" />

                    {/* Button body */}
                    <span className="relative inline-flex justify-center items-center min-w-[320px] sm:min-w-[360px] md:min-w-[420px] bg-[#00BFA6] text-white font-heading text-2xl sm:text-3xl px-12 py-5 rounded-lg shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 group-active:scale-95 group-hover:bg-[#00D1B2] group-hover:shadow-xl">
                        Start Designing →
                    </span>
                </Link>

                <p className="mt-10 text-base sm:text-lg text-gray-500">
                    No accounts. No clutter. Just creativity unleashed.
                </p>
            </section>
        </main>
    );
}
