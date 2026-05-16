import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { crawlQueue } from "@/lib/crawlQueue"
import { SEED_URLS } from "@/lib/seedUrls"

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    // Security Model: Gate by specific Clerk user ID
    if (userId !== process.env.ADMIN_USER_ID) {
      return new NextResponse("Not Found", { status: 404 })
    }

    const body = await req.json().catch(() => ({}));
    
    if (body.url) {
      await crawlQueue.add("crawl", {
        url: body.url,
        isRecrawl: body.isRecrawl || false
      });
      return NextResponse.json({ success: true, count: 1 });
    }

    let count = 0;
    for (const url of SEED_URLS) {
      await crawlQueue.add("crawl", {
        url,
        isRecrawl: false
      });
      count++;
    }

    return NextResponse.json({ success: true, count });
  } catch (err) {
    console.error("Crawl queue error:", err);
    return NextResponse.json({ error: "Failed to queue" }, { status: 500 });
  }
}
