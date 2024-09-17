import { NextRequest, NextResponse } from 'next/server';

// Generate a string of random data
function generateRandomData(size: number): string {
  return Array(size).fill('0').join('');
}

async function getServerLocation() {
  try {
    const response = await fetch('http://ip-api.com/json/');
    const data = await response.json();
    return {
      country: data.country,
      region: data.regionName,
      city: data.city,
      lat: data.lat,
      lon: data.lon,
      isp: data.isp
    };
  } catch (error) {
    console.error('Error fetching server location:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const testData = generateRandomData(10000000); // 10 MB
  const serverLocation = await getServerLocation();

  return NextResponse.json({ testData, serverLocation });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { testData } = body;

  // Here we're just acknowledging receipt of the data
  // In a real-world scenario, you might want to do some validation

  return NextResponse.json({ success: true });
}