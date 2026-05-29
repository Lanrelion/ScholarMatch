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

    // Fetch existing profile to check if it's an update or create
    const existingProfile = await db.profile.findUnique({ where: { userId } });

    // Only enforce required fields strictly if creating a new profile
    if (!existingProfile) {
      if (!firstName || !nationality || !currentDegree || !fieldOfStudy || needsFinancialAid == null) {
        return NextResponse.json({ error: "Missing required fields for new profile" }, { status: 400 });
      }
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

    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (nationality !== undefined) {
      updateData.nationality = nationality;
      updateData.citizenships = citizenships || [nationality];
    } else if (citizenships !== undefined) {
      updateData.citizenships = citizenships;
    }
    if (currentDegree !== undefined) updateData.currentDegree = currentDegree;
    if (fieldOfStudy !== undefined) updateData.fieldOfStudy = fieldOfStudy;
    if (gpa !== undefined) updateData.gpa = gpa;
    if (gpaScale !== undefined) updateData.gpaScale = gpaScale;
    if (needsFinancialAid !== undefined) updateData.needsFinancialAid = needsFinancialAid;
    if (workExperienceYears !== undefined) updateData.workExperienceYears = workExperienceYears;
    if (countryOfStudy !== undefined) updateData.countryOfStudy = countryOfStudy;

    const profile = await db.profile.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        firstName: firstName || "",
        lastName: lastName || "",
        nationality: nationality || "",
        citizenships: citizenships || (nationality ? [nationality] : []),
        currentDegree: currentDegree || "UNDERGRADUATE",
        fieldOfStudy: fieldOfStudy || "",
        gpa,
        gpaScale: gpaScale || 4.0,
        needsFinancialAid: needsFinancialAid ?? false,
        workExperienceYears: workExperienceYears || 0,
        countryOfStudy,
      },
    });

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error("Profile POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
