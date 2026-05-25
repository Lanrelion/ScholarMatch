import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProfileSummaryCard } from "@/components/dashboard/ProfileSummaryCard";
import { DiscoveryFeed } from "@/components/dashboard/DiscoveryFeed";
import { scoreScholarship } from "@/lib/matching/scoreScholarship";

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

  const [scholarships, savedItems, reviewCount] = await Promise.all([
    db.scholarship.findMany({
      where: whereClause,
      take: 20,
      orderBy: { deadline: { sort: 'asc', nulls: 'last' } }
    }),
    db.savedScholarship.findMany({
      where: { userId },
      select: { scholarshipId: true, id: true }
    }),
    db.matchReview.count({
      where: { userId }
    })
  ]);

  // Transform and score scholarships on the server
  const initialScholarships = scholarships.map(s => {
    const { matchScore, matchBreakdown } = scoreScholarship(s, profile as any);
    return JSON.parse(JSON.stringify({
      ...s,
      matchScore,
      matchBreakdown,
      amount: s.amount ? Number(s.amount) : null
    }));
  }).sort((a, b) => b.matchScore - a.matchScore);

  const initialSavedIds: Record<string, string> = {};
  savedItems.forEach(item => {
    initialSavedIds[item.scholarshipId] = item.id;
  });

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader firstName={profile.firstName} />
      <ProfileSummaryCard 
        nationality={profile.nationality}
        degreeLevel={profile.currentDegree}
        fieldOfStudy={profile.fieldOfStudy}
      />
      <main className="flex-1 overflow-hidden">
        <DiscoveryFeed 
          initialScholarships={initialScholarships}
          initialSavedIds={initialSavedIds}
          initialReviewCount={reviewCount}
          profile={JSON.parse(JSON.stringify(profile))}
        />
      </main>
    </div>
  );
}