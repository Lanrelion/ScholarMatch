import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "../../../lib/db";

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  try {
    const pendingReviews = await db.savedScholarship.findMany({
      where: {
        userId: clerkId,
        sourceVisited: true,
        savedAt: { lte: sevenDaysAgo },
        scholarship: { 
          isActive: true,
          matchReviews: {
            none: { userId: clerkId }
          }
        }
      },
      include: { scholarship: true },
      take: 3
    });

    return NextResponse.json(pendingReviews);
  } catch (error: any) {
    console.error("[Reviews API GET Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { scholarshipId, rating, mismatchReasons, note, applied } = body;

    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    const savedScholarship = await db.savedScholarship.findFirst({
      where: { userId: clerkId, scholarshipId },
      select: { matchScore: true }
    });

    if (!savedScholarship) {
      return NextResponse.json({ error: "Saved scholarship not found" }, { status: 404 });
    }

    const review = await db.matchReview.create({
      data: {
        userId: clerkId,
        scholarshipId,
        rating,
        matchScore: savedScholarship.matchScore ?? 0,
        mismatchReasons: mismatchReasons ?? [],
        note: note ?? null,
        applied: applied ?? null,
      }
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    console.error("[Reviews API POST Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
