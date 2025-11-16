// app/dashboard/page.tsx

import Link from "next/link";

export default function DashboardPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 text-slate-800 px-6 md:px-12 lg:px-24 py-16 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="fixed top-20 left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob pointer-events-none"></div>
            <div className="fixed bottom-20 right-10 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>

            {/* ===== HEADER ===== */}
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

            {/* ===== TOOL GRID ===== */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 relative z-10">
                {[
                    {
                        title: "PDF Toolkit",
                        desc: "Split, merge & organize PDFs.",
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
                        title: "Sticker Pack Tool",
                        desc: "Arrange stickers for print sheets.",
                        link: "/tools/sticker-pack",
                        icon: "✨",
                        color: "from-pink-500 to-red-500"
                    },
                ].map((tool) => (
                    <Link
                        key={tool.title}
                        href={tool.link}
                        className="group p-8 bg-white rounded-3xl border-2 border-slate-200 hover:border-cyan-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
                    >
                        {/* Icon area with gradient background */}
                        <div className={`w-full h-32 bg-gradient-to-br ${tool.color} rounded-2xl mb-5 flex items-center justify-center text-5xl shadow-lg group-hover:scale-110 transition-transform`}>
                            {tool.icon}
                        </div>

                        <h3 className="text-xl font-bold text-slate-900">{tool.title}</h3>
                        <p className="text-slate-600 text-sm mt-2 flex-grow leading-relaxed">{tool.desc}</p>

                        <span className="mt-5 inline-flex items-center text-cyan-600 hover:text-cyan-700 font-bold text-sm group-hover:translate-x-1 transition-transform">
                            Open →
                        </span>
                    </Link>
                ))}
            </section>

            {/* ===== QUICK STATS / INFO SECTION ===== */}
            <section className="mt-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-slate-200 hover:shadow-xl transition-all">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                                🚀
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">Status</p>
                                <p className="text-xl font-bold text-slate-900">All Systems Go</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-slate-200 hover:shadow-xl transition-all">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                                🎨
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">Tools Available</p>
                                <p className="text-xl font-bold text-slate-900">4 Tools</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-slate-200 hover:shadow-xl transition-all">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                                ⚡
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">Performance</p>
                                <p className="text-xl font-bold text-slate-900">Lightning Fast</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== TIPS SECTION ===== */}
            <section className="mt-16 relative z-10">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-3xl p-8 shadow-xl">
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg flex-shrink-0">
                            💡
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-blue-900 mb-3">Pro Tip</h3>
                            <p className="text-blue-700 leading-relaxed">
                                Start with the <span className="font-bold">PDF Toolkit</span> to prepare your documents,
                                then move to specialized tools like Booklet Imposition or Ticket Numbering for
                                professional print-ready results.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}