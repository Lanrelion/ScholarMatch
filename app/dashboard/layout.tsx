import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { LenisProvider } from "@/components/layout/LenisProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <div className="flex min-h-screen bg-bg">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 pb-[64px] md:pb-0">
          {children}
        </div>
        <BottomNav />
      </div>
    </LenisProvider>
  );
}
