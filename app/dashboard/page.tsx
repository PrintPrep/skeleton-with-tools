// app/dashboard/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ToolCards } from '@/components/dashboard/ToolCards';
import { RecentProjects } from '@/components/dashboard/RecentProjects';
import { AssetsPreview } from '@/components/dashboard/AssetsPreview';

export default function DashboardPage() {
    const [isPro, setIsPro] = useState(false);
    const [userName, setUserName] = useState('User');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching user data
        setTimeout(() => {
            setUserName('Sithum');
            setIsPro(false); // Change to true to see Pro experience
            setIsLoading(false);
        }, 500);
    }, []);

    if (isLoading) {
        return (
            <div className="w-full h-screen bg-gradient-to-br from-cyan-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-teal-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">
            <DashboardNav isPro={isPro} />
            <DashboardHeader isPro={isPro} userName={userName} />
            <ToolCards isPro={isPro} />
            <RecentProjects isPro={isPro} />
            <AssetsPreview isPro={isPro} />

            {/* Footer */}
            <footer className="mt-20 py-8 px-4 border-t border-gray-200">
                <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
                    <p>&copy; 2025 PrintPrev. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}