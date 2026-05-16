import "dotenv/config"
import { Worker } from "bullmq"
import { crawler } from "./crawler"

const worker = new Worker(
  "scholarship-crawl",
  async (job) => {
    const { url, isRecrawl } = job.data
    
    await crawler.addRequests([{
      url,
      label: isRecrawl ? "SCHOLARSHIP" : "LISTING"
    }])
    
    await crawler.run()
  },
  { 
    connection: { 
      host: process.env.UPSTASH_REDIS_REST_URL?.replace("https://", ""),
      port: 6379,
      password: process.env.UPSTASH_REDIS_REST_TOKEN!,
      tls: {}
    },
    concurrency: 1  // one crawl job at a time
  }
)

worker.on("completed", job => {
  console.log(`Job ${job.id} completed`)
})

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message)
})

console.log("Scholar crawler worker started")
