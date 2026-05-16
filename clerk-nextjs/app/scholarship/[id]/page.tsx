import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { scoreScholarship } from "@/lib/matching/scoreScholarship";
import ScholarshipDetail from "@/components/scholarship/ScholarshipDetail";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const scholarship = await db.scholarship.findUnique({
    where: { id: resolvedParams.id },
    select: { 
      title: true, 
      provider: true,
      description: true
    },
  });

  if (!scholarship) return { title: "Scholarship Not Found" };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const pageUrl = `${appUrl}/scholarship/${resolvedParams.id}`;

  return {
    title: scholarship.title,
    description: scholarship.description ?? `${scholarship.provider} scholarship on ScholarMatch`,
    openGraph: {
      title: scholarship.title,
      description: scholarship.description ?? `${scholarship.provider} — find this and more on ScholarMatch`,
      url: pageUrl,
      siteName: "ScholarMatch",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: scholarship.title,
      description: `${scholarship.provider} scholarship on ScholarMatch`,
    }
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
  const scholarship = await db.scholarship.findUnique({
    where: { id: resolvedParams.id, isActive: true },
  });

  if (!scholarship) notFound();

  const profile = await db.profile.findUnique({
    where: { userId },
    select: {
      nationality: true,
      currentDegree: true,
      fieldOfStudy: true,
      gpa: true,
      gpaScale: true,
      needsFinancialAid: true,
    },
  });

  // Calculate matching server-side
  const { matchScore, matchBreakdown } = scoreScholarship(
    scholarship,
    profile as any
  );

  // Check if saved
  const savedItem = await db.savedScholarship.findUnique({
    where: {
      userId_scholarshipId: {
        userId,
        scholarshipId: resolvedParams.id
      }
    },
    select: { id: true }
  });

  return (
    <ScholarshipDetail
      scholarship={scholarship as any}
      matchScore={matchScore}
      matchBreakdown={matchBreakdown}
      initialSaved={!!savedItem}
      savedItemId={savedItem?.id}
    />
  );
}
