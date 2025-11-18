// lib/lemon-squeezy.ts
export interface LemonSqueezyProduct {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year' | 'lifetime';
}

// Use these test IDs for now - replace with real ones later
export const LEMON_SQUEEZY_PRODUCTS = {
  PRO_MONTHLY: {
    id: '1097562',
    name: 'Pro Monthly',
    price: 599,
    interval: 'month' as const,
  },
  PRO_YEARLY: {
    id: '1097577', 
    name: 'Pro Yearly',
    price: 4900,
    interval: 'year' as const,
  },
  LIFETIME: {
    id: '1097578',
    name: 'Lifetime',
    price: 7900,
    interval: 'lifetime' as const,
  },
};

export async function createLemonSqueezyCheckout(
  variantId: string,
  userId: string,
  userEmail: string
): Promise<string> {
  console.log('🛒 Starting checkout process...');
  
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variantId,
        userId, 
        userEmail,
      }),
    });

    console.log('📡 API response status:', response.status);

    // Get response as text first
    const responseText = await response.text();
    console.log('📄 Raw response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✅ Parsed response:', data);
    } catch (parseError) {
      console.error('❌ Failed to parse response:', parseError);
      throw new Error('Invalid response from server');
    }

    // If we have a checkout URL, use it (even in test/fallback mode)
    if (data.checkoutUrl) {
      console.log('🎉 Success! Redirecting to:', data.checkoutUrl);
      return data.checkoutUrl;
    }

    // If no checkout URL but we have an error
    if (data.error) {
      console.error('❌ API error:', data.error);
      throw new Error(data.error);
    }

    // Fallback: If everything else fails
    console.warn('⚠️ Using fallback checkout URL');
    return 'https://printprev.lemonsqueezy.com/checkout';

  } catch (error) {
    console.error('💥 Checkout failed:', error);
    
    // Always return a fallback URL so user can at least see the pricing
    const fallbackUrl = 'https://printprev.lemonsqueezy.com/checkout';
    console.log('🔄 Using fallback URL:', fallbackUrl);
    
    return fallbackUrl;
  }
}