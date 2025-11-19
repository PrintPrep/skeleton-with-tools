// components/home/UseCases.tsx

import React from 'react';

export const UseCases = () => {
    const cases = [
        { title: 'Event Organizers', desc: 'Make numbered tickets, passes, and tags.' },
        { title: 'Teachers & Schools', desc: 'Print booklets and worksheet packs instantly.' },
        { title: 'Print Shops', desc: 'Prepare client files in minutes, not hours.' },
        { title: 'Small Businesses', desc: 'Create cards, labels, vouchers, and more.' },
    ];

    return (
        <section className="py-20 px-4 bg-gradient-to-b from-cyan-50 to-white">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Who Uses PrintPrev</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {cases.map((useCase, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-teal-200 transition-all duration-300 group cursor-pointer transform hover:-translate-y-1">
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition">{useCase.title}</h3>
                            <p className="text-gray-600">{useCase.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};