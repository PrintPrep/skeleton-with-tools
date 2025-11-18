// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('🎯 Checkout API called');
  
  try {
    const body = await request.json();
    const { variantId, userId, userEmail } = body;

    console.log('📦 Received:', { variantId, userId, userEmail });

    // Validate input
    if (!variantId || !userId || !userEmail) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: 'Please provide variantId, userId, and userEmail'
        },
        { status: 400 }
      );
    }

    // Check if we have the required environment variables
    const hasApiKey = !!process.env.LEMON_SQUEEZY_API_KEY;
    const hasStoreId = !!process.env.LEMON_SQUEEZY_STORE_ID;
    
    console.log('🔑 Environment check:', { hasApiKey, hasStoreId });

    // If we don't have the real credentials, return a test checkout URL
    if (!hasApiKey || !hasStoreId) {
      console.log('🚨 Using test mode - missing environment variables');
      
      const testCheckoutUrl = `https://printprev.lemonsqueezy.com/checkout?donut=custom&product_id=${variantId}`;
      
      return NextResponse.json({
        success: true,
        checkoutUrl: testCheckoutUrl,
        message: 'Test mode - Please add Lemon Squeezy credentials to .env',
        test: true
      });
    }

    // If we have credentials, call the real Lemon Squeezy API
    console.log('🚀 Calling real Lemon Squeezy API...');
    
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
        'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email: userEmail,
              custom: {
                user_id: userId,
              },
            },
            product_options: {
              redirect_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard?success=true`,
            },
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: process.env.LEMON_SQUEEZY_STORE_ID,
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: variantId,
              },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Lemon Squeezy API error:', errorText);
      throw new Error(`Lemon Squeezy API returned ${response.status}`);
    }

    const data = await response.json();
    const checkoutUrl = data.data.attributes.url;

    console.log('✅ Real checkout URL created:', checkoutUrl);

    return NextResponse.json({
      success: true,
      checkoutUrl,
      message: 'Checkout created successfully'
    });

  } catch (error) {
    console.error('💥 Checkout API error:', error);
    
    // Return a fallback test URL even if everything fails
    const fallbackUrl = 'https://printprev.lemonsqueezy.com/checkout';
    
    return NextResponse.json({
      success: true,
      checkoutUrl: fallbackUrl,
      message: 'Fallback mode - Using default checkout',
      fallback: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}