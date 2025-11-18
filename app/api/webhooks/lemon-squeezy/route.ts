// app/api/webhooks/lemon-squeezy/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    const signature = request.headers.get('x-signature');

    // Verify webhook signature
    const computedSignature = crypto
      .createHmac('sha256', secret!)
      .update(body)
      .digest('hex');

    if (signature !== computedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data = JSON.parse(body);
    const eventName = data.meta.event_name;
    const eventData = data.data;

    console.log('Lemon Squeezy Webhook:', eventName, eventData);

    // Handle different webhook events
    switch (eventName) {
      case 'order_created':
      case 'order_refunded':
        await handleOrderEvent(eventData, eventName);
        break;
      
      case 'subscription_created':
      case 'subscription_updated':
      case 'subscription_cancelled':
        await handleSubscriptionEvent(eventData, eventName);
        break;
      
      default:
        console.log('Unhandled event:', eventName);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleOrderEvent(orderData: any, eventName: string) {
  const userId = orderData.attributes.first_order_item?.product_options?.custom?.user_id;
  const amount = orderData.attributes.total;
  const status = eventName === 'order_refunded' ? 'refunded' : 'paid';

  if (userId) {
    await prisma.payment.create({
      data: {
        userid: userId,
        provider: 'lemon_squeezy',
        providerChargeId: orderData.id,
        amountCents: Math.round(amount * 100),
        status: status,
      },
    });
  }
}

async function handleSubscriptionEvent(subscriptionData: any, eventName: string) {
  const userId = subscriptionData.attributes.urls.customer_portal; // You might need to adjust this
  const status = subscriptionData.attributes.status;
  
  if (userId) {
    // Update user's Pro status
    const isPro = status === 'active' || status === 'trialing';
    
    await prisma.user.update({
      where: { id: userId },
      data: { isPro },
    });

    // Create/update subscription record
    await prisma.subscription.upsert({
      where: { subscriptionId: subscriptionData.id },
      update: {
        status: status,
        currentPeriodEnd: new Date(subscriptionData.attributes.renews_at),
        updatedAt: new Date(),
      },
      create: {
        userid: userId,
        provider: 'lemon_squeezy',
        subscriptionId: subscriptionData.id,
        variantId: subscriptionData.attributes.variant_id,
        status: status,
        currentPeriodEnd: new Date(subscriptionData.attributes.renews_at),
      },
    });
  }
}