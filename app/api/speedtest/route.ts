import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

async function getServerLocation() {
  try {
    const response = await fetch("http://ip-api.com/json/");
    const data = await response.json();
    return {
      country: data.country,
      region: data.regionName,
      city: data.city,
      lat: data.lat,
      lon: data.lon,
      isp: data.isp,
    };
  } catch (error) {
    console.error("Error fetching server location:", error);
    return null;
  }
}

// Function to set CORS headers
const setCorsHeaders = (res: NextResponse) => {
  res.headers.set(
    "Access-Control-Allow-Origin",
    "https://speedmap.zzzzion.com"
  );
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
};



export async function GET(request: NextRequest) {
  const res = NextResponse.json({});

  setCorsHeaders(res);

  if (request.method === "OPTIONS") {
    return res; 
  }

  const { searchParams } = new URL(request.url);
  const responseType = searchParams.get("type");

  if (responseType === "test") {
    // Path to your pre-generated data file
    const filePath = path.join(process.cwd(), './public/data.bin');

    // Read the pre-generated data
    const testData = fs.readFileSync(filePath);
    const serverLocation = await getServerLocation();
    
    return NextResponse.json({ testData: Array.from(testData), serverLocation });
  } else {
    return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
  }
}


export async function POST(request: NextRequest) {
  // Set up response
  const res = NextResponse.json({});

  // Set CORS headers
  setCorsHeaders(res);

  // Handle preflight request (OPTIONS)
  if (request.method === "OPTIONS") {
    return NextResponse.json(null, { status: 204 });
  }

  // Parse incoming JSON data
  try {
    const body = await request.json();
    const { testData } = body;

    // If testData is large, confirm its receipt and success
    if (testData && testData.length > 0) {
      return NextResponse.json({
        success: true,
        receivedSize: `${(testData.length / 1_000_000).toFixed(2)} MB`
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'No data received'
      }, { status: 400 });
    }
  } catch (error) {
    // Handle error in parsing JSON body
    return NextResponse.json({
      success: false,
      error: 'Failed to parse request body',
    }, { status: 500 });
  }
}

