import { NextRequest, NextResponse } from 'next/server';

// Generate a string of random data
function generateRandomData(size: number): string {
  return Array(size).fill('0').join('');
}

export async function GET(request: NextRequest) {
  const testData = generateRandomData(10000000);

  return NextResponse.json({ testData });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { testData } = body;

  return NextResponse.json({ success: true });
}