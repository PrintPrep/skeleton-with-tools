import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.text();
  
  console.log('🧪 TEST WEBHOOK RECEIVED:', {
    body: body.substring(0, 1000),
    headers: Object.fromEntries(request.headers),
    timestamp: new Date().toISOString()
  });

  return NextResponse.json({ 
    success: true, 
    message: 'Test webhook received',
    receivedAt: new Date().toISOString()
  });
}