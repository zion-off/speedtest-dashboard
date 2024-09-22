import { NextRequest, NextResponse } from "next/server";

// Generate a string of random data
function generateRandomData(size: number): string {
  return Array(size).fill("0").join("");
}

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

async function getUserISP(request: NextRequest) {
  try {
    let userIP =
      request.headers.get("CF-Connecting-IP") ||
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.ip;

    if (process.env.TEST_IP) {
      console.log("Using test IP:", process.env.TEST_IP);
      userIP = process.env.TEST_IP;
    }

    const response = await fetch(
      `https://api.ipdata.co/${userIP}?api-key=${process.env.IP_DATA_API_KEY}`
    );

    if (!response.ok) {
      console.error(
        "Failed to fetch ISP:",
        response.status,
        await response.text()
      );
      return null;
    }

    const data = await response.json();
    return data.asn.name;
  } catch (error) {
    console.error("Error fetching user ISP:", error);
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
  const res = NextResponse.json({}); // Initialize response

  // Set CORS headers
  setCorsHeaders(res);

  // Handle preflight request
  if (request.method === "OPTIONS") {
    return res; // Return an empty response for preflight
  }

  const { searchParams } = new URL(request.url);
  const responseType = searchParams.get("type"); // Determines the type of response

  if (responseType === "test") {
    const testData = generateRandomData(30000000); // 25 MB
    const serverLocation = await getServerLocation();
    return NextResponse.json({ testData, serverLocation });
  } else if (responseType === "isp") {
    const userISP = await getUserISP(request);
    return NextResponse.json({ userISP });
  } else {
    // Return an error for invalid request type
    return NextResponse.json(
      { error: "Invalid request type" },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  const res = NextResponse.json({}); // Initialize response

  // Set CORS headers
  setCorsHeaders(res);

  // Handle preflight request
  if (request.method === "OPTIONS") {
    return res; // Return an empty response for preflight
  }

  const body = await request.json();
  const { testData } = body;

  return NextResponse.json({ success: true });
}
