// app/api/create-routes/route.ts - ULTRA DEBUG VERSION
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const { variantId } = await request.json();

    console.log('🔧 Checkout request received:', { userId, variantId });

    if (!userId) {
      console.error('❌ No user ID in auth');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      console.error('❌ User not found in database:', userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('✅ User verified:', user.email);

    // Prepare checkout data
    const checkoutData = {
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            custom: {
              user_id: userId,
              user_email: user.email,
              timestamp: new Date().toISOString()
            }
          },
          product_options: {
            enabled_variants: [parseInt(variantId)],
            redirect_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=success`,
            receipt_button_text: 'Go to Dashboard',
            receipt_thank_you_note: 'Thank you for your purchase! You can now access all Pro features.'
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
    };

    console.log('🔧 Sending to Lemon Squeezy:', {
      storeId: process.env.LEMON_SQUEEZY_STORE_ID,
      variantId: variantId,
      custom_data: checkoutData.data.attributes.checkout_data.custom
    });

    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
        'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`
      },
      body: JSON.stringify(checkoutData)
    });

    const responseText = await response.text();
    console.log('🔧 Lemon Squeezy Response:', {
      status: response.status,
      statusText: response.statusText,
      body: responseText
    });

    if (!response.ok) {
      console.error('❌ Lemon Squeezy API error:', responseText);
      return NextResponse.json({ 
        error: 'Failed to create checkout',
        details: responseText 
      }, { status: 500 });
    }

    const checkoutDataResponse = JSON.parse(responseText);
    console.log('✅ Checkout created successfully:', checkoutDataResponse.data.id);
    
    return NextResponse.json({ 
      success: true,
      url: checkoutDataResponse.data.attributes.url,
      checkoutId: checkoutDataResponse.data.id
    });
  } catch (error) {
    console.error('❌ Checkout creation error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}