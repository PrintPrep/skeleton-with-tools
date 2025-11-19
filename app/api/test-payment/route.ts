import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, PaymentStatus, PlanType, SubscriptionStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;
    
    console.log('🧪 Test payment request for user:', userId);

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create test payment
    const payment = await prisma.payment.create({
      data: {
        userid: userId,
        provider: 'lemon_squeezy',
        providerChargeId: `test_payment_${Date.now()}`,
        amountCents: 4900,
        status: PaymentStatus.COMPLETED,
        currency: 'USD',
        paidAt: new Date(),
      }
    });

    console.log('✅ Test payment created:', payment.id);

    // Create test subscription
    const subscription = await prisma.subscription.create({
      data: {
        userid: userId,
        provider: 'lemon_squeezy',
        subscriptionId: `test_sub_${Date.now()}`,
        variantId: '1097577',
        status: SubscriptionStatus.ACTIVE,
        planType: PlanType.YEARLY,
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      }
    });

    console.log('✅ Test subscription created:', subscription.id);

    // Update user to Pro
    await prisma.user.update({
      where: { id: userId },
      data: { isPro: true }
    });

    console.log('✅ User upgraded to Pro');

    return NextResponse.json({ 
      success: true, 
      payment: {
        id: payment.id,
        amount: payment.amountCents,
        status: payment.status
      },
      subscription: {
        id: subscription.id,
        planType: subscription.planType,
        status: subscription.status
      },
      message: 'Test payment and subscription created successfully' 
    });

  } catch (error) {
    console.error('❌ Test payment error:', error);
    return NextResponse.json({ 
      error: 'Failed to create test payment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Test payment endpoint is working',
    usage: 'Send POST request with { userId: "your-user-id" }',
    timestamp: new Date().toISOString()
  });
}