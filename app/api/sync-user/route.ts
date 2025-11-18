// app/api/sync-user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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

    if (existingUser) {
      console.log('🔧 User already exists with this email:', existingUser);
      
      // If the existing user has a different ID, we need to handle this conflict
      if (existingUser.id !== clerkId) {
        console.warn('⚠️ Email conflict: Different user ID for same email');
        
        // Option 1: Update the existing user with the new Clerk ID (recommended)
        // This ensures data consistency
        const updatedUser = await prisma.user.update({
          where: { email: email },
          data: {
            id: clerkId, // Update the ID to match Clerk ID
            name: name,
          },
        });
        
        console.log('✅ Updated existing user with new Clerk ID:', updatedUser);
        return NextResponse.json({ success: true, user: updatedUser, action: 'updated_existing' });
      } else {
        // Same user, just update the name if needed
        const updatedUser = await prisma.user.update({
          where: { id: clerkId },
          data: {
            name: name,
          },
        });
        
        console.log('✅ Updated existing user:', updatedUser);
        return NextResponse.json({ success: true, user: updatedUser, action: 'updated' });
      }
    } else {
      // No existing user, create new one
      const newUser = await prisma.user.create({
        data: {
          id: clerkId,
          email: email,
          name: name || null,
          password: placeholderPassword,
          role: 'user',
          isPro: false,
        },
      });
      
      console.log('✅ Created new user:', newUser);
      return NextResponse.json({ success: true, user: newUser, action: 'created' });
    }
  } catch (error: unknown) {
    console.error('❌ Error in sync-user API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to sync user', details: errorMessage },
      { status: 500 }
    );
  }
}