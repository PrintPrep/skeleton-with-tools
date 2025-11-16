// app/dashboard/page.tsx

import Link from "next/link";

export default function DashboardPage() {
    return (
        <main className="min-h-screen bg-gray-50 text-gray-800 px-6 md:px-12 lg:px-24 py-16">
            {/* ===== HEADER ===== */}
            <header className="flex items-center justify-between">
                <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>

                <Link
                    href="/"
                    className="text-sm text-blue-600 hover:underline"
                >
                    Back to Home →
                </Link>
            </header>

            {/* ===== INTRO TEXT ===== */}
            <p className="mt-4 text-gray-600 max-w-xl">
                Welcome to PrintPrep. Choose a tool to get started.
            </p>

            {/* ===== TOOL GRID ===== */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                {[
                    {
                        title: "PDF Toolkit",
                        desc: "Split, merge & organize PDFs.",
                        link: "/tools/pdf-toolkit",
                    },
                    {
                        title: "Booklet Imposition",
                        desc: "Create print-ready booklets instantly.",
                        link: "/tools/booklet-imposition",
                    },
                    {
                        title: "Ticket Layout + Numbering",
                        desc: "Generate grids with sequential numbering.",
                        link: "/tools/ticket-layout",
                    },
                    {
                        title: "Sticker Pack Tool",
                        desc: "Arrange stickers for print sheets.",
                        link: "/tools/sticker-pack",
                    },
                ].map((tool) => (
                    <Link
                        key={tool.title}
                        href={tool.link}
                        className="p-6 bg-white rounded-xl border hover:shadow-lg transition flex flex-col"
                    >
                        {/* Placeholder icon area */}
                        <div className="w-full h-28 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400">
                            Icon / Image
                        </div>

                        <h3 className="text-lg font-semibold">{tool.title}</h3>
                        <p className="text-gray-600 text-sm mt-1 flex-grow">{tool.desc}</p>

                        <span className="mt-4 inline-block text-blue-600 hover:underline text-sm">
              Open →
            </span>
                    </Link>
                ))}
            </section>
        </main>
    );
}
