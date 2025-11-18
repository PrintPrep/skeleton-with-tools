// app/api/test-lemon/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔧 Testing Lemon Squeezy API key...');
    
    const response = await fetch('https://api.lemonsqueezy.com/v1/stores', {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
      },
    });

    console.log('🔧 API test response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({ 
        success: true, 
        message: 'API key is valid',
        stores: data.data 
      });
    } else {
      const error = await response.text();
      return NextResponse.json({ 
        success: false, 
        error: `API key test failed: ${response.status}`,
        details: error
      }, { status: 400 });
    }
  } catch (error: unknown) {
    console.error('❌ API test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'API test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}