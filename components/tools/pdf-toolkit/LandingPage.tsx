// components/tools/pdf-toolkit/LandingPage.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Scissors, Shuffle, Download } from 'lucide-react';

export default function LandingPage() {
    const router = useRouter();

    const handleStartDesigning = () => {
        router.push('/tools/pdf-toolkit/editor');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E0F7F4] via-[#F0F9FF] to-[#E8F4FF] flex items-center justify-center p-4">
            <div className="max-w-4xl mx-auto text-center">
                {/* Main Heading */}
                <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-4">
                    Design Stunning
                </h1>
                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                    <span className="text-[#00BFA6]">PDFs</span> <span className="text-gray-800">& Documents</span>
                    <span className="inline-block ml-3 text-4xl">📄</span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                    Create, customize, and export organized PDFs effortlessly — a Canva-style experience made just for document creators.
                </p>

                {/* CTA Button */}
                <button
                    onClick={handleStartDesigning}
                    className="bg-[#00BFA6] hover:bg-[#00D1B2] text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 inline-flex items-center gap-2"
                >
                    Start Designing →
                </button>

                <p className="text-sm text-gray-500 mt-4">
                    No accounts. No clutter. Just creativity unleashed.
                </p>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
                    <div className="bg-white/60 backdrop-blur rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-[#00BFA6]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <FileText className="text-[#00BFA6]" size={24} />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">Upload PDFs</h3>
                        <p className="text-sm text-gray-600">Import multiple PDF files at once</p>
                    </div>

                    <div className="bg-white/60 backdrop-blur rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-[#FF9500]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Scissors className="text-[#FF9500]" size={24} />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">Split & Organize</h3>
                        <p className="text-sm text-gray-600">Split sections and rearrange pages</p>
                    </div>

                    <div className="bg-white/60 backdrop-blur rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-[#A259FF]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Shuffle className="text-[#A259FF]" size={24} />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">Drag & Drop</h3>
                        <p className="text-sm text-gray-600">Intuitive drag-and-drop interface</p>
                    </div>

                    <div className="bg-white/60 backdrop-blur rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-[#34C759]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Download className="text-[#34C759]" size={24} />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">Merge & Export</h3>
                        <p className="text-sm text-gray-600">Combine and download your PDFs</p>
                    </div>
                </div>
            </div>
        </div>
    );
}