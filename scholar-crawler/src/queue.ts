import { Queue } from "bullmq"

const connection = {
  host: process.env.UPSTASH_REDIS_REST_URL?.replace("https://", ""),
  port: 6379,
  password: process.env.UPSTASH_REDIS_REST_TOKEN!,
  tls: {}
}

export type CrawlJobData = {
  url: string
  scholarshipId?: string  // set if re-crawling existing scholarship
  isRecrawl: boolean
}

export const crawlQueue = new Queue<CrawlJobData>(
  "scholarship-crawl",
  { connection }
)
