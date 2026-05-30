"use client"

import { useState, useEffect } from "react"

export default function PushPermission() {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default")
  const [isRegistering, setIsRegistering] = useState(false)

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setPermission("unsupported")
      return
    }
    setPermission(Notification.permission)
  }, [])

  const [errorMsg, setErrorMsg] = useState("");

  const handleEnable = async () => {
    setIsRegistering(true);
    setErrorMsg("");

    try {
      // 1. Request permission
      const result = await Notification.requestPermission();
      if (result !== "granted") {
        setPermission(result);
        setIsRegistering(false);
        return;
      }
      
      // Even if subsequent push setup fails, we've got browser permission
      setPermission("granted");

      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        console.warn("VAPID key not configured, skipping push subscription setup");
        setIsRegistering(false);
        return;
      }

      // 2. Get service worker registration with a timeout so it doesn't hang forever
      const getRegistrationWithTimeout = () => {
        return Promise.race([
          navigator.serviceWorker.ready,
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Service worker ready timeout")), 5000))
        ]);
      };

      const registration = await getRegistrationWithTimeout();

      // 3. Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
      });

      // 4. Send subscription to server
      const sub = subscription.toJSON();
      const res = await fetch("/api/notify/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: sub.endpoint,
          keys: sub.keys
        })
      });

      if (!res.ok) {
        throw new Error("Failed to save push subscription to server");
      }

    } catch (error: any) {
      console.error("Push registration failed:", error);
      setErrorMsg(error.message || "Failed to enable notifications");
    } finally {
      setIsRegistering(false);
    }
  };

  if (permission === "unsupported" || permission === "granted" || permission === "denied") {
    return null
  }

  return (
    <div className="bg-[#E1F5EE] rounded-2xl p-4 mx-4 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#1D9E75] flex items-center justify-center flex-shrink-0">
          <i className="ti-bell text-white text-sm"></i>
        </div>
        <h3 className="text-sm font-semibold text-[#0F6E56]">
          Get deadline reminders
        </h3>
      </div>
      
      <p className="text-xs text-[#0F6E56] mt-2 mb-4 leading-relaxed">
        We'll notify you 30, 7, and 1 day before each scholarship deadline so you never miss an opportunity.
      </p>

      {errorMsg && (
        <div className="mb-4 text-xs font-semibold text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
          {errorMsg}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleEnable}
          disabled={isRegistering}
          className="bg-[#1D9E75] text-white text-xs font-semibold rounded-xl px-5 py-2.5 hover:bg-[#188a66] transition-colors disabled:opacity-50"
        >
          {isRegistering ? "Enabling..." : "Enable notifications"}
        </button>
        <button
          onClick={() => setPermission("denied")}
          className="text-xs text-[#0F6E56] font-medium px-2 py-1 hover:underline"
        >
          Not now
        </button>
      </div>
    </div>
  )
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
