import { NextRequest, NextResponse } from "next/server";

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

// Helper function to generate random data
function generateRandomData(size: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < size; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function GET(request: NextRequest) {
  // Set CORS headers (optional, if needed)
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  });

  if (request.method === "OPTIONS") {
    // Handle preflight request
    return new NextResponse(null, { status: 204, headers });
  }

  const { searchParams } = new URL(request.url);
  const responseType = searchParams.get("type");

  if (responseType === "test") {
    const encoder = new TextEncoder();
    const serverLocation = await getServerLocation();
    const startTime = Date.now(); // Measure request start time

    // Streaming response
    const stream = new ReadableStream({
      start(controller) {
        // Stream 1MB chunks for a total of 25 MB
        for (let i = 0; i < 25; i++) {
          const chunk = generateRandomData(1000000); // 1 MB chunk
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      }
    });

    const responseTime = Date.now(); // Measure response end time

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'X-Server-Location': JSON.stringify(serverLocation),
        'X-Start-Time': startTime.toString(),
        'X-Response-Time': responseTime.toString(),
      }
    });
  } else {
    // Return an error for invalid request type
    return new NextResponse(
      JSON.stringify({ error: "Invalid request type" }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
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

