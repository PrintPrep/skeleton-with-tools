// app/api/users/[userId]/storage/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Await the params Promise
    const { userId } = await params;
    
    console.log('🔧 Fetching storage for user:', userId);

    // For now, return mock data
    const storageData = {
      used: 2.4,
      total: 50,
      files: 12,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(storageData);
  } catch (error: unknown) {
    console.error('❌ Error fetching storage usage:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}