// app/dashboard/page.tsx

import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { ToolCard } from "@/components/dashboard/ToolCard";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardPage() {
    const tools = [
        {
            title: "PDF Toolkit",
            description: "Split, merge & organize PDFs.",
            link: "/tools/pdf-toolkit",
            icon: "📄",
            color: "from-cyan-500 to-blue-500"
        },
        {
            title: "Booklet Imposition",
            description: "Create print-ready booklets instantly.",
            link: "/tools/booklet-imposition",
            icon: "📖",
            color: "from-blue-500 to-indigo-500"
        },
        {
            title: "Ticket Layout + Numbering",
            description: "Generate grids with sequential numbering.",
            link: "/tools/ticket-layout",
            icon: "🎫",
            color: "from-purple-500 to-pink-500"
        },
        {
            title: "Sticker Pack Tool",
            description: "Arrange stickers for print sheets.",
            link: "/tools/sticker-pack",
            icon: "✨",
            color: "from-pink-500 to-red-500"
        },
    ];

    return (
        <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 text-slate-800 px-6 md:px-12 lg:px-24 py-16 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="fixed top-20 left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob pointer-events-none"></div>
            <div className="fixed bottom-20 right-10 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>

            <DashboardNavbar />

            {/* ===== TOOL GRID ===== */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 relative z-10">
                {tools.map((tool) => (
                    <ToolCard
                        key={tool.title}
                        title={tool.title}
                        description={tool.description}
                        link={tool.link}
                        icon={tool.icon}
                        color={tool.color}
                    />
                ))}
            </section>

            <Sidebar />
        </main>
    );
}