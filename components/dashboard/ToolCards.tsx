// components/dashboard/ToolCards.tsx

import React, { useState } from 'react';
import { FileText, BookOpen, Ticket, Sticker, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const ToolCard = ({ icon: Icon, title, description, bgColor, iconBgColor, iconColor, steps, isPro, proFeature, href }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link href={href}>
            <div
                className={`${bgColor} rounded-2xl p-8 cursor-pointer transition-all duration-300 h-full transform hover:scale-105 hover:shadow-xl group`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className={`${iconBgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`${iconColor} w-8 h-8`} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-700 text-sm mb-6">{description}</p>

                {isHovered && steps && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 animate-in fade-in slide-in-from-bottom-2">
                        {steps.map((step, i) => (
                            <div key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-teal-600 font-bold">{i + 1}.</span>
                                <span>{step}</span>
                            </div>
                        ))}
                    </div>
                )}

                {proFeature && isPro === false && (
                    <div className="mt-4 bg-orange-100 px-3 py-2 rounded-lg flex items-center gap-2">
                        <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">Pro</span>
                        <span className="text-orange-700 text-xs font-medium">{proFeature}</span>
                    </div>
                )}

                <div className="mt-6 flex items-center gap-2 text-teal-600 font-bold group-hover:gap-3 transition-all">
                    Open <ArrowRight size={16} />
                </div>
            </div>
        </Link>
    );
};

export const ToolCards = ({ isPro = false }) => {
    const tools = [
        {
            icon: FileText,
            title: 'PDF Toolkit',
            description: 'Split, merge, reorder, and clean up PDFs',
            bgColor: 'bg-teal-50',
            iconBgColor: 'bg-teal-100',
            iconColor: 'text-teal-600',
            steps: ['Upload PDFs', 'Split & reorder pages', 'Download cleaned files'],
            href: '/tools/pdf-toolkit'
        },
        {
            icon: BookOpen,
            title: 'Booklet Imposition',
            description: 'Convert PDFs into print-ready booklets',
            bgColor: 'bg-orange-50',
            iconBgColor: 'bg-orange-100',
            iconColor: 'text-orange-600',
            steps: ['Upload PDF', 'Choose booklet mode', 'Download arranged pages'],
            href: '/tools/booklet-imposition'
        },
        {
            icon: Ticket,
            title: 'Ticket Layout',
            description: 'Create numbered tickets & cards',
            bgColor: 'bg-purple-50',
            iconBgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
            steps: ['Choose grid size', 'Add numbering', 'Export sheet'],
            proFeature: 'Save to Assets',
            href: '/tools/ticket-layout/wizard'
        },
        {
            icon: Sticker,
            title: 'Sticker Pack',
            description: 'Auto-arrange images into print sheets',
            bgColor: 'bg-green-50',
            iconBgColor: 'bg-green-100',
            iconColor: 'text-green-600',
            steps: ['Upload images', 'Auto-arrange', 'Download sheets'],
            proFeature: 'Unlimited uploads',
            href: '/tools/sticker-pack'
        }
    ];

    return (
        <section className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Quick Access Tools</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tools.map((tool, i) => (
                        <ToolCard key={i} {...tool} isPro={isPro} />
                    ))}
                </div>
            </div>
        </section>
    );
};