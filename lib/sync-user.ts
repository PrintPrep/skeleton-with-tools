// lib/sync-user.ts
export async function syncUserToDatabase(clerkId: string, email: string, name?: string) {
  try {
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

    if (!response.ok) {
      throw new Error('Failed to sync user');
    }

    const result = await response.json();
    console.log('User synced to database via API:', clerkId);
    return result.user;
  } catch (error) {
    console.error('Error syncing user to database:', error);
    throw error;
  }
}