// app/page.tsx

import Link from "next/link";
import { HomeNavbar } from "@/components/home/HomeNavbar";
import { Hero } from "@/components/home/Hero";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 text-slate-800">
            {/* Decorative background elements */}
            <div className="fixed top-20 left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob pointer-events-none"></div>
            <div className="fixed top-40 right-10 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>
            <div className="fixed bottom-20 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 pointer-events-none"></div>

            <HomeNavbar />
            <Hero />

            {/* ===== TOOLS OVERVIEW ===== */}
            <section className="relative px-6 md:px-12 lg:px-24 py-24 bg-white/80 backdrop-blur-sm">
                <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900">Tools</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                    {[
                        {
                            title: "PDF Toolkit",
                            desc: "Split, merge, and organize PDFs easily.",
                            link: "/tools/pdf-toolkit",
                            icon: "📄",
                            color: "from-cyan-500 to-blue-500"
                        },
                        {
                            title: "Booklet Imposition",
                            desc: "Create print-ready booklets instantly.",
                            link: "/tools/booklet-imposition",
                            icon: "📖",
                            color: "from-blue-500 to-indigo-500"
                        },
                        {
                            title: "Ticket Layout + Numbering",
                            desc: "Generate grids with sequential numbering.",
                            link: "/tools/ticket-layout",
                            icon: "🎫",
                            color: "from-purple-500 to-pink-500"
                        },
                        {
                            title: "Sticker Pack",
                            desc: "Arrange sticker sheets for printing.",
                            link: "/tools/sticker-pack",
                            icon: "✨",
                            color: "from-pink-500 to-red-500"
                        },
                    ].map((tool) => (
                        <div
                            key={tool.title}
                            className="group p-8 bg-white rounded-3xl border-2 border-slate-200 hover:border-cyan-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                        >
                            <div className={`w-full h-32 bg-gradient-to-br ${tool.color} rounded-2xl mb-5 flex items-center justify-center text-5xl shadow-lg group-hover:scale-110 transition-transform`}>
                                {tool.icon}
                            </div>

                            <h3 className="text-xl font-bold text-slate-900">{tool.title}</h3>
                            <p className="text-slate-600 mt-2 leading-relaxed">{tool.desc}</p>

                            <Link
                                href={tool.link}
                                className="mt-5 inline-flex items-center text-cyan-600 hover:text-cyan-700 font-bold group-hover:translate-x-1 transition-transform"
                            >
                                Try Tool →
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== VALUE PROPS ===== */}
            <section className="relative px-6 md:px-12 lg:px-24 py-24">
                <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900">Why PrintPrep?</h2>

                <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {[
                        { emoji: "✨", text: "Works directly in the browser — no installation" },
                        { emoji: "🎨", text: "Made for creators, schools, event teams, and print shops" },
                        { emoji: "📄", text: "Accurate print-ready PDF output" },
                        { emoji: "⚡", text: "Saves hours of prepress time" }
                    ].map((item, i) => (
                        <li key={i} className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-slate-100 hover:-translate-y-1">
                            <span className="text-4xl flex-shrink-0">{item.emoji}</span>
                            <span className="text-lg text-slate-700 font-medium pt-2">{item.text}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* ===== FEATURES ===== */}
            <section className="relative px-6 md:px-12 lg:px-24 py-24 bg-white/80 backdrop-blur-sm">
                <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900">
                    Powerful Features
                </h2>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
                    {[
                        "Sequential numbering",
                        "Drag-and-drop PDFs",
                        "Automatic crops, bleed & imposition presets",
                        "Fast previews (coming soon)"
                    ].map((feature, i) => (
                        <div key={i} className="flex items-center space-x-4 p-5 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border-2 border-cyan-200 hover:shadow-lg transition-all">
                            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
                                ✓
                            </div>
                            <span className="text-slate-700 font-semibold">{feature}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== PRICING ===== */}
            <section className="relative px-6 md:px-12 lg:px-24 py-24">
                <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900">Pricing</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
                    <div className="p-8 rounded-3xl border-2 border-slate-200 bg-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-5 shadow-lg">
                            🆓
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">Free Tier</h3>
                        <p className="text-slate-600 mt-3 font-medium">Basic tools — Coming soon</p>
                    </div>

                    <div className="p-8 rounded-3xl border-2 border-cyan-400 bg-gradient-to-br from-cyan-50 to-blue-50 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl shadow-lg">
                            POPULAR
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-5 shadow-lg">
                            ⭐
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">Pro Tier</h3>
                        <p className="text-slate-600 mt-3 font-medium">Advanced features — Coming soon</p>
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <section className="relative px-6 md:px-12 lg:px-24 py-24 bg-white/80 backdrop-blur-sm">
                <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900">Testimonials</h2>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { color: "from-cyan-500 to-blue-500", initial: "A" },
                        { color: "from-purple-500 to-pink-500", initial: "B" },
                        { color: "from-blue-500 to-indigo-500", initial: "C" }
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="p-8 bg-white rounded-3xl border-2 border-slate-200 text-slate-700 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
                        >
                            <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white font-bold text-lg mb-4 shadow-lg`}>
                                {item.initial}
                            </div>
                            <p className="font-medium leading-relaxed italic">
                                "This tool saved me hours!"
                            </p>
                            <p className="text-slate-500 text-sm mt-3 font-semibold">— User {i + 1}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="relative px-6 md:px-12 lg:px-24 py-12 border-t-2 border-slate-200 bg-white text-slate-600">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="font-semibold">© {new Date().getFullYear()} PrintPrep. All rights reserved.</p>

                    <ul className="flex gap-8 mt-4 md:mt-0">
                        <li>
                            <Link href="/dashboard" className="hover:text-cyan-600 transition-colors font-semibold">
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link href="/tools" className="hover:text-cyan-600 transition-colors font-semibold">
                                Tools
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="hover:text-cyan-600 transition-colors font-semibold">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>
            </footer>
        </main>
    );
}