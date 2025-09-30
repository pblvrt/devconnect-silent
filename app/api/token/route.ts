import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const room = searchParams.get("room");
  const role = searchParams.get("role");

  if (!room || !role) {
    return NextResponse.json(
      { error: "Missing room or role parameter" },
      { status: 400 }
    );
  }

  if (!["publisher", "listener"].includes(role)) {
    return NextResponse.json(
      { error: "Invalid role. Must be publisher or listener" },
      { status: 400 }
    );
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "LiveKit credentials not configured" },
      { status: 500 }
    );
  }

  try {
    const token = new AccessToken(apiKey, apiSecret, {
      identity: `${role}-${Date.now()}`,
      ttl: role === "publisher" ? 4 * 60 * 60 : 2 * 60 * 60, // 4 hours for publisher, 2 hours for listener
    });

    token.addGrant({
      room,
      roomJoin: true,
      canPublish: role === "publisher",
      canSubscribe: role === "listener",
      canPublishData: false,
      canUpdateOwnMetadata: false,
    });

    const jwt = await token.toJwt();

    return NextResponse.json({ token: jwt });
  } catch (error) {
    console.error("Error generating token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
