// components/dashboard/ToolCard.tsx

import Link from "next/link";

export interface ToolCardProps {
    title: string;
    description: string;
    link: string;
    icon: string;
    color: string;
}

export function ToolCard({ title, description, link, icon, color }: ToolCardProps) {
    return (
        <Link
            href={link}
            className="group p-8 bg-white rounded-3xl border-2 border-slate-200 hover:border-cyan-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
        >
            {/* Icon area with gradient background */}
            <div className={`w-full h-32 bg-gradient-to-br ${color} rounded-2xl mb-5 flex items-center justify-center text-5xl shadow-lg group-hover:scale-110 transition-transform`}>
                {icon}
            </div>

            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <p className="text-slate-600 text-sm mt-2 flex-grow leading-relaxed">{description}</p>

            <span className="mt-5 inline-flex items-center text-cyan-600 hover:text-cyan-700 font-bold text-sm group-hover:translate-x-1 transition-transform">
                Open →
            </span>
        </Link>
    );
}