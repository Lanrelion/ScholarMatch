import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DiscoveryFeed from "@/components/dashboard/DiscoveryFeed";
import BottomNav from "@/components/layout/BottomNav";
import PWAClient from "@/components/pwa/PWAClient";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const profile = await db.profile.findUnique({
    where: { userId },
    select: { 
      firstName: true,
      nationality: true,
      currentDegree: true,
      fieldOfStudy: true
    }
  });

  // If no profile, we should technically redirect to onboarding
  if (!profile) redirect("/onboarding/step/1");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <DashboardHeader 
        firstName={profile.firstName} 
        nationality={profile.nationality}
        currentDegree={profile.currentDegree}
        fieldOfStudy={profile.fieldOfStudy}
      />
      <main className="flex-1 overflow-hidden pb-20">
        <DiscoveryFeed />
      </main>
      <BottomNav />
      <PWAClient />
    </div>
  );
}