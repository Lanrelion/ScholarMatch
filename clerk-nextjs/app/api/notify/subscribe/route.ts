import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const subscription = await req.json();
    
    if (!subscription.endpoint || !subscription.keys) {
      return NextResponse.json({ error: "Invalid subscription data" }, { status: 400 });
    }

    // Currently we don't have a Prisma model for PushSubscription, 
    // so we just acknowledge it successfully.
    // In the future, save this to the database to enable server push notifications.
    console.log(`[Push] Received new subscription for user ${userId}`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Push subscription save error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
