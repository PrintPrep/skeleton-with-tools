// app/api/debug-lemon/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.lemonsqueezy.com/v1/stores', {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        success: true,
        stores: data.data,
        yourStoreId: process.env.LEMON_SQUEEZY_STORE_ID,
        storeExists: data.data.some((store: any) => store.id === process.env.LEMON_SQUEEZY_STORE_ID)
      });
    } else {
      const error = await response.text();
      return NextResponse.json({
        success: false,
        error: `API returned ${response.status}`,
        details: error
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'API call failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}