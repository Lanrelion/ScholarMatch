"use client";

import React, { useState, useEffect } from "react";
import { BellRinging, BellSlash, Bell, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type PushState = "prompt" | "dismissed" | "granted" | "denied";

export function PushPermission() {
  const [pushState, setPushState] = useState<PushState>("prompt");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check actual browser permission
    const browserPerm = typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default";
    
    // Check our local intent preference
    const savedState = localStorage.getItem("scholarmatch_push_state") as PushState | null;

    if (browserPerm === "denied") {
      setPushState("denied");
    } else if (browserPerm === "granted" && savedState !== "dismissed") {
      setPushState("granted");
    } else if (savedState) {
      setPushState(savedState);
    }
  }, []);

  const handleEnable = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setPushState("granted");
        localStorage.setItem("scholarmatch_push_state", "granted");
      } else if (permission === "denied") {
        setPushState("denied");
        localStorage.setItem("scholarmatch_push_state", "denied");
      } else {
        // "default" means they dismissed the prompt without deciding
        setPushState("dismissed");
        localStorage.setItem("scholarmatch_push_state", "dismissed");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDismiss = () => {
    setPushState("dismissed");
    localStorage.setItem("scholarmatch_push_state", "dismissed");
  };

  const handleStop = () => {
    setPushState("dismissed");
    localStorage.setItem("scholarmatch_push_state", "dismissed");
  };

  const handleReenableAttempt = () => {
    // If they previously blocked it at the browser level, requestPermission will auto-fail.
    // We should alert them.
    if (Notification.permission === "denied") {
      alert("You have blocked notifications in your browser settings. Please click the lock icon in your URL bar to allow them.");
      return;
    }
    setPushState("prompt");
  };

  if (!mounted) return null;

  if (pushState === "dismissed" || pushState === "denied") {
    return (
      <div className="mb-8 flex justify-end">
        <button 
          onClick={handleReenableAttempt}
          className="flex items-center gap-2 bg-surface hover:bg-surface-hover border border-border px-3 py-1.5 rounded-full transition-colors text-ink-secondary"
          title="Enable Deadline Notifications"
        >
          <BellRinging size={16} />
          <span className="font-ui text-[12px] font-medium">Turn on alerts</span>
        </button>
      </div>
    );
  }

  if (pushState === "granted") {
    return (
      <div className="mb-8 flex justify-end">
        <button 
          onClick={handleStop}
          className="flex items-center gap-2 bg-moss-light border border-moss px-3 py-1.5 rounded-full transition-colors text-moss hover:bg-moss/20"
          title="Stop Notifications"
        >
          <Bell size={16} weight="fill" />
          <span className="font-ui text-[12px] font-medium">Notifications Active (Click to stop)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-moss-light border border-moss rounded-xl p-5 md:px-6 relative mb-8">
      <button 
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-moss hover:text-moss-dark transition-colors"
        aria-label="Dismiss"
      >
        <X size={16} weight="bold" />
      </button>

      <div className="flex items-start gap-4">
        <div className="shrink-0 w-10 h-10 rounded-full bg-moss/10 flex items-center justify-center text-moss">
          <BellRinging size={20} weight="fill" />
        </div>
        <div>
          <h3 className="text-[15px] font-editorial font-medium text-ink mb-1">
            Never miss a deadline
          </h3>
          <p className="text-[13px] font-ui text-ink-secondary leading-[1.5] max-w-sm mb-4">
            Enable push notifications to get reminded when your saved scholarships are closing soon.
          </p>
          <button 
            onClick={handleEnable}
            className="h-9 px-5 bg-moss text-white rounded-full font-ui font-medium text-[13px] hover:bg-moss-dark transition-colors"
          >
            Enable notifications
          </button>
        </div>
      </div>
    </div>
  );
}
