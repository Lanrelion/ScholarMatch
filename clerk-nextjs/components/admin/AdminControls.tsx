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
              ? "bg-[var(--color-surface)] text-[var(--color-text-tertiary)] border border-[var(--color-border)] cursor-not-allowed" 
              : "bg-[var(--color-white)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:shadow-md"
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
          status === "running" && "bg-blue-50 border-blue-100 text-blue-700",
          status === "success" && "bg-green-50 border-green-100 text-green-700",
          status === "error" && "bg-red-50 border-red-100 text-red-700"
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
