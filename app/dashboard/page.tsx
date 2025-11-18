// app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ToolCards } from '@/components/dashboard/ToolCards';
import { RecentProjects } from '@/components/dashboard/RecentProjects';
import { AssetsPreview } from '@/components/dashboard/AssetsPreview';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { syncUserToDatabase } from '@/lib/sync-user';

export default function DashboardPage() {
    const [isPro, setIsPro] = useState(false);
    const [userName, setUserName] = useState('User');
    const [isLoading, setIsLoading] = useState(true);
    const [storageUsed, setStorageUsed] = useState(2.4);
    const [storageTotal, setStorageTotal] = useState(50);
    const { user, isLoaded } = useUser();
    const { userId } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If user is not loaded yet, wait
        if (!isLoaded) return;

        // If no user is found, redirect to sign-in
        if (!user) {
            router.push('/sign-in');
            return;
        }

        // Set user data when user is loaded
        const userName = user.firstName || user.username || 'User';
        setUserName(userName);
        
        const loadDashboard = async () => {
            try {
                console.log('🔧 Starting dashboard load for user:', user.id);
                
                // Sync user to database
                await syncUserToDatabase(
                    user.id,
                    user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress || '',
                    userName
                );

                // Fetch real user status from database
                await fetchUserStatus();

            } catch (error: unknown) {
                console.error('❌ Error in dashboard loading:', error);
                // Fallback to Clerk metadata
                setIsPro(user?.publicMetadata?.isPro === true);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboard();

    }, [user, isLoaded, router]);

    const fetchUserStatus = async () => {
        try {
            console.log('🔧 Fetching user status for:', user?.id);
            const response = await fetch(`/api/users/${user?.id}/status`);
            
            if (response.ok) {
                const userData = await response.json();
                console.log('✅ User status fetched:', userData);
                setIsPro(userData.isPro);
                
                // If user is Pro, fetch their storage usage
                if (userData.isPro) {
                    await fetchStorageUsage();
                }
            } else {
                console.warn('⚠️ User status fetch failed, using fallback');
                setIsPro(user?.publicMetadata?.isPro === true);
            }
        } catch (error: unknown) {
            console.error('❌ Failed to fetch user status:', error);
            // Fallback to Clerk metadata if API fails
            setIsPro(user?.publicMetadata?.isPro === true);
        }
    };

    const fetchStorageUsage = async () => {
        try {
            const response = await fetch(`/api/users/${user?.id}/storage`);
            if (response.ok) {
                const storageData = await response.json();
                setStorageUsed(storageData.used);
                setStorageTotal(storageData.total);
            }
        } catch (error: unknown) {
            console.error('❌ Failed to fetch storage usage:', error);
        }
    };

    // Refresh user status when returning from payment (check for success param)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const success = urlParams.get('success');
        
        if (success === 'true') {
            console.log('🔄 Payment success detected, refreshing user status...');
            // Payment was successful, refresh user status
            fetchUserStatus();
            
            // Clean up URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }, []);

    // Show loading state
    if (!isLoaded || isLoading) {
        return (
            <div className="w-full h-screen bg-gradient-to-br from-cyan-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-teal-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    // If no user but loaded, show nothing (will redirect)
    if (!user) {
        return null;
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">
            <DashboardNav isPro={isPro} />
            <DashboardHeader 
                isPro={isPro} 
                userName={userName}
                storageUsed={storageUsed}
                storageTotal={storageTotal}
            />
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