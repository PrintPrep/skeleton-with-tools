// app/api/webhooks/lemon-squeezy/route.ts - ENHANCED DEBUG VERSION
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, SubscriptionStatus, PaymentStatus, PlanType } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

const VARIANT_TO_PLAN: { [key: string]: PlanType } = {
  '1097562': PlanType.MONTHLY,
  '1097577': PlanType.YEARLY,  
  '1097578': PlanType.LIFETIME,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    const signature = request.headers.get('x-signature');

    console.log('🔧 Webhook received - Signature exists:', !!signature);
    console.log('🔧 Webhook body length:', body.length);

    if (!secret) {
      console.error('❌ Missing LEMON_SQUEEZY_WEBHOOK_SECRET');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Verify webhook signature
    const computedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    console.log('🔧 Signature verification:', {
      received: signature?.substring(0, 20) + '...',
      computed: computedSignature.substring(0, 20) + '...',
      matches: signature === computedSignature
    });

    if (signature !== computedSignature) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data = JSON.parse(body);
    const eventName = data.meta.event_name;
    const eventData = data.data;

    console.log('🔄 Lemon Squeezy Webhook Event:', {
      eventName,
      eventId: eventData.id,
      customData: data.meta.custom_data,
      fullMeta: JSON.stringify(data.meta, null, 2)
    });

    try {
      switch (eventName) {
        case 'order_created':
          await handleOrderCreated(eventData, data.meta);
          break;
        
        case 'subscription_created':
          await handleSubscriptionCreated(eventData, data.meta);
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

async function handleOrderCreated(orderData: any, metaData: any) {
  console.log('💰 Processing order:', orderData.id);
  console.log('🔍 Order meta data:', metaData);
  console.log('🔍 Order attributes:', orderData.attributes);
  
  // Get user_id from custom data
  const userId = metaData.custom_data?.user_id;
  
  console.log('🔍 Extracted user_id:', userId);
  console.log('🔍 Full custom_data:', metaData.custom_data);
  
  if (!userId) {
    console.error('❌ No user ID found in order custom data');
    console.error('❌ Full meta data:', JSON.stringify(metaData, null, 2));
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

  console.log('✅ User found for order:', user.email);

  // Create payment record
  const payment = await prisma.payment.create({
    data: {
      userid: userId,
      provider: 'lemon_squeezy',
      providerChargeId: orderData.id,
      amountCents: Math.round(parseFloat(orderData.attributes.total) * 100),
      status: PaymentStatus.COMPLETED,
      currency: orderData.attributes.currency,
      paidAt: new Date(orderData.attributes.created_at),
    }
  });

  console.log('✅ Payment record created:', payment);

  // Check if this is a lifetime purchase (one-time)
  const orderItems = orderData.attributes.order_items || [];
  const lifetimeVariant = orderItems.find((item: any) => 
    item.variant_id.toString() === '1097578'
  );

  if (lifetimeVariant) {
    console.log('🎉 Lifetime purchase detected');
    
    // Create lifetime subscription
    const subscription = await prisma.subscription.create({
      data: {
        userid: userId,
        provider: 'lemon_squeezy',
        subscriptionId: `lifetime_${orderData.id}`,
        variantId: '1097578',
        status: SubscriptionStatus.ACTIVE,
        planType: PlanType.LIFETIME,
        currentPeriodEnd: null, // Lifetime never expires
      }
    });
    
    console.log('✅ Lifetime subscription created:', subscription);
    
    // Update user features
    await updateUserFeatures(userId, PlanType.LIFETIME, true);
    console.log('✅ User features updated for lifetime plan');
  }
}

async function handleSubscriptionCreated(subscriptionData: any, metaData: any) {
  console.log('🚀 Processing subscription creation:', subscriptionData.id);
  console.log('🔍 Subscription meta:', metaData);
  
  // Get user_id from custom data
  const userId = metaData.custom_data?.user_id;
  
  if (!userId) {
    console.error('❌ No user ID found in subscription meta:', metaData);
    return;
  }

  const variantId = subscriptionData.attributes.variant_id.toString();
  const planType = VARIANT_TO_PLAN[variantId] || PlanType.MONTHLY;

  console.log('🔧 Creating subscription for user:', userId, 'plan:', planType);

  // Create or update subscription
  const subscription = await prisma.subscription.upsert({
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

  console.log('✅ Subscription created/updated:', subscription);

  // Update user status and features
  await updateUserFeatures(userId, planType, true);
  
  console.log('✅ Subscription activated for user:', userId);
}

// ... keep other functions the same but add more debug logs ...

async function updateUserFeatures(userId: string, planType: PlanType, isActive: boolean) {
  console.log('🔧 Updating user features:', { userId, planType, isActive });
  
  // Update user's pro status
  await prisma.user.update({
    where: { id: userId },
    data: { isPro: isActive && planType !== PlanType.FREE }
  });

  // Update or create user status with feature flags
  const userStatusData = getFeatureFlagsForPlan(planType, isActive);
  
  const userStatus = await prisma.userStatus.upsert({
    where: { userid: userId },
    update: userStatusData,
    create: {
      userid: userId,
      planType: planType,
      ...userStatusData
    }
  });

  console.log('✅ UserStatus updated:', userStatus);
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
    maxFilesPerMonth: 1000,
    canUseAdvancedTools: true,
    canRemoveWatermark: true,
    canBulkProcess: true,
  };

  if (planType === PlanType.LIFETIME) {
    return {
      ...proFeatures,
      storageLimit: 10737418240, // 10GB
    };
  }

  return proFeatures;
}