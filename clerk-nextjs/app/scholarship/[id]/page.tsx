import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { scoreScholarship } from "@/lib/matching/scoreScholarship";
import { ScholarshipDetail } from "@/components/scholarship/ScholarshipDetail";
import { Metadata } from "next";

import { cache } from "react";

const getScholarship = cache(async (id: string) => {
  return await db.scholarship.findUnique({
    where: { id, isActive: true },
    select: {
      id: true,
      title: true,
      provider: true,
      hostCountry: true,
      description: true,
      amount: true,
      currency: true,
      deadline: true,
      eligibleDegrees: true,
      eligibleNationalities: true,
      fieldsOfStudy: true,
      sourceDomain: true,
      sourceUrl: true,
      eligibilityParsed: true,
      eligibilityRaw: true,
      isActive: true,
      lastChangedAt: true,
    }
  });
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const scholarship = await getScholarship(resolvedParams.id);

  if (!scholarship) return { title: "Scholarship Not Found" };

  return {
    title: `${scholarship.title} — ScholarMatch`,
    description: `${scholarship.provider} scholarship details and eligibility on ScholarMatch`,
  };
}

export default async function ScholarshipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const resolvedParams = await params;
  
  // Fetch everything in parallel
  const [scholarship, profile, savedItem] = await Promise.all([
    getScholarship(resolvedParams.id),
    db.profile.findUnique({
      where: { userId },
      select: {
        nationality: true,
        currentDegree: true,
        fieldOfStudy: true,
        gpa: true,
        gpaScale: true,
        needsFinancialAid: true,
        workExperienceYears: true,
      },
    }),
    db.savedScholarship.findUnique({
      where: {
        userId_scholarshipId: {
          userId,
          scholarshipId: resolvedParams.id
        }
      },
      select: { id: true }
    })
  ]);

  if (!scholarship) notFound();

  // Calculate matching server-side
  const { matchScore, matchBreakdown } = scoreScholarship(
    scholarship,
    profile as any
  );

  // Serialize Prisma objects (handle Decimals and Dates) for RSC transfer
  const plainScholarship = JSON.parse(JSON.stringify(scholarship));
  
  // Ensure amount is a number if it exists (Decimal -> Number)
  if (scholarship.amount) {
    plainScholarship.amount = Number(scholarship.amount);
  }

  return (
    <ScholarshipDetail
      scholarship={plainScholarship as any}
      matchScore={matchScore}
      matchBreakdown={matchBreakdown}
      initialSaved={!!savedItem}
      savedItemId={savedItem?.id}
    />
  );
}
