// app/api/create-routes/route.ts - FIXED VERSION
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const { variantId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user exists in our database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      console.error('❌ User not found in database during checkout:', userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('🔧 Creating checkout for user:', userId, 'email:', user.email, 'variant:', variantId);

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
                user_id: userId,  // CRITICAL: This must be passed!
                user_email: user.email
              }
            },
            product_options: {
              enabled_variants: [parseInt(variantId)],
              redirect_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=success`,
              receipt_button_text: 'Go to Dashboard',
              receipt_thank_you_note: 'Thank you for your purchase!'
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
      const errorText = await response.text();
      console.error('❌ Lemon Squeezy API error:', response.status, errorText);
      return NextResponse.json({ 
        error: 'Failed to create checkout',
        details: `API returned ${response.status}` 
      }, { status: 500 });
    }

    const checkoutData = await response.json();
    console.log('✅ Checkout created:', checkoutData.data.id);
    
    return NextResponse.json({ 
      success: true,
      url: checkoutData.data.attributes.url,
      checkoutId: checkoutData.data.id
    });
  } catch (error) {
    console.error('❌ Checkout creation error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}