import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const scholarship = await db.scholarship.findUnique({
      where: { id },
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

    if (!scholarship || !scholarship.isActive) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    return NextResponse.json(scholarship);
  } catch (err) {
    console.error("Scholarship Details API Error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
