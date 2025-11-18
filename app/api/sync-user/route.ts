// app/api/sync-user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { clerkId, email, name } = await request.json();

    if (!clerkId || !email) {
      return NextResponse.json(
        { error: 'clerkId and email are required' },
        { status: 400 }
      );
    }

    const placeholderPassword = 'clerk_oauth_user';
    
    const user = await prisma.user.upsert({
      where: { email: email },
      update: {
        name: name,
      },
      create: {
        id: clerkId,
        email: email,
        name: name || null,
        password: placeholderPassword,
        role: 'user',
      },
    });
    
    console.log('User synced to database:', user.id);
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error syncing user to database:', error);
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    );
  }
}