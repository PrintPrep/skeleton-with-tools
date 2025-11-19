import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { validateUserSubscription, getUserFeatures } from '@/lib/subscription-utils';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Validate subscription status
    const hasActiveSubscription = await validateUserSubscription(userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE'
          },
          orderBy: { currentPeriodEnd: 'desc' },
          take: 1
        },
        userStatus: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Ensure userStatus exists
    let userStatus = user.userStatus;
    if (!userStatus) {
      userStatus = await getUserFeatures(userId);
    }

    const response = {
      id: user.id,
      email: user.email,
      name: user.name,
      isPro: user.isPro,
      hasActiveSubscription,
      currentSubscription: user.subscriptions[0] || null,
      features: userStatus,
      storage: {
        used: userStatus.storageUsed,
        limit: userStatus.storageLimit,
        percentage: Math.round((userStatus.storageUsed / userStatus.storageLimit) * 100)
      }
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error('❌ Error fetching user status:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}