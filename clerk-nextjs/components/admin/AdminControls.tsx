"use client";

import React, { useState } from "react";
import { Play, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminControls() {
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleRunCrawler = async () => {
    setIsRunning(true);
    setStatus("running");
    setMessage("Starting crawler job...");

    try {
      const res = await fetch("/api/admin/crawl", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(`Success! Job ${data.jobId} enqueued.`);
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to start crawler");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Network error starting crawler");
    } finally {
      setIsRunning(false);
      setTimeout(() => {
        if (status !== "running") {
          setStatus("idle");
          setMessage("");
        }
      }, 5000);
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex items-center justify-end">
        
        <button
          onClick={handleRunCrawler}
          disabled={isRunning}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all shadow-sm active:scale-95",
            isRunning 
              ? "bg-[var(--color-surface)] text-[var(--color-ink-tertiary)] border border-[var(--color-border)] cursor-not-allowed" 
              : "bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-border)] hover:bg-[var(--color-surface)] hover:text-[var(--color-moss)] hover:border-[var(--color-moss)] hover:shadow-md"
          )}
        >
          {isRunning ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Play size={16} fill="currentColor" />
          )}
          Run Scholarship Crawler
        </button>
      </div>

      {status !== "idle" && (
        <div className={cn(
          "p-4 rounded-xl border flex items-center gap-3 text-sm font-medium animate-in slide-in-from-top-2",
          status === "running" && "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-400",
          status === "success" && "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400",
          status === "error" && "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400"
        )}>
          {status === "running" && <Loader2 size={18} className="animate-spin" />}
          {status === "success" && <CheckCircle2 size={18} />}
          {status === "error" && <AlertCircle size={18} />}
          {message}
        </div>
      )}
    </div>
  );
}
