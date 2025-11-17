// components/home/CTASection.tsx

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export const CTASection = () => {
    const router = useRouter();

    const handleGetStarted = () => {
        router.push('/dashboard');
    };

    return (
        <section className="py-20 px-4 bg-gradient-to-r from-teal-500 to-cyan-500">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                    Ready to speed up your print workflow?
                </h2>

                <button
                    onClick={handleGetStarted}
                    className="bg-white text-teal-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all inline-block animate-bounce"
                >
                    Get Started Free <ArrowRight className="inline ml-2" size={20} />
                </button>
            </div>
        </section>
    );
};