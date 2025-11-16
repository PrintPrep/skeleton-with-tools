// app/page.tsx

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-white text-gray-800">
            {/* ===== HERO SECTION ===== */}
            <section className="px-6 md:px-12 lg:px-24 py-20 text-center">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                    Prepare Print-Ready PDFs in Minutes
                </h1>

                <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                    PrintPrep is a browser-based toolkit for booklet imposition, ticket numbering,
                    PDF manipulation, and sticker layouts — built for creators, schools, and print shops.
                </p>

                <div className="mt-8">
                    <Link
                        href="/dashboard"
                        className="px-6 py-3 rounded-xl bg-black text-white font-medium hover:bg-gray-900 transition"
                    >
                        Go to Dashboard
                    </Link>
                </div>

                {/* Mock image placeholder */}
                <div className="mt-12 flex justify-center">
                    <div className="w-full max-w-3xl h-64 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400">
                        Screenshot / Tool Mockups Here
                    </div>
                </div>
            </section>

            {/* ===== TOOLS OVERVIEW ===== */}
            <section className="px-6 md:px-12 lg:px-24 py-20 bg-gray-50">
                <h2 className="text-3xl md:text-4xl font-bold text-center">Tools</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                    {[
                        {
                            title: "PDF Toolkit",
                            desc: "Split, merge, and organize PDFs easily.",
                            link: "/tools/pdf-toolkit",
                        },
                        {
                            title: "Booklet Imposition",
                            desc: "Create print-ready booklets instantly.",
                            link: "/tools/booklet",
                        },
                        {
                            title: "Ticket Layout + Numbering",
                            desc: "Generate grids with sequential numbering.",
                            link: "/tools/tickets",
                        },
                        {
                            title: "Sticker Pack",
                            desc: "Arrange sticker sheets for printing.",
                            link: "/tools/stickers",
                        },
                    ].map((tool) => (
                        <div
                            key={tool.title}
                            className="p-6 bg-white rounded-xl border hover:shadow-md transition"
                        >
                            <div className="w-full h-28 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400">
                                Icon / Image
                            </div>

                            <h3 className="text-lg font-semibold">{tool.title}</h3>
                            <p className="text-gray-600 mt-1">{tool.desc}</p>

                            <Link
                                href={tool.link}
                                className="mt-4 inline-block text-blue-600 hover:underline"
                            >
                                Try Tool →
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== VALUE PROPS ===== */}
            <section className="px-6 md:px-12 lg:px-24 py-20">
                <h2 className="text-3xl md:text-4xl font-bold text-center">Why PrintPrep?</h2>

                <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-lg">
                    <li>✨ Works directly in the browser — no installation</li>
                    <li>🎨 Made for creators, schools, event teams, and print shops</li>
                    <li>📄 Accurate print-ready PDF output</li>
                    <li>⚡ Saves hours of prepress time</li>
                </ul>
            </section>

            {/* ===== FEATURES ===== */}
            <section className="px-6 md:px-12 lg:px-24 py-20 bg-gray-50">
                <h2 className="text-3xl md:text-4xl font-bold text-center">
                    Powerful Features
                </h2>

                <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-gray-700">
                    <li>• Sequential numbering</li>
                    <li>• Drag-and-drop PDFs</li>
                    <li>• Automatic crops, bleed & imposition presets</li>
                    <li>• Fast previews (coming soon)</li>
                </ul>
            </section>

            {/* ===== PRICING ===== */}
            <section className="px-6 md:px-12 lg:px-24 py-20">
                <h2 className="text-3xl md:text-4xl font-bold text-center">Pricing</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
                    <div className="p-6 rounded-xl border bg-white">
                        <h3 className="text-xl font-semibold">Free Tier</h3>
                        <p className="text-gray-600 mt-2">Basic tools — Coming soon</p>
                    </div>

                    <div className="p-6 rounded-xl border bg-white">
                        <h3 className="text-xl font-semibold">Pro Tier</h3>
                        <p className="text-gray-600 mt-2">Advanced features — Coming soon</p>
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <section className="px-6 md:px-12 lg:px-24 py-20 bg-gray-50">
                <h2 className="text-3xl md:text-4xl font-bold text-center">Testimonials</h2>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="p-6 bg-white rounded-xl border text-gray-600"
                        >
                            <p>“This tool saved me hours!” — User {i}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="px-6 md:px-12 lg:px-24 py-12 border-t bg-white text-gray-600">
                <div className="flex flex-col md:flex-row justify-between">
                    <p>© {new Date().getFullYear()} PrintPrep</p>

                    <ul className="flex gap-6 mt-4 md:mt-0">
                        <li>
                            <Link href="/dashboard" className="hover:underline">
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link href="/tools" className="hover:underline">
                                Tools
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="hover:underline">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>
            </footer>
        </main>
    );
}
