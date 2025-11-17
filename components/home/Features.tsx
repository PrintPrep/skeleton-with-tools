// components/home/Features.tsx

'use client';

import React, { useState } from 'react';
import { FileText, BookOpen, Ticket, Sticker } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, shortDesc, details }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className="relative h-80 cursor-pointer group"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className={`absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl shadow-lg transition-all duration-300 ${
                isExpanded ? 'scale-110 shadow-2xl' : 'scale-100'
            }`} />

            <div className="absolute inset-0 flex flex-col justify-center items-start p-8 text-white rounded-2xl">
                {!isExpanded ? (
                    <>
                        <Icon size={48} className="mb-4" />
                        <h3 className="text-2xl font-bold mb-3">{title}</h3>
                        <p className="text-sm opacity-90">{shortDesc}</p>
                    </>
                ) : (
                    <div className="space-y-3 text-sm">
                        <p className="font-bold text-base">What it does:</p>
                        <p>{details.what}</p>
                        <p className="font-bold text-base">How it works:</p>
                        <ul className="text-xs space-y-1 list-disc list-inside">
                            {details.steps.map((step, i) => <li key={i}>{step}</li>)}
                        </ul>
                        <p className="font-bold text-base pt-2">Ideal for:</p>
                        <p className="text-xs">{details.idealFor}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const Features = () => {
    const features = [
        {
            icon: FileText,
            title: 'PDF Toolkit',
            shortDesc: 'Split, merge, reorder, and clean up PDFs instantly.',
            details: {
                what: 'Quick cleanup and organization of PDFs before printing.',
                steps: ['Upload one or multiple PDFs', 'Split, reorder, rotate, or merge pages', 'Export a clean, print-ready file'],
                idealFor: 'Teachers, designers, offices, print shops'
            }
        },
        {
            icon: BookOpen,
            title: 'Booklet Imposition',
            shortDesc: 'Convert any PDF into a print-ready booklet.',
            details: {
                what: 'Automatically arranges pages into booklet order.',
                steps: ['Upload a PDF', 'Select booklet mode (2-up, 4-up, or custom)', 'Download instantly ordered pages'],
                idealFor: 'Manuals, school notes, guides, programs'
            }
        },
        {
            icon: Ticket,
            title: 'Ticket Layout + Numbering',
            shortDesc: 'Create card grids with automatic sequential numbering.',
            details: {
                what: 'Generates sheets for tickets, ID cards, coupons.',
                steps: ['Choose grid size', 'Add numbering, prefixes, suffixes', 'Export the full sheet'],
                idealFor: 'Events, businesses, venues'
            }
        },
        {
            icon: Sticker,
            title: 'Sticker Pack / Multi-Image Layout',
            shortDesc: 'Auto-arrange multiple images into optimized print sheets.',
            details: {
                what: 'Automatically packs mixed-size images into efficient sheets.',
                steps: ['Upload any number of images or PDFs', 'PrintPrev rotates and arranges them for best fit', 'Export print-ready sheets with minimal waste'],
                idealFor: 'Sticker sellers, label creators, print shops'
            }
        }
    ];

    return (
        <section id="features" className="py-20 px-4 bg-gradient-to-b from-white to-cyan-50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Core Features</h2>
                    <p className="text-xl text-gray-600">Hover over each card to explore more</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {features.map((feature, i) => (
                        <FeatureCard key={i} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};