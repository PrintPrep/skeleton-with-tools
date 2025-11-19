// components/dashboard/DashboardHeader.tsx - Update the interface and usage
import React from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

interface DashboardHeaderProps {
    isPro?: boolean;
    userName?: string;
    storageUsed?: number;
    storageTotal?: number;
}

export const DashboardHeader = ({ 
    isPro = false, 
    userName = 'User',
    storageUsed = 2.4,
    storageTotal = 50
}: DashboardHeaderProps) => {
    const { user } = useUser();

    // Use Clerk user data if available
    const displayName = user?.firstName || user?.username || userName;
    const storagePercentage = (storageUsed / storageTotal) * 100;

    return (
        <div className="pt-24 pb-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Greeting */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Welcome back, {displayName} 👋
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {isPro 
                            ? 'You have access to all premium tools and features.' 
                            : 'Ready to create something amazing? Upgrade to unlock all features.'
                        }
                    </p>
                </div>

                {/* Free User Upgrade Banner or Pro Storage Summary */}
                {!isPro ? (
                    <div className="bg-gradient-to-r from-orange-400 to-pink-400 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-2"> Upgrade to Pro!</h2>
                                <p className="text-white/90">
                                    Unlock cloud storage, save unlimited projects, and get priority rendering. 
                                    Start with a 7-day free trial, cancel anytime.
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
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">☁️ Pro Cloud Storage</h2>
                                <p className="text-gray-600 mb-3">
                                    You're using <span className="font-bold text-teal-600">{storageUsed} GB</span> of{' '}
                                    <span className="font-bold text-teal-700">{storageTotal} GB</span> available storage
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-3 max-w-md">
                                    <div 
                                        className="bg-gradient-to-r from-teal-400 to-cyan-400 h-3 rounded-full transition-all duration-500" 
                                        style={{ width: `${storagePercentage}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    {Math.round(storagePercentage)}% used
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 flex items-center justify-center shadow-lg">
                                        <span className="text-white font-bold text-lg">
                                            {Math.round(storagePercentage)}%
                                        </span>
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