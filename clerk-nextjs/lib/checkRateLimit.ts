import { Ratelimit } from "@upstash/ratelimit"

export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string
): Promise<Response | null> {
  const { success, limit, remaining, reset } = 
    await limiter.limit(identifier)

  if (!success) {
    return new Response(
      JSON.stringify({ error: "rate_limit_exceeded" }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
          "Retry-After": Math.ceil(
            (reset - Date.now()) / 1000
          ).toString(),
        }
      }
    )
  }
  return null  // null = not rate limited, proceed
}
