import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const AFRICAN_ISO_CODES = [
  "DZ","AO","BJ","BW","BF","BI","CM","CV","CF",
  "TD","KM","CG","CD","CI","DJ","EG","GQ","ER",
  "ET","GA","GM","GH","GN","GW","KE","LS","LR",
  "LY","MG","MW","ML","MR","MU","YT","MA","MZ",
  "NA","NE","NG","RE","RW","ST","SN","SC","SL",
  "SO","ZA","SS","SD","SZ","TZ","TG","TN","UG",
  "EH","ZM","ZW"
];

export async function GET() {
  const { userId } = await auth();
  if (userId !== process.env.ADMIN_USER_ID) {
    return new Response(null, { status: 404 });
  }

  const scholarships = await db.scholarship.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { savedBy: true } }
    }
  });

  return NextResponse.json(scholarships);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (userId !== process.env.ADMIN_USER_ID) {
    return new Response(null, { status: 404 });
  }

  try {
    const body = await req.json();

    // Nationalities expansion
    let nationalities: string[] = [];
    const rawNats = body.eligibleNationalities?.trim().toUpperCase();
    if (rawNats === "ALL") {
      nationalities = AFRICAN_ISO_CODES;
    } else if (rawNats) {
      nationalities = rawNats.split(",").map((s: string) => s.trim());
    }

    // Fields expansion
    const fields = body.fields ? body.fields.split(",").map((s: string) => s.trim()) : [];

    const scholarship = await db.scholarship.create({
      data: {
        title: body.title,
        provider: body.provider,
        sourceUrl: body.sourceUrl,
        sourceDomain: body.sourceDomain,
        description: body.description,
        amount: body.amount ? parseFloat(body.amount) : null,
        currency: body.currency || "USD",
        deadline: body.deadline ? new Date(body.deadline) : null,
        eligibleDegrees: body.eligibleDegrees,
        fieldsOfStudy: fields,
        eligibleNationalities: nationalities,
        eligibilityRaw: body.eligibilityRaw,
        verified: body.verified,
        isActive: body.isActive,
        universityName: body.universityName || null,
        universityCountry: body.universityCountry || null,
        programName: body.programName || null,
        scholarshipType: body.scholarshipType || "NATIONAL",
        applicationRoute: body.applicationRoute || "DIRECT",
      }
    });

    return NextResponse.json(scholarship, { status: 201 });
  } catch (err: any) {
    console.error("Admin POST error:", err);
    return NextResponse.json({ error: err.message || "Failed to create" }, { status: 400 });
  }
}
