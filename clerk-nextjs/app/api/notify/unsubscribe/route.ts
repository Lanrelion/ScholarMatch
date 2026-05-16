import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { endpoint } = await req.json()

    if (!endpoint) {
      return new NextResponse("Missing endpoint", { status: 400 })
    }

    await db.pushSubscription.deleteMany({
      where: { 
        endpoint,
        userId
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Push Unsubscribe Error:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
