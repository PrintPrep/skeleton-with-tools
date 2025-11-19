// components/home/HowItWorks.tsx

import React from 'react';
import { Upload, Settings, FileText, Download } from 'lucide-react';

export const HowItWorks = () => {
    const steps = [
        { icon: Settings, title: 'Choose a tool', desc: 'Toolkit, booklet, numbering, or sticker pack' },
        { icon: Upload, title: 'Upload your files', desc: 'Drag-and-drop interface' },
        { icon: FileText, title: 'Customize', desc: 'Live previews, instant updates' },
        { icon: Download, title: 'Export', desc: 'Print-ready PDFs optimized for your layout' },
    ];

    return (
        <section id="how-it-works" className="py-20 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">How It Works</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <div key={i} className="text-center group">
                                <div className="bg-gradient-to-br from-teal-100 to-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:-translate-y-2">
                                    <Icon className="text-teal-600" size={32} />
                                </div>
                                <div className="text-4xl font-bold text-teal-500 mb-2">{i + 1}</div>
                                <h3 className="font-bold text-lg text-gray-900 mb-2">{step.title}</h3>
                                <p className="text-gray-600 text-sm">{step.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};