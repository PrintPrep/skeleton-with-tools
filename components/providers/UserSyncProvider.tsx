// components/providers/UserSyncProvider.tsx
'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

export function UserSyncProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Sync user whenever they are authenticated
      syncUserToDatabase(
        user.id, 
        user.primaryEmailAddress?.emailAddress, 
        user.fullName
      );
    }
  }, [isLoaded, user]);

  return <>{children}</>;
}

async function syncUserToDatabase(clerkId: string, email: string | undefined, name: string | null) {
  if (!email) {
    console.log('⏸️ No email available for sync, skipping...');
    return;
  }

  try {
    console.log('🔧 Auto-syncing user on auth:', { clerkId, email, name });

    const response = await fetch('/api/sync-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        clerkId, 
        email, 
        name: name || null 
      }),
    });

    if (response.ok) {
      console.log('✅ User auto-synced on auth');
    } else {
      console.error('❌ Auto-sync failed with status:', response.status);
    }
  } catch (error) {
    console.error('❌ Auto-sync failed:', error);
  }
}