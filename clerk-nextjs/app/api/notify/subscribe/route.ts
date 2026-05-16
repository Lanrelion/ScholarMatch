import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { endpoint, keys } = await req.json()

    if (!endpoint || !keys?.auth || !keys?.p256dh) {
      return new NextResponse("Missing subscription details", { status: 400 })
    }

    await db.pushSubscription.upsert({
      where: { endpoint },
      create: {
        userId,
        endpoint,
        auth: keys.auth,
        p256dh: keys.p256dh
      },
      update: {
        userId,
        auth: keys.auth,
        p256dh: keys.p256dh
      }
    })

    return new NextResponse(null, { status: 201 })
  } catch (error) {
    console.error("Push Subscription Error:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
