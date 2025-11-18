// lib/sync-user.ts
export async function syncUserToDatabase(clerkId: string, email: string, name?: string) {
  try {
    console.log('🔧 Attempting to sync user:', { clerkId, email, name });

    const response = await fetch('/api/sync-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clerkId,
        email,
        name,
      }),
    });

    console.log('🔧 Sync response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔧 Sync error response:', errorText);
      throw new Error(`Failed to sync user: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ User synced to database via API:', result);
    return result.user;
  } catch (error: unknown) {
    console.error('❌ Error syncing user to database:', error);
    throw error;
  }
}