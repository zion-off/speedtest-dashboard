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
  const res = NextResponse.json({});

  setCorsHeaders(res);

  if (request.method === "OPTIONS") {
    return res; 
  }

  try {
    const body = await request.json();
    if (!body.testData || !Array.isArray(body.testData)) {
      return NextResponse.json({ error: "Invalid test data format" }, { status: 400 });
    }

    console.log(`Received upload data of size: ${body.testData.length}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling upload:", error);
    return NextResponse.json({ error: "Failed to process upload" }, { status: 500 });
  }
}


