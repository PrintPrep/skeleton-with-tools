// app/api/create-routes/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const { variantId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔧 Creating checkout for user:', userId, 'variant:', variantId);

    // Create checkout with Lemon Squeezy API
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
        'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              custom: {
                user_id: userId  // This is crucial for webhook processing
              }
            },
            checkout_options: {
              embed: true,
              media: false,
              button_color: '#0d9488'
            },
            product_options: {
              enabled_variants: [variantId],  // Only show selected variant
              redirect_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=success`
            }
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: process.env.LEMON_SQUEEZY_STORE_ID
              }
            },
            variant: {
              data: {
                type: 'variants',
                id: variantId.toString()
              }
            }
          }
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Lemon Squeezy API error:', error);
      return NextResponse.json({ 
        error: 'Failed to create checkout',
        details: error 
      }, { status: 500 });
    }

    const checkoutData = await response.json();
    console.log('✅ Checkout created:', checkoutData.data.id);
    
    return NextResponse.json({ 
      url: checkoutData.data.attributes.url 
    });
  } catch (error) {
    console.error('❌ Checkout creation error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}