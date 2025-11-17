// components/home/SocialProof.tsx

import React from 'react';

export const SocialProof = () => {
    const badges = [
        'Small Businesses',
        'Local Print Shops',
        'Universities',
        'Event Planners',
        'Freelance Designers'
    ];

    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-4xl mx-auto text-center">
                <p className="text-2xl font-bold text-gray-900 mb-8">
                    Trusted by creators, educators, and print shops worldwide.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                    {badges.map((badge, i) => (
                        <div key={i} className="bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-3 rounded-full border border-teal-200 text-gray-700 font-medium hover:bg-gradient-to-r hover:from-teal-100 hover:to-cyan-100 transition-all duration-300 hover:scale-105">
                            ✓ {badge}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};