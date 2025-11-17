// components/home/Pricing.tsx

import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Pricing = () => {
    const plans = [
        { name: 'Free', price: '$0', desc: 'Basic PDF operations with limited projects.' },
        { name: 'Pro', price: '$5.99', original: '$9.99', desc: 'Unlimited projects, all tools unlocked.' },
        { name: 'Yearly', price: '$49', desc: 'Best value for frequent users.' },
        { name: 'Lifetime', price: '$79', desc: 'One payment for forever access.' },
    ];

    return (
        <section id="pricing" className="py-20 px-4 bg-gradient-to-b from-white to-cyan-50">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Simple, Transparent Pricing</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {plans.map((plan, i) => (
                        <div key={i} className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-teal-300 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                            <div className="mb-4">
                                <span className="text-4xl font-bold text-teal-600">{plan.price}</span>
                                {plan.original && <span className="text-gray-400 line-through ml-2 text-lg">{plan.original}</span>}
                            </div>
                            <p className="text-gray-600 text-sm mb-6">{plan.desc}</p>
                            <button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-2 rounded-lg font-medium hover:shadow-lg transition group-hover:scale-105">
                                Choose Plan
                            </button>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <button className="text-teal-600 font-bold hover:text-cyan-600 transition">
                        See Full Pricing <ArrowRight className="inline ml-2" size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
};