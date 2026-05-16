"use client"

import Link from "next/link";
import { useState } from "react";

export function AdminTabs({ currentTab }: { currentTab: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRunCrawler = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/crawl", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Success! Enqueued ${data.count} seed URLs.`);
      } else {
        setMessage(`Error: ${data.error || "Failed to enqueue"}`);
      }
    } catch (err) {
      setMessage("Failed to trigger crawler.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
      <div className="flex items-center gap-2 border-b border-gray-200">
        <Link 
          href="/admin"
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            currentTab === "all" ? "border-[#1D9E75] text-[#1D9E75]" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          All Scholarships
        </Link>
        <Link 
          href="/admin?tab=pending"
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            currentTab === "pending" ? "border-[#1D9E75] text-[#1D9E75]" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Pending Review
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {message && <span className="text-sm text-gray-600">{message}</span>}
        <button
          onClick={handleRunCrawler}
          disabled={loading}
          className="bg-blue-600 text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
        >
          {loading ? "Queueing..." : "Run Crawler"}
        </button>
        <Link 
          href="/admin/new"
          className="bg-[#1D9E75] text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-[#0F6E56] transition-colors shadow-sm"
        >
          + Add scholarship
        </Link>
      </div>
    </div>
  );
}
