import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, SubscriptionStatus, PaymentStatus, PlanType } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Map variant IDs to plan types
const VARIANT_TO_PLAN: { [key: string]: PlanType } = {
  '1097562': PlanType.MONTHLY,  // Pro Monthly
  '1097577': PlanType.YEARLY,   // Pro Yearly  
  '1097578': PlanType.LIFETIME, // Lifetime
};


export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    const signature = request.headers.get('x-signature');

    if (!secret) {
      console.error('Missing LEMON_SQUEEZY_WEBHOOK_SECRET');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Verify webhook signature
    const computedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (signature !== computedSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data = JSON.parse(body);
    const eventName = data.meta.event_name;
    const eventData = data.data;

    console.log('🔄 Lemon Squeezy Webhook:', eventName, eventData.id);

    try {
      // Handle different webhook events
      switch (eventName) {
        case 'order_created':
          await handleOrderCreated(eventData);
          break;
        
        case 'subscription_created':
          await handleSubscriptionCreated(eventData);
          break;
        
        case 'subscription_updated':
          await handleSubscriptionUpdated(eventData);
          break;
        
        case 'subscription_cancelled':
          await handleSubscriptionCancelled(eventData);
          break;
        
        case 'subscription_expired':
          await handleSubscriptionExpired(eventData);
          break;
        
        default:
          console.log('🤷 Unhandled event:', eventName);
      }

      return NextResponse.json({ success: true, processed: true });
    } catch (processingError) {
      console.error('❌ Webhook processing error:', processingError);
      return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
    }

  } catch (error) {
    console.error('💥 Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleOrderCreated(orderData: any) {
  console.log('💰 Processing order:', orderData.id);
  
  const customData = orderData.attributes.first_order_item?.product_options?.custom;
  const userId = customData?.user_id;
  
  if (!userId) {
    console.error('❌ No user ID in order custom data');
    return;
  }

  // Verify user exists
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    console.error('❌ User not found:', userId);
    return;
  }

  // Create payment record
  await prisma.payment.create({
    data: {
      userid: userId,
      providerChargeId: orderData.id,
      amountCents: Math.round(orderData.attributes.total * 100),
      status: PaymentStatus.COMPLETED,
      currency: orderData.attributes.currency,
      paidAt: new Date(orderData.attributes.created_at),
    }
  });

  console.log('✅ Payment record created for user:', userId);
}

async function handleSubscriptionCreated(subscriptionData: any) {
  console.log('🚀 Processing subscription creation:', subscriptionData.id);
  
  const customerData = subscriptionData.attributes.urls.customer_portal;
  // Extract user ID from custom data (we'll set this in checkout)
  const userId = await findUserIdFromSubscription(subscriptionData);
  
  if (!userId) {
    console.error('❌ Could not find user for subscription');
    return;
  }

  const variantId = subscriptionData.attributes.variant_id.toString();
  const planType = VARIANT_TO_PLAN[variantId] || PlanType.MONTHLY;

  // Create or update subscription
  await prisma.subscription.upsert({
    where: { subscriptionId: subscriptionData.id },
    update: {
      status: SubscriptionStatus.ACTIVE,
      planType: planType,
      currentPeriodEnd: new Date(subscriptionData.attributes.renews_at),
      updatedAt: new Date(),
    },
    create: {
      userid: userId,
      provider: 'lemon_squeezy',
      subscriptionId: subscriptionData.id,
      variantId: variantId,
      status: SubscriptionStatus.ACTIVE,
      planType: planType,
      currentPeriodEnd: new Date(subscriptionData.attributes.renews_at),
    },
  });

  // Update user status and features
  await updateUserFeatures(userId, planType, true);
  
  console.log('✅ Subscription activated for user:', userId);
}

async function handleSubscriptionUpdated(subscriptionData: any) {
  console.log('📝 Processing subscription update:', subscriptionData.id);
  
  const userId = await findUserIdFromSubscription(subscriptionData);
  if (!userId) return;

  const status = mapSubscriptionStatus(subscriptionData.attributes.status);
  const variantId = subscriptionData.attributes.variant_id.toString();
  const planType = VARIANT_TO_PLAN[variantId] || PlanType.MONTHLY;

  await prisma.subscription.update({
    where: { subscriptionId: subscriptionData.id },
    data: {
      status: status,
      planType: planType,
      currentPeriodEnd: new Date(subscriptionData.attributes.renews_at),
      cancelAtPeriodEnd: subscriptionData.attributes.cancelled,
      updatedAt: new Date(),
    },
  });

  const isActive = status === SubscriptionStatus.ACTIVE;
  await updateUserFeatures(userId, planType, isActive);

  console.log('✅ Subscription updated for user:', userId, 'Status:', status);
}

async function handleSubscriptionCancelled(subscriptionData: any) {
  console.log('⏸️ Processing subscription cancellation:', subscriptionData.id);
  
  const userId = await findUserIdFromSubscription(subscriptionData);
  if (!userId) return;

  await prisma.subscription.update({
    where: { subscriptionId: subscriptionData.id },
    data: {
      status: SubscriptionStatus.CANCELLED,
      cancelAtPeriodEnd: true,
      updatedAt: new Date(),
    },
  });

  // User keeps features until period end
  console.log('✅ Subscription cancelled for user:', userId);
}

async function handleSubscriptionExpired(subscriptionData: any) {
  console.log('❌ Processing subscription expiration:', subscriptionData.id);
  
  const userId = await findUserIdFromSubscription(subscriptionData);
  if (!userId) return;

  await prisma.subscription.update({
    where: { subscriptionId: subscriptionData.id },
    data: {
      status: SubscriptionStatus.EXPIRED,
      updatedAt: new Date(),
    },
  });

  // Downgrade user to free
  await updateUserFeatures(userId, PlanType.FREE, false);
  console.log('✅ Subscription expired, user downgraded:', userId);
}

// Helper functions
async function findUserIdFromSubscription(subscriptionData: any): Promise<string | null> {
  // In a real implementation, you might need to:
  // 1. Look up the order associated with this subscription
  // 2. Check the order's custom data for user_id
  // 3. Or maintain a mapping table
  
  // For now, we'll try to find by subscription ID in our database
  const existingSub = await prisma.subscription.findUnique({
    where: { subscriptionId: subscriptionData.id },
    select: { userid: true }
  });
  
  return existingSub?.userid || null;
}

function mapSubscriptionStatus(lsStatus: string): SubscriptionStatus {
  const statusMap: { [key: string]: SubscriptionStatus } = {
    'active': SubscriptionStatus.ACTIVE,
    'past_due': SubscriptionStatus.PAST_DUE,
    'unpaid': SubscriptionStatus.UNPAID,
    'cancelled': SubscriptionStatus.CANCELLED,
    'expired': SubscriptionStatus.EXPIRED,
    'on_trial': SubscriptionStatus.TRIALING,
  };
  
  return statusMap[lsStatus] || SubscriptionStatus.INACTIVE;
}

async function updateUserFeatures(userId: string, planType: PlanType, isActive: boolean) {
  // Update user's pro status
  await prisma.user.update({
    where: { id: userId },
    data: { isPro: isActive && planType !== PlanType.FREE }
  });

  // Update or create user status with feature flags
  const userStatusData = getFeatureFlagsForPlan(planType, isActive);
  
  await prisma.userStatus.upsert({
    where: { userid: userId },
    update: userStatusData,
    create: {
      userid: userId,
      planType: planType,
      ...userStatusData
    }
  });
}

function getFeatureFlagsForPlan(planType: PlanType, isActive: boolean) {
  if (!isActive || planType === PlanType.FREE) {
    return {
      storageLimit: 1073741824, // 1GB
      maxFilesPerMonth: 10,
      canUseAdvancedTools: false,
      canRemoveWatermark: false,
      canBulkProcess: false,
    };
  }

  const proFeatures = {
    storageLimit: 5368709120, // 5GB
    maxFilesPerMonth: 1000, // Unlimited effectively
    canUseAdvancedTools: true,
    canRemoveWatermark: true,
    canBulkProcess: true,
  };

  // Lifetime gets extra features maybe?
  if (planType === PlanType.LIFETIME) {
    return {
      ...proFeatures,
      storageLimit: 10737418240, // 10GB
    };
  }

  return proFeatures;
}