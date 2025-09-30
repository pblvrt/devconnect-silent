import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if LiveKit credentials are configured
    const hasCredentials = !!(
      process.env.LIVEKIT_API_KEY &&
      process.env.LIVEKIT_API_SECRET &&
      process.env.LIVEKIT_URL
    );

    if (!hasCredentials) {
      return NextResponse.json(
        {
          status: "error",
          message: "LiveKit credentials not configured",
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        api: "operational",
        livekit: hasCredentials ? "configured" : "not_configured",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
