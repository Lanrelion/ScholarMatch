import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/checkRateLimit";
import { discoveryLimiter, writeLimiter } from "@/lib/ratelimit";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = await checkRateLimit(discoveryLimiter, userId);
  if (limited) return limited;

  try {
    // ReviewPrompt expects an array of unreviewed SavedScholarships
    // with { id, scholarship: { ... } }
    const unreviewed = await db.savedScholarship.findMany({
      where: { 
        userId,
        scholarship: {
          matchReviews: {
            none: { userId }
          }
        }
      },
      include: { scholarship: true },
      orderBy: { savedAt: "desc" },
    });

    return NextResponse.json(unreviewed);
  } catch (err) {
    console.error("Reviews GET error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limited = await checkRateLimit(writeLimiter, userId);
    if (limited) return limited;

    const body = await req.json();
    const { scholarshipId, rating, mismatchReasons, note, applied } = body;

    if (!scholarshipId) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;
    
    if (email) {
      await db.user.upsert({
        where: { id: userId },
        update: { email },
        create: { id: userId, email }
      });
    }

    // Look up the AI match score from the saved scholarship to satisfy the schema
    const saved = await db.savedScholarship.findUnique({
      where: { userId_scholarshipId: { userId, scholarshipId } }
    });
    const matchScore = saved?.matchScore || 0.0;

    const review = await db.matchReview.upsert({
      where: {
        userId_scholarshipId: {
          userId,
          scholarshipId
        }
      },
      update: {
        matchScore,
        mismatchReasons: mismatchReasons ?? [],
        rating: rating ?? null,
        applied,
        note: note ?? null
      },
      create: {
        userId,
        scholarshipId,
        matchScore,
        mismatchReasons: mismatchReasons ?? [],
        rating: rating ?? null,
        applied,
        note: note ?? null
      }
    });

    return NextResponse.json(review, { status: 200 });
  } catch (error: any) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ error: "internal_error", details: error.message }, { status: 500 });
  }
}
