import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { LenisProvider } from "@/components/layout/LenisProvider";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const profile = await db.profile.findUnique({
    where: { userId },
  });

  if (!profile) redirect("/onboarding/step/1");

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
