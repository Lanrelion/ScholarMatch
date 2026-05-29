import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scoreScholarship } from "@/lib/matching/scoreScholarship";
import { DegreeLevel } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await db.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ error: "profile_missing" }, { status: 404 });
    }

    if (!profile.nationality || !profile.currentDegree) {
      return NextResponse.json({ error: "profile_incomplete" }, { status: 422 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limitParam = parseInt(searchParams.get("limit") || "20", 10);
    const limit = Math.min(limitParam, 50);
    const skip = (page - 1) * limit;

    // Stage 1 hard filter (PostgreSQL)
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

    // Parallelize count and findMany
    const [total, scholarships] = await Promise.all([
      db.scholarship.count({ where: whereClause }),
      db.scholarship.findMany({
        where: whereClause,
        skip,
        take: limit,
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
      })
    ]);

    const results = scholarships.map((scholarship) => {
      const { matchScore, matchBreakdown } = scoreScholarship(scholarship, profile as any);

      return {
        ...scholarship,
        matchScore,
        matchBreakdown
      };
    });

    // Sort final array by matchScore DESC
    results.sort((a: any, b: any) => b.matchScore - a.matchScore);

    return NextResponse.json({
      data: results,
      meta: {
        total,
        page,
        limit,
        hasMore: skip + limit < total
      }
    });

  } catch (err) {
    console.error("Scholarships API Error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
