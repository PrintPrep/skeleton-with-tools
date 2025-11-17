// components/home/Tools.tsx

import React from 'react';
import { Upload, Scissors, GripVertical, Download } from 'lucide-react';

export const Tools = () => {
    const tools = [
        {
            icon: Upload,
            title: 'Upload PDFs',
            desc: 'Import multiple PDF files at once',
            bgColor: 'bg-teal-50',
            iconBgColor: 'bg-teal-100',
            iconColor: 'text-teal-600'
        },
        {
            icon: Scissors,
            title: 'Split & Organize',
            desc: 'Split sections and rearrange pages',
            bgColor: 'bg-orange-50',
            iconBgColor: 'bg-orange-100',
            iconColor: 'text-orange-600'
        },
        {
            icon: GripVertical,
            title: 'Drag & Drop',
            desc: 'Intuitive drag-and-drop interface',
            bgColor: 'bg-purple-50',
            iconBgColor: 'bg-purple-100',
            iconColor: 'text-purple-600'
        },
        {
            icon: Download,
            title: 'Merge & Export',
            desc: 'Combine and download your PDFs',
            bgColor: 'bg-green-50',
            iconBgColor: 'bg-green-100',
            iconColor: 'text-green-600'
        }
    ];

    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {tools.map((tool, i) => {
                        const Icon = tool.icon;
                        return (
                            <div
                                key={i}
                                className={`${tool.bgColor} rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer group`}
                            >
                                <div className={`${tool.iconBgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className={`${tool.iconColor} w-8 h-8`} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.title}</h3>
                                <p className="text-gray-600 text-sm">{tool.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};