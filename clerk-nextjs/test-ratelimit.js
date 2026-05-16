require("dotenv").config({ path: ".env.local" });
const { Ratelimit } = require("@upstash/ratelimit");
const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const discoveryLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"),
  prefix: "rl:discovery",
  analytics: true,
});

async function run() {
  for (let i = 1; i <= 40; i++) {
    const { success, limit, remaining, reset } = await discoveryLimiter.limit("test-script-id");
    console.log(`${i} : success=${success} remaining=${remaining}`);
  }
}

run();
