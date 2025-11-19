// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, PlanType, SubscriptionStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Map variant IDs to plan types
const VARIANT_TO_PLAN: { [key: string]: PlanType } = {
  '1097562': PlanType.MONTHLY,  // Pro Monthly
  '1097577': PlanType.YEARLY,   // Pro Yearly  
  '1097578': PlanType.LIFETIME, // Lifetime
};

// Map variant IDs to product names for better tracking
const VARIANT_TO_NAME: { [key: string]: string } = {
  '1097562': 'Pro Monthly',
  '1097577': 'Pro Yearly',
  '1097578': 'Lifetime',
};

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

    // Validate user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Determine plan type from variant ID
    const planType = VARIANT_TO_PLAN[variantId] || PlanType.MONTHLY;
    const productName = VARIANT_TO_NAME[variantId] || 'Unknown Product';

    console.log('📊 Plan determined:', { variantId, planType, productName });

    // Create pending subscription record
    await createPendingSubscription(userId, variantId, planType, productName);

    // Check if we have the required environment variables
    const hasApiKey = !!process.env.LEMON_SQUEEZY_API_KEY;
    const hasStoreId = !!process.env.LEMON_SQUEEZY_STORE_ID;
    
    console.log('🔑 Environment check:', { hasApiKey, hasStoreId });

    // If we don't have the real credentials, return a test checkout URL
    if (!hasApiKey || !hasStoreId) {
      console.log('🚨 Using test mode - missing environment variables');
      
      const testCheckoutUrl = `https://printprev.lemonsqueezy.com/checkout/buy/${variantId}?checkout[custom][user_id]=${userId}&checkout[email]=${userEmail}`;
      
      return NextResponse.json({
        success: true,
        checkoutUrl: testCheckoutUrl,
        message: 'Test mode - Please add Lemon Squeezy credentials to .env',
        test: true,
        planType,
        productName
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
                variant_id: variantId,
                plan_type: planType,
              },
            },
            product_options: {
              redirect_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard?payment=success`,
              receipt_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard?payment=receipt`,
              receipt_button_text: 'Go to Dashboard',
              receipt_thank_you_note: 'Thank you for subscribing to PrintPrev!',
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
      
      // Update subscription status to failed
      await updateSubscriptionStatus(userId, variantId, SubscriptionStatus.INACTIVE, 'Checkout API call failed');
      
      throw new Error(`Lemon Squeezy API returned ${response.status}`);
    }

    const data = await response.json();
    const checkoutUrl = data.data.attributes.url;

    console.log('✅ Real checkout URL created:', checkoutUrl);

    return NextResponse.json({
      success: true,
      checkoutUrl,
      message: 'Checkout created successfully',
      planType,
      productName
    });

  } catch (error) {
    console.error('💥 Checkout API error:', error);
    
    // Return a fallback test URL even if everything fails
    const fallbackUrl = `https://printprev.lemonsqueezy.com/checkout/buy/${variantId}`;
    
    return NextResponse.json({
      success: true,
      checkoutUrl: fallbackUrl,
      message: 'Fallback mode - Using default checkout',
      fallback: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Creates a pending subscription record for tracking
 */
async function createPendingSubscription(
  userId: string, 
  variantId: string, 
  planType: PlanType, 
  productName: string
) {
  try {
    // Check if user already has a pending subscription for this variant
    const existingPending = await prisma.subscription.findFirst({
      where: {
        userid: userId,
        variantId: variantId,
        status: SubscriptionStatus.INACTIVE,
      }
    });

    if (existingPending) {
      console.log('📝 Updating existing pending subscription');
      await prisma.subscription.update({
        where: { id: existingPending.id },
        data: {
          updatedAt: new Date(),
        }
      });
      return;
    }

    // Create new pending subscription
    console.log('📝 Creating new pending subscription');
    await prisma.subscription.create({
      data: {
        userid: userId,
        provider: 'lemon_squeezy',
        variantId: variantId,
        status: SubscriptionStatus.INACTIVE,
        planType: planType,
      }
    });

    // Create initial user status if doesn't exist
    await prisma.userStatus.upsert({
      where: { userid: userId },
      update: {}, // Don't change existing status
      create: {
        userid: userId,
        planType: PlanType.FREE,
        storageUsed: 0,
        storageLimit: 1073741824, // 1GB
        filesUploaded: 0,
        maxFilesPerMonth: 10,
        canUseAdvancedTools: false,
        canRemoveWatermark: false,
        canBulkProcess: false,
      }
    });

    console.log('✅ Pending subscription created for user:', userId);
  } catch (error) {
    console.error('❌ Failed to create pending subscription:', error);
    // Don't throw - we still want to proceed with checkout
  }
}

/**
 * Updates subscription status (for error handling)
 */
async function updateSubscriptionStatus(
  userId: string, 
  variantId: string, 
  status: SubscriptionStatus, 
  reason?: string
) {
  try {
    await prisma.subscription.updateMany({
      where: {
        userid: userId,
        variantId: variantId,
      },
      data: {
        status: status,
        updatedAt: new Date(),
      }
    });
    console.log(`📊 Subscription status updated to ${status} for user:`, userId, reason || '');
  } catch (error) {
    console.error('❌ Failed to update subscription status:', error);
  }
}