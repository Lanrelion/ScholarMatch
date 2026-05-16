"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import SavedItem from "@/components/saved/SavedItem";
import BottomNav from "@/components/layout/BottomNav";

const PushPermission = dynamic(
  () => import("@/components/pwa/PushPermission"),
  { ssr: false }
);

export default function SavedPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    try {
      const res = await fetch("/api/saved");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      } else {
        setError("Failed to load saved scholarships");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsave = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const upcomingItems = items.filter((item) => item.scholarship.deadline !== null);
  const openItems = items.filter((item) => item.scholarship.deadline === null);

  return (
    <div className="min-h-screen bg-white pb-24 flex flex-col items-center">
      <div className="w-full max-w-2xl pt-6">
        <PushPermission />
        {/* TOP BAR */}
        <div className="flex items-center justify-between px-4 pt-6 pb-2">
          <h1 className="text-xl font-medium text-gray-900">Saved scholarships</h1>
          {!isLoading && items.length > 0 && (
            <span className="text-sm text-gray-500">{items.length} saved</span>
          )}
        </div>

        {/* STEP 06: freshness change alerts render here */}

        <div className="mt-4">
          {isLoading ? (
            <div className="space-y-3 px-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="py-16 px-6 text-center">
              <p className="text-[#E24B4A] font-medium">{error}</p>
              <button 
                onClick={fetchSaved}
                className="mt-4 text-[#1D9E75] text-sm font-medium"
              >
                Try again
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-24 px-6 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <i className="ti-bookmark text-3xl text-gray-300"></i>
              </div>
              <h2 className="text-lg font-medium text-gray-900 mb-1">No saved scholarships yet</h2>
              <p className="text-sm text-gray-500 mb-8 max-w-[240px]">
                Tap the bookmark on any scholarship to save it here
              </p>
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-[#1D9E75] text-white px-8 py-3 rounded-xl text-sm font-medium shadow-sm active:scale-95 transition-transform"
              >
                Find scholarships →
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {upcomingItems.length > 0 && (
                <section>
                  <h2 className="text-[10px] uppercase tracking-widest text-gray-400 font-medium px-4 mb-3">
                    Upcoming deadlines
                  </h2>
                  <div className="bg-white">
                    {upcomingItems.map((item) => (
                      <SavedItem key={item.id} item={item} onUnsave={handleUnsave} />
                    ))}
                  </div>
                </section>
              )}

              {openItems.length > 0 && (
                <section>
                  <h2 className="text-[10px] uppercase tracking-widest text-gray-400 font-medium px-4 mb-3">
                    Open deadline
                  </h2>
                  <div className="bg-white">
                    {openItems.map((item) => (
                      <SavedItem key={item.id} item={item} onUnsave={handleUnsave} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>

      <BottomNav savedCount={items.length} />
    </div>
  );
}
