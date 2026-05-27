import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();

self.addEventListener("push", (e) => {
  if (e.data) {
    try {
      let t = e.data.json();
      e.waitUntil(
        self.registration.showNotification(t.title, {
          body: t.body,
          icon: "/icons/icon-192x192.png",
          badge: "/icons/icon-192x192.png",
          tag: t.tag ?? "scholarmatch",
          data: { url: t.url },
          requireInteraction: false,
        })
      );
    } catch (e) {
      console.error("Push Event Error:", e);
    }
  }
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  let t = e.notification.data?.url ?? "/";
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      let client = clients.find((c) => c.url.includes(self.location.origin));
      if (client) {
        client.focus();
        if ("navigate" in client) client.navigate(t);
        return;
      }
      self.clients.openWindow(t);
    })
  );
});
