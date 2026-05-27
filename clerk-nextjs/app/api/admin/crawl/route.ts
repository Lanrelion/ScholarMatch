import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { crawlQueue } from "@/lib/crawlQueue"

const SEED_URLS = [
  "https://www.chevening.org/scholarships/",
  "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
  "https://www.afterschoolfafrica.com/scholarships/",
  "https://opportunitiesforafricans.com/scholarships/",
  "https://si.se/en/apply/scholarships/",
  "https://www.commonwealthscholarships.ac.uk/",
]

export async function POST(req: Request) {
  const { userId } = await auth()
  if (userId !== process.env.ADMIN_USER_ID) {
    return new Response(null, { status: 404 })
  }

  let enqueued = 0
  for (const url of SEED_URLS) {
    await crawlQueue.add("crawl", {
      url,
      isRecrawl: false
    })
    enqueued++
  }

  return NextResponse.json({ 
    success: true, 
    enqueued,
    message: `Enqueued ${enqueued} seed URLs` 
  })
}
