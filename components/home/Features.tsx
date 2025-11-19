// components/home/Features.tsx

'use client';

import React, { useState } from 'react';
import { FileText, BookOpen, Ticket, Sticker, ArrowRight, Sparkles } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, shortDesc, details, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    const isEven = index % 2 === 0;

    return (
        <div
            className={`relative flex flex-col lg:flex-row items-center min-h-[280px] transition-all duration-500 cursor-pointer group ${
                isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Zigzag staircase effect */}
            <div
                className={`absolute hidden lg:block w-20 h-20 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl transform rotate-45 z-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 ${
                    isEven 
                        ? '-left-10 top-6' 
                        : '-right-10 top-6'
                }`}
            />
            
            {/* Step connector lines */}
            {index > 0 && (
                <div
                    className={`hidden lg:block absolute h-0.5 bg-gradient-to-r from-cyan-300 to-teal-400 w-24 transform transition-all duration-500 group-hover:scale-110 ${
                        isEven 
                            ? 'left-24 top-1/2 -translate-y-1/2 -translate-x-6' 
                            : 'right-24 top-1/2 -translate-y-1/2 translate-x-6'
                    }`}
                />
            )}

            {/* Content Card */}
            <div
                className={`relative w-full max-w-lg bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl transition-all duration-500 z-10
                    ${isHovered 
                        ? 'shadow-cyan-500/10 transform -translate-y-1 scale-[1.02]' 
                        : 'shadow-lg'
                    }
                    ${isEven ? 'lg:ml-16' : 'lg:mr-16'}`}
            >
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md transform transition-all duration-500
                        ${isHovered ? 'scale-105 rotate-3' : 'scale-100'}`}>
                        <Icon size={24} className="text-white" />
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-teal-700 bg-clip-text text-transparent">
                                {title}
                            </h3>
                            {isHovered && (
                                <Sparkles size={16} className="text-cyan-500 animate-pulse" />
                            )}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{shortDesc}</p>
                    </div>
                </div>

                {/* Expandable Details */}
                <div className={`overflow-hidden transition-all duration-500 ${
                    isHovered ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                    <div className="pt-4 border-t border-gray-200/50 space-y-3">
                        {/* What it does */}
                        <div>
                            <div className="flex items-center gap-1 mb-2">
                                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                                <span className="font-semibold text-gray-900 text-sm">What it does</span>
                            </div>
                            <p className="text-gray-700 text-sm pl-3">{details.what}</p>
                        </div>

                        {/* How it works */}
                        <div>
                            <div className="flex items-center gap-1 mb-2">
                                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                                <span className="font-semibold text-gray-900 text-sm">How it works</span>
                            </div>
                            <ul className="space-y-1 pl-3">
                                {details.steps.map((step, i) => (
                                    <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                                        <span className="flex-shrink-0 w-5 h-5 bg-cyan-100 text-cyan-700 rounded-full text-xs flex items-center justify-center font-medium mt-0.5">
                                            {i + 1}
                                        </span>
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Ideal for */}
                        <div>
                            <div className="flex items-center gap-1 mb-2">
                                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                                <span className="font-semibold text-gray-900 text-sm">Ideal for</span>
                            </div>
                            <p className="text-gray-700 text-sm pl-3">{details.idealFor}</p>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-md hover:shadow-cyan-500/25 transform hover:-translate-y-0.5">
                        Try it now
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                </div>

                {/* Hover indicator */}
                <div className={`absolute bottom-3 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 ${
                    !isHovered ? 'opacity-100' : 'opacity-0'
                }`}>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span>Hover to explore</span>
                        <div className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce" />
                    </div>
                </div>
            </div>

            {/* Step number */}
            <div className={`absolute hidden lg:flex items-center justify-center w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm border border-white/20 shadow-md z-20 transform transition-all duration-500 group-hover:scale-105
                ${isEven ? '-left-6 top-1/2 -translate-y-1/2' : '-right-6 top-1/2 -translate-y-1/2'}`}>
                <span className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-teal-700 bg-clip-text text-transparent">
                    {index + 1}
                </span>
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
                steps: [
                    'Upload PDFs securely',
                    'Split, reorder, or merge pages',
                    'Export print-ready files'
                ],
                idealFor: 'Teachers, designers, offices, print shops',
            },
        },
        {
            icon: BookOpen,
            title: 'Booklet Imposition',
            shortDesc: 'Convert any PDF into a print-ready booklet.',
            details: {
                what: 'Automatically arranges pages into booklet order.',
                steps: [
                    'Upload your PDF document',
                    'Select booklet mode',
                    'Download ordered pages'
                ],
                idealFor: 'Manuals, school notes, guides, programs',
            },
        },
        {
            icon: Ticket,
            title: 'Ticket Layout',
            shortDesc: 'Create card grids with automatic numbering.',
            details: {
                what: 'Generates sheets for tickets, ID cards, coupons.',
                steps: [
                    'Choose grid size',
                    'Add numbering, prefixes',
                    'Export printable sheets'
                ],
                idealFor: 'Events, businesses, venues',
            },
        },
        {
            icon: Sticker,
            title: 'Sticker Pack Layout',
            shortDesc: 'Auto-arrange images into optimized print sheets.',
            details: {
                what: 'Automatically packs mixed-size images efficiently.',
                steps: [
                    'Upload images/PDFs',
                    'Auto-arrange for best fit',
                    'Export print-ready sheets'
                ],
                idealFor: 'Sticker sellers, label creators, print shops',
            },
        },
    ];

    return (
        <section id="features" className="py-20 px-6 bg-gradient-to-br from-slate-50 via-cyan-50/30 to-teal-50/50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-56 h-56 bg-cyan-200/20 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-teal-200/20 rounded-full blur-2xl transform translate-x-1/2 translate-y-1/2" />
            
            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-md mb-4">
                        <Sparkles size={18} className="text-cyan-500" />
                        <span className="font-semibold text-gray-700 text-sm">Powerful Features</span>
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-teal-800 to-cyan-700 bg-clip-text text-transparent mb-4">
                        Core Features
                    </h2>
                    <p className="text-lg text-gray-600 max-w-xl mx-auto">
                        Professional tools to streamline your printing workflow.
                        <span className="text-cyan-600 font-medium"> Hover to explore.</span>
                    </p>
                </div>

                {/* Features Grid with Zigzag Layout */}
                <div className="relative">
                    {/* Central guideline */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-200/50 to-teal-200/50 transform -translate-x-1/2 hidden lg:block" />
                    
                    <div className="flex flex-col gap-20 lg:gap-16">
                        {features.map((feature, i) => (
                            <FeatureCard
                                key={i}
                                {...feature}
                                index={i}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};