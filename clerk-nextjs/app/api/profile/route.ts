import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/checkRateLimit";
import { authLimiter } from "@/lib/ratelimit";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = await checkRateLimit(authLimiter, userId);
  if (limited) return limited;

  const profile = await db.profile.findUnique({
    where: { userId },
  });

  if (profile) {
    return NextResponse.json({ exists: true, profile });
  } else {
    return NextResponse.json({ exists: false });
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = await checkRateLimit(authLimiter, userId);
  if (limited) return limited;

  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      nationality,
      citizenships,
      currentDegree,
      fieldOfStudy,
      gpa,
      gpaScale,
      needsFinancialAid,
      workExperienceYears,
      countryOfStudy,
    } = body;

    if (!firstName || !nationality || !currentDegree || !fieldOfStudy || needsFinancialAid == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const profile = await db.profile.upsert({
      where: { userId },
      update: {
        firstName,
        lastName,
        nationality,
        citizenships: citizenships || [nationality],
        currentDegree,
        fieldOfStudy,
        gpa,
        gpaScale,
        needsFinancialAid,
        workExperienceYears,
        countryOfStudy,
      },
      create: {
        userId,
        firstName,
        lastName,
        nationality,
        citizenships: citizenships || [nationality],
        currentDegree,
        fieldOfStudy,
        gpa,
        gpaScale,
        needsFinancialAid,
        workExperienceYears,
        countryOfStudy,
      },
    });

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error("Profile POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
