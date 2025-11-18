// app/api/test-checkout/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: 'Test endpoint works',
    checkoutUrl: 'https://lemonsqueezy.com/checkout/buy/test',
    test: true
  });
}