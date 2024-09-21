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
    const userIP =
      request.ip || request.headers.get("x-forwarded-for")?.split(",")[0] || "";
    const response = await fetch(
      `https://api.ipdata.co/${userIP}?api-key=${process.env.IP_DATA_API_KEY}`
    );
    const data = await response.json();
    return data.asn.name;
  } catch (error) {
    console.error("Error fetching user ISP:", error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const testData = generateRandomData(25000000); // 30 MB
  const serverLocation = await getServerLocation();
  const userISP = await getUserISP(request);

  console.log(userISP)
  return NextResponse.json({ testData, serverLocation, userISP });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { testData } = body;

  return NextResponse.json({ success: true });
}
