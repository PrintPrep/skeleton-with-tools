// app/api/debug-checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('🔧 Debug endpoint received:', body);
    
    return NextResponse.json({
      success: true,
      message: 'Debug endpoint works',
      received: body,
      checkoutUrl: 'https://lemonsqueezy.com/checkout/buy/test',
      debug: true
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Debug endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}