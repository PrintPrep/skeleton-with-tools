import { PrismaClient, SubscriptionStatus, PlanType } from '@prisma/client';

const prisma = new PrismaClient();

export async function validateUserSubscription(userId: string): Promise<{
  hasActiveSubscription: boolean;
  currentSubscription: any;
  userStatus: any;
}> {
  const now = new Date();
  
  // Get active subscription
  const activeSubscription = await prisma.subscription.findFirst({
    where: {
      userid: userId,
      status: SubscriptionStatus.ACTIVE,
      currentPeriodEnd: {
        gt: now
      }
    },
    orderBy: { currentPeriodEnd: 'desc' }
  });

  const hasActiveSubscription = !!activeSubscription;

  // Get or create user status
  let userStatus = await prisma.userStatus.findUnique({
    where: { userid: userId }
  });

  if (!userStatus) {
    userStatus = await prisma.userStatus.create({
      data: {
        userid: userId,
        planType: PlanType.FREE,
        ...getFeatureFlagsForPlan(PlanType.FREE, false)
      }
    });
  }

  // Update user's Pro status
  await prisma.user.update({
    where: { id: userId },
    data: { 
      isPro: hasActiveSubscription && activeSubscription?.planType !== PlanType.FREE 
    }
  });

  // Update user status with correct features
  if (hasActiveSubscription && userStatus.planType !== activeSubscription.planType) {
    userStatus = await prisma.userStatus.update({
      where: { userid: userId },
      data: getFeatureFlagsForPlan(activeSubscription.planType, true)
    });
  } else if (!hasActiveSubscription && userStatus.planType !== PlanType.FREE) {
    userStatus = await prisma.userStatus.update({
      where: { userid: userId },
      data: getFeatureFlagsForPlan(PlanType.FREE, false)
    });
  }

  return {
    hasActiveSubscription,
    currentSubscription: activeSubscription,
    userStatus
  };
}

export function getFeatureFlagsForPlan(planType: PlanType, isActive: boolean) {
  if (!isActive || planType === PlanType.FREE) {
    return {
      planType: PlanType.FREE,
      storageLimit: 1073741824, // 1GB
      maxFilesPerMonth: 10,
      canUseAdvancedTools: false,
      canRemoveWatermark: false,
      canBulkProcess: false,
    };
  }

  const proFeatures = {
    planType,
    storageLimit: 5368709120, // 5GB
    maxFilesPerMonth: 1000, // Unlimited effectively
    canUseAdvancedTools: true,
    canRemoveWatermark: true,
    canBulkProcess: true,
  };

  // Lifetime gets extra features
  if (planType === PlanType.LIFETIME) {
    return {
      ...proFeatures,
      storageLimit: 10737418240, // 10GB
    };
  }

  return proFeatures;
}

export async function canUserPerformAction(userId: string, action: string): Promise<boolean> {
  const { userStatus, hasActiveSubscription } = await validateUserSubscription(userId);
  
  if (!userStatus) return false;

  switch (action) {
    case 'upload_file':
      return userStatus.storageUsed < userStatus.storageLimit;
    
    case 'use_advanced_tool':
      return userStatus.canUseAdvancedTools;
    
    case 'remove_watermark':
      return userStatus.canRemoveWatermark;
    
    case 'bulk_process':
      return userStatus.canBulkProcess;
    
    case 'premium_feature':
      return hasActiveSubscription;
    
    default:
      return true;
  }
}

export async function updateStorageUsage(userId: string, fileSizeBytes: number) {
  try {
    await prisma.userStatus.update({
      where: { userid: userId },
      data: {
        storageUsed: {
          increment: fileSizeBytes
        }
      }
    });
    return true;
  } catch (error) {
    console.error('Failed to update storage usage:', error);
    return false;
  }
}