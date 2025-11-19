import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Simple GET test is working!',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Simple POST test is working!',
    timestamp: new Date().toISOString()
  });
}