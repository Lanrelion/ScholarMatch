"use client";

import React from "react";
import BottomNav from "@/components/layout/BottomNav";

export default function AlertsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-2xl font-semibold text-gray-900">Alerts</h1>
        <p className="text-gray-500 text-sm mt-1">Stay updated on your scholarship matches</p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center pb-20">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <i className="ti-bell-off text-3xl text-gray-300"></i>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts yet</h3>
        <p className="text-sm text-gray-500 max-w-[240px]">
          We'll notify you when new scholarships matching your profile are found.
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
