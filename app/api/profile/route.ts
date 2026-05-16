import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
      email,
    } = body;

    if (!firstName || !lastName || !nationality || !currentDegree || !fieldOfStudy || needsFinancialAid == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Ensure User record exists before upserting Profile
    await db.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: email || `${userId}@example.com`,
      },
    });

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
