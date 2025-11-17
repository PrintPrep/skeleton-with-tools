// components/home/Hero.tsx

'use client';

import React from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import {useRouter} from "next/navigation";

export const Hero = () => {
    const router = useRouter();

    const handleGetStarted = () => {
        router.push('/dashboard');
    };

    return (
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-teal-50 -z-10" />

            {/* Floating shapes */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce" />
            <div className="absolute top-40 right-10 w-40 h-40 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
            <div className="absolute bottom-10 left-1/2 w-36 h-36 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Design Stunning<br />
                    <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">PDFs & Documents</span> 📄
                </h1>

                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Create, customize, and export organized PDFs effortlessly — a Canva-style experience made just for document creators.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <button
                        onClick={handleGetStarted}
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
                    >
                        Start Designing <ArrowRight className="inline ml-2" size={20} />
                    </button>
                </div>

                <p className="text-gray-500 text-sm mb-8">
                    No accounts. No clutter. Just creativity unleashed.
                </p>

                {/* Scroll indicator */}
                <div className="flex justify-center mt-12 animate-bounce">
                    <ChevronDown className="text-teal-500" size={32} />
                </div>
            </div>
        </section>
    );
};