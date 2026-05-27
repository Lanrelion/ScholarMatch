"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  MagnifyingGlass, 
  WifiX, 
  CloudWarning, 
  Hourglass, 
  BookmarkSimple, 
  LockKey 
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type ErrorType = 'no-matches' | 'offline' | 'api-error' | 'rate-limited' | 'empty-saved' | 'session-expired';

interface Props {
  type: ErrorType;
  onRetry?: () => void;
  onAction?: () => void;
  className?: string;
}

export function ErrorState({ type, onRetry, onAction, className }: Props) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (type === 'rate-limited') {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [type]);

  const config = {
    'no-matches': {
      icon: MagnifyingGlass,
      heading: "No matches yet — but that can change.",
      subtext: "Broaden your field or update your profile.",
      buttonText: "Edit profile",
      action: () => router.push("/profile")
    },
    'offline': {
      icon: WifiX,
      heading: "You're offline right now.",
      subtext: "Saved scholarships are still available below.",
      buttonText: "View saved",
      action: () => router.push("/saved")
    },
    'api-error': {
      icon: CloudWarning,
      heading: "Something unexpected happened.",
      subtext: "We're looking into it. Try refreshing.",
      buttonText: "Retry",
      action: () => {
        if (onRetry) onRetry();
        else router.refresh();
      }
    },
    'rate-limited': {
      icon: Hourglass,
      heading: "Give us just a moment.",
      subtext: "You've been busy — we appreciate the enthusiasm.",
      buttonText: countdown > 0 ? `Try again in ${countdown}s` : "Try again",
      action: () => {
        if (countdown === 0) {
          if (onRetry) onRetry();
          else router.refresh();
        }
      },
      disabled: countdown > 0
    },
    'empty-saved': {
      icon: BookmarkSimple,
      heading: "Nothing saved yet.",
      subtext: "Explore to find scholarships worth saving.",
      buttonText: "Discover scholarships",
      action: () => router.push("/dashboard")
    },
    'session-expired': {
      icon: LockKey,
      heading: "Your session has ended.",
      subtext: "Sign back in to continue where you left off.",
      buttonText: "Sign in",
      action: () => router.push("/sign-in")
    }
  };

  const { icon: Icon, heading, subtext, buttonText, action, disabled } = config[type] as any;
  
  const handleAction = () => {
    if (onAction) onAction();
    else action();
  };

  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-16 px-6", className)}>
      <Icon size={64} weight="light" className="text-border-strong mb-6" />
      
      <h2 className="text-[28px] font-editorial font-light italic text-ink leading-tight">
        {heading}
      </h2>
      
      <p className="text-[14px] font-ui text-ink-secondary mt-[12px] max-w-[280px] leading-relaxed">
        {subtext}
      </p>

      <button
        onClick={handleAction}
        disabled={disabled}
        className={cn(
          "mt-[24px] h-10 px-6 rounded-full font-ui font-medium text-[14px] transition-colors",
          disabled 
            ? "bg-surface-hover text-ink-tertiary cursor-not-allowed border border-border" 
            : "bg-moss text-white hover:bg-moss-dark"
        )}
      >
        {buttonText}
      </button>
    </div>
  );
}
