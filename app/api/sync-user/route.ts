// app/api/sync-user/route.ts - UPDATED VERSION
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, PlanType } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🔧 Sync user request body:', body);

    const { clerkId, email, name } = body;

    if (!clerkId || !email) {
      console.error('❌ Missing required fields:', { clerkId, email });
      return NextResponse.json(
        { error: 'clerkId and email are required' },
        { status: 400 }
      );
    }

    const placeholderPassword = 'clerk_oauth_user';
    
    console.log('🔧 Attempting database upsert for user:', clerkId, email);

    // First, check if a user already exists with this email but different ID
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    let resultUser;
    let action;

    if (existingUser) {
      console.log('🔧 User already exists with this email:', existingUser);
      
      // If the existing user has a different ID, we need to handle this conflict
      if (existingUser.id !== clerkId) {
        console.warn('⚠️ Email conflict: Different user ID for same email');
        
        // Update the existing user with the new Clerk ID
        resultUser = await prisma.user.update({
          where: { email: email },
          data: {
            id: clerkId, // Update the ID to match Clerk ID
            name: name,
            role: 'user', // Consistent role
          },
        });
        action = 'updated_existing';
      } else {
        // Same user, just update the name if needed
        resultUser = await prisma.user.update({
          where: { id: clerkId },
          data: {
            name: name,
            role: 'user', // Consistent role
          },
        });
        action = 'updated';
      }
    } else {
      // No existing user, create new one
      resultUser = await prisma.user.create({
        data: {
          id: clerkId,
          email: email,
          name: name || null,
          password: placeholderPassword,
          role: 'user', // Consistent role
          isPro: false,
        },
      });
      action = 'created';
    }

    // CRITICAL: Ensure UserStatus record exists
    await prisma.userStatus.upsert({
      where: { userid: clerkId },
      update: {},
      create: {
        userid: clerkId,
        planType: PlanType.FREE,
        storageUsed: 0,
        storageLimit: 1073741824, // 1GB
        filesUploaded: 0,
        maxFilesPerMonth: 10,
        canUseAdvancedTools: false,
        canRemoveWatermark: false,
        canBulkProcess: false,
      },
    });

    console.log('✅ User synced successfully:', resultUser);
    return NextResponse.json({ 
      success: true, 
      user: resultUser, 
      action: action 
    });

  } catch (error: unknown) {
    console.error('❌ Error in sync-user API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to sync user', details: errorMessage },
      { status: 500 }
    );
  }
}