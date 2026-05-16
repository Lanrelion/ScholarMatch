import webpush from "web-push"

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export type PushPayload = {
  title: string
  body: string
  url: string     // where to navigate on tap
  tag?: string    // deduplicates notifications with same tag
}

export async function sendPushNotification(
  subscription: {
    endpoint: string
    auth: string
    p256dh: string
  },
  payload: PushPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          auth: subscription.auth,
          p256dh: subscription.p256dh
        }
      },
      JSON.stringify(payload),
      { TTL: 60 * 60 * 24 }  // 24hr time-to-live
    )
    return { success: true }
  } catch (error: any) {
    // 410 Gone = subscription expired/unsubscribed
    // Return the error code so caller can clean up
    return { 
      success: false, 
      error: error?.statusCode?.toString() ?? "unknown"
    }
  }
}

export { webpush }
