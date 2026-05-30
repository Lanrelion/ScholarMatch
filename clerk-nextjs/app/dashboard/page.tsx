import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DiscoveryFeed } from "@/components/dashboard/DiscoveryFeed";
import { SearchOverlay } from "@/components/dashboard/SearchOverlay";
import { scoreScholarship } from "@/lib/matching/scoreScholarship";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const profile = await db.profile.findUnique({
    where: { userId },
  });

  if (!profile) redirect("/onboarding/step/1");

  // Server-side fetching for initial data
  const whereClause = {
    isActive: true,
    OR: [
      { deadline: null },
      { deadline: { gt: new Date() } }
    ],
    AND: [
      {
        OR: [
          { eligibleNationalities: { isEmpty: true } },
          { eligibleNationalities: { has: profile.nationality } }
        ]
      },
      {
        OR: [
          { eligibleDegrees: { isEmpty: true } },
          { eligibleDegrees: { has: profile.currentDegree } }
        ]
      }
    ]
  };

  const scholarships = await db.scholarship.findMany({
    where: whereClause,
    take: 40,
    orderBy: { deadline: { sort: 'asc', nulls: 'last' } },
    select: {
      id: true,
      title: true,
      provider: true,
      hostCountry: true,
      amount: true,
      currency: true,
      deadline: true,
      eligibleDegrees: true,
      eligibleNationalities: true,
      fieldsOfStudy: true,
      sourceDomain: true,
      eligibilityParsed: true,
      isActive: true,
    }
  });

  // Transform and score scholarships on the server
  const initialScholarships = scholarships.map(s => {
    const { matchScore, matchBreakdown } = scoreScholarship(s, profile as any);
    return JSON.parse(JSON.stringify({
      ...s,
      matchScore,
      matchBreakdown,
      amount: s.amount ? Number(s.amount) : null
    }));
  }).sort((a: any, b: any) => b.matchScore - a.matchScore);

  // Compute metrics for header
  const totalMatches = initialScholarships.length;
  // Mock new matches for demo
  const newMatchesCount = totalMatches > 5 ? 3 : 0;
  
  // Calculate urgent deadline days
  let urgentDeadlineDays = 0;
  const now = new Date();
  const withDeadlines = initialScholarships.filter((s: any) => s.deadline);
  if (withDeadlines.length > 0) {
    const closest = withDeadlines.reduce((prev: any, curr: any) => {
      return new Date(curr.deadline) < new Date(prev.deadline) ? curr : prev;
    });
    const daysLeft = Math.ceil((new Date(closest.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft >= 0 && daysLeft <= 30) {
      urgentDeadlineDays = daysLeft;
    }
  }

  // Fetch initial saved IDs for the current user to initialize the DiscoveryFeed
  const savedScholarships = await db.savedScholarship.findMany({
    where: { userId },
    select: { scholarshipId: true }
  });
  const initialSavedIds = savedScholarships.map(s => s.scholarshipId);

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <DashboardHeader 
        firstName={profile.firstName} 
        totalMatches={totalMatches}
        newMatchesCount={newMatchesCount}
        urgentDeadlineDays={urgentDeadlineDays}
      />
      <main className="flex-1">
        <DiscoveryFeed 
          initialScholarships={initialScholarships}
          profile={JSON.parse(JSON.stringify(profile))}
          initialSavedIds={initialSavedIds}
        />
      </main>
      <SearchOverlay scholarships={initialScholarships} />
    </div>
  );
}