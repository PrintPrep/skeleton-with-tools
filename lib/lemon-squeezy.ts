// lib/lemon-squeezy.ts

export interface LemonSqueezyProduct {
  id: string;
  name: string;
  interval?: 'month' | 'year' | 'once';
}

export const LEMON_SQUEEZY_PRODUCTS = {
  PRO_MONTHLY: {
    id: '1097562',
    name: 'Pro Monthly',
    interval: 'month' as const
  },
  PRO_YEARLY: {
    id: '1097577',
    name: 'Pro Yearly', 
    interval: 'year' as const
  },
  LIFETIME: {
    id: '1097578',
    name: 'Lifetime',
    interval: 'once' as const
  }
};

/**
 * Client-side function to initiate checkout
 * This calls YOUR API route which then calls Lemon Squeezy
 */
export async function createLemonSqueezyCheckout(
  variantId: string,
  userId: string,
  userEmail: string
): Promise<string> {
  try {
    console.log('🔧 Calling /api/create-routes with variantId:', variantId);
    
    // Call YOUR Next.js API route (not Lemon Squeezy directly)
    const response = await fetch('/api/create-routes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variantId: variantId
        // Don't need to send userId/email - the API route gets it from Clerk auth()
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API route error:', errorData);
      throw new Error(errorData.error || `Failed to create checkout (HTTP ${response.status})`);
    }

    const data = await response.json();
    
    if (!data.url) {
      throw new Error('No checkout URL received from API');
    }

    console.log('✅ Checkout URL received:', data.url);
    return data.url;
    
  } catch (error) {
    console.error('❌ Error creating checkout:', error);
    throw error;
  }
}