// app/api/webhooks/lemon-squeezy/debug/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headers = Object.fromEntries(request.headers.entries());
    
    console.log('🔧 DEBUG Webhook Received:', {
      headers: headers,
      body: body,
      bodyLength: body.length
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Debug webhook received',
      headers: headers,
      body: JSON.parse(body)
    });
  } catch (error) {
    console.error('❌ Debug webhook error:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}