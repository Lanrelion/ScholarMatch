/// <reference lib="webworker" />

import type { PrecacheEntry, SerwistGlobalConfig } from "serwist"
import { Serwist, NetworkFirst, CacheFirst, ExpirationPlugin } from "serwist"
import { defaultCache } from "@serwist/next/worker"

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[]
  }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    ...defaultCache,

    // Cache the scholarship discovery API
    {
      matcher: /^https?:\/\/.*\/api\/scholarships/,
      handler: new NetworkFirst({
        cacheName: "scholarships-api",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24  // 24 hours
          }),
        ],
        networkTimeoutSeconds: 5
      }),
    },

    // Cache the saved scholarships API
    {
      matcher: /^https?:\/\/.*\/api\/saved/,
      handler: new NetworkFirst({
        cacheName: "saved-api",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 20,
            maxAgeSeconds: 60 * 60 * 24
          }),
        ],
        networkTimeoutSeconds: 5
      }),
    },

    // Cache scholarship images and external resources (logos etc)
    {
      matcher: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: new CacheFirst({
        cacheName: "images",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30  // 30 days
          }),
        ],
      }),
    }
  ],
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document"
        }
      }
    ]
  }
})

serwist.addEventListeners()

self.addEventListener("push", (event) => {
  if (!event.data) return

  try {
    const data = event.data.json() as {
      title: string
      body: string
      url: string
      tag?: string
    }

    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
        tag: data.tag ?? "scholarmatch",
        data: { url: data.url },
        requireInteraction: false,
      })
    )
  } catch (error) {
    console.error("Push Event Error:", error)
  }
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const url = event.notification.data?.url ?? "/"

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        // Focus existing window if open
        const existing = clients.find((c) => c.url.includes(self.location.origin))
        if (existing) {
          existing.focus()
          if ('navigate' in existing) {
            existing.navigate(url)
          }
          return
        }
        // Otherwise open new window
        self.clients.openWindow(url)
      })
  )
})
