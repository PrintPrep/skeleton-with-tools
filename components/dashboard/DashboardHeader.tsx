// components/dashboard/DashboardHeader.tsx

import React from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

interface DashboardHeaderProps {
    isPro?: boolean;
    userName?: string;
}

export const DashboardHeader = ({ isPro = false, userName = 'User' }: DashboardHeaderProps) => {
    const { user } = useUser();

    // Use Clerk user data if available
    const displayName = user?.firstName || user?.username || userName;

    return (
        <div className="pt-24 pb-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Greeting */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Welcome {displayName} 👋
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {isPro 
                            ? 'You have access to all premium tools and features.' 
                            : 'Ready to create something amazing?'
                        }
                    </p>
                </div>

                {/* Free User Upgrade Banner or Pro Storage Summary */}
                {!isPro ? (
                    <div className="bg-gradient-to-r from-orange-400 to-pink-400 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">✨ Upgrade to Pro</h2>
                                <p className="text-white/90">
                                    Unlock cloud storage, save projects, and get priority rendering. 
                                    Start free, upgrade anytime.
                                </p>
                            </div>
                            <Link
                                href="/pricing"
                                className="bg-white text-orange-500 px-6 py-3 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap text-center"
                            >
                                Upgrade Now
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-2xl p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">☁️ Pro Cloud Storage</h2>
                                <p className="text-gray-600">
                                    You're using <span className="font-bold text-teal-600">2.4 GB</span> of{' '}
                                    <span className="font-bold text-teal-700">50 GB</span> available storage
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-3 max-w-xs">
                                    <div 
                                        className="bg-gradient-to-r from-teal-400 to-cyan-400 h-2 rounded-full" 
                                        style={{ width: '5%' }}
                                    ></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">5%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};