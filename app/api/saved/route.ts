import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const saved = await db.savedScholarship.findMany({
      where: { userId },
      include: { scholarship: true },
      orderBy: {
        scholarship: {
          deadline: "asc",
        },
      },
    });

    return NextResponse.json(saved);
  } catch (err) {
    console.error("Saved GET error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("POST /api/saved — body:", body);
    console.log("POST /api/saved — userId:", userId);

    const { scholarshipId, matchScore, matchBreakdown } = body;

    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;
    console.log("POST /api/saved — clerkEmail:", email);

    if (!email) {
      return NextResponse.json({ error: "no_email" }, { status: 400 });
    }

    // Lazy sync user if missing
    console.log("POST /api/saved — upserting user...");
    await db.user.upsert({
      where: { id: userId },
      update: { email },
      create: { id: userId, email }
    });

    // Safety check: Ensure scholarship exists (prevents FK violation)
    console.log("POST /api/saved — checking scholarship:", scholarshipId);
    const scholarship = await db.scholarship.findUnique({
      where: { id: scholarshipId },
      select: { id: true }
    });

    if (!scholarship) {
      console.error("POST /api/saved — scholarship NOT FOUND:", scholarshipId);
      return NextResponse.json({ error: "scholarship_not_found" }, { status: 404 });
    }

    // Safety check: Clean matchBreakdown for JSON serialization
    const safeBreakdown = JSON.parse(JSON.stringify(matchBreakdown || {}));

    console.log("POST /api/saved — creating saved item...");
    const saved = await db.savedScholarship.create({
      data: {
        userId,
        scholarshipId,
        matchScore,
        matchBreakdown: safeBreakdown,
        reminderEmail: email,
        reminder30d: true,
        reminder7d: true,
        reminder1d: true,
        sourceVisited: false,
      },
    });
    console.log("POST /api/saved — SUCCESS:", saved.id);

    return NextResponse.json(saved, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/saved — FULL ERROR:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "already_saved" }, { status: 409 });
    }
    return NextResponse.json({ error: "internal_error", details: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { scholarshipId } = body;

    if (!scholarshipId) {
      return NextResponse.json({ error: "scholarshipId required" }, { status: 400 });
    }

    // Try deleting the specific save
    await db.savedScholarship.deleteMany({
      where: {
        userId,
        scholarshipId
      }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/saved — FULL ERROR:", error);
    return NextResponse.json({ error: "internal_error", details: error.message }, { status: 500 });
  }
}
