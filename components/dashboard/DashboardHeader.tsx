// components/dashboard/DashboardHeader.tsx

import React from 'react';
import Link from 'next/link';

export const DashboardHeader = ({ isPro = false, userName = 'User' }) => {
    return (
        <div className="pt-24 pb-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Greeting */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Welcome back, {userName} 👋
                    </h1>
                </div>

                {/* Free User Upgrade Banner or Pro Storage Summary */}
                {!isPro ? (
                    <div className="bg-gradient-to-r from-orange-400 to-pink-400 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">✨ Upgrade to Pro</h2>
                                <p className="text-white/90">Unlock cloud storage, save projects, and get priority rendering. Start free, upgrade anytime.</p>
                            </div>
                            <Link
                                href="/pricing"
                                className="bg-white text-orange-500 px-6 py-3 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap"
                            >
                                Upgrade Now
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-2xl p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">☁️ Cloud Storage</h2>
                                <p className="text-gray-600">You're using <span className="font-bold text-teal-600">2.4 GB</span> of <span className="font-bold">50 GB</span></p>
                            </div>
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">5%</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};