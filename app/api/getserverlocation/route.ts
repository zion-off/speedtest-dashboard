import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Extract the ipAddress from the request body
    const { ipAddress } = await req.json();

    // Validate that the IP address is provided
    if (!ipAddress) {
      return NextResponse.json(
        { error: 'ipAddress is required' },
        { status: 400 }
      );
    }

    // Fetch the server location data from ip-api.com
    const response = await fetch(`http://ip-api.com/json/${ipAddress}`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch server location' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Return the location data
    return NextResponse.json({ location: data });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong while fetching the server location' },
      { status: 500 }
    );
  }
}
