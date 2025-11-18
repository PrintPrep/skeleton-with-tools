// app/api/debug-env/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Don't log actual API key for security
  const envInfo = {
    LEMON_SQUEEZY_API_KEY_EXISTS: !!process.env.LEMON_SQUEEZY_API_KEY,
    LEMON_SQUEEZY_API_KEY_LENGTH: process.env.LEMON_SQUEEZY_API_KEY?.length,
    LEMON_SQUEEZY_STORE_ID: process.env.LEMON_SQUEEZY_STORE_ID,
    LEMON_SQUEEZY_STORE_ID_VALID: process.env.LEMON_SQUEEZY_STORE_ID && process.env.LEMON_SQUEEZY_STORE_ID !== 'your_store_id_here',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NODE_ENV: process.env.NODE_ENV,
  };

  console.log('🔧 Environment check:', envInfo);

  return NextResponse.json(envInfo);
}