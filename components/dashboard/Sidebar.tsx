// components/dashboard/Sidebar.tsx

export function Sidebar() {
    return (
        <>
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
        </>
    );
}