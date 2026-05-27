"use client"

import { useState, useEffect } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem("pwa-install-dismissed")
    if (dismissed) return

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowBanner(true)
    }

    window.addEventListener("beforeinstallprompt", handler)
    window.addEventListener("appinstalled", () => setShowBanner(false))

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    setShowBanner(false)
    if (outcome === "accepted") {
      localStorage.setItem("pwa-install-dismissed", "true")
    }
  }

  const handleDismiss = () => {
    setShowBanner(false)
    localStorage.setItem("pwa-install-dismissed", "true")
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-[64px] left-4 right-4 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#E1F5EE] flex items-center justify-center flex-shrink-0">
          <i className="ti-download text-[#1D9E75] text-xl"></i>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            Add to home screen
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Access scholarships faster, even offline
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleInstall}
            className="bg-[#1D9E75] text-white text-xs rounded-lg px-4 py-2 font-semibold hover:bg-[#188a66] transition-colors"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="text-gray-400 p-2 hover:text-gray-600 transition-colors"
            aria-label="Dismiss"
          >
            <i className="ti-x text-lg"></i>
          </button>
        </div>
      </div>
    </div>
  )
}
