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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (userId !== process.env.ADMIN_USER_ID) {
    return new Response(null, { status: 404 });
  }

  const { id } = await params;
  const scholarship = await db.scholarship.findUnique({
    where: { id }
  });

  if (!scholarship) return new Response(null, { status: 404 });

  return NextResponse.json(scholarship);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (userId !== process.env.ADMIN_USER_ID) {
    return new Response(null, { status: 404 });
  }

  const { id } = await params;
  try {
    const body = await req.json();

    // Nationalities expansion (if provided as string)
    let nationalities = body.eligibleNationalities;
    if (typeof nationalities === 'string') {
      const rawNats = nationalities.trim().toUpperCase();
      if (rawNats === "ALL") {
        nationalities = AFRICAN_ISO_CODES;
      } else if (rawNats) {
        nationalities = rawNats.split(",").map((s: string) => s.trim());
      } else {
        nationalities = [];
      }
    }

    // Fields expansion (if provided as string)
    let fields = body.fieldsOfStudy;
    if (body.fields && typeof body.fields === 'string') {
      fields = body.fields.split(",").map((s: string) => s.trim());
    }

    const scholarship = await db.scholarship.update({
      where: { id },
      data: {
        title: body.title,
        provider: body.provider,
        sourceUrl: body.sourceUrl,
        sourceDomain: body.sourceDomain,
        description: body.description,
        amount: body.amount !== undefined ? (body.amount ? parseFloat(body.amount) : null) : undefined,
        currency: body.currency,
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

    return NextResponse.json(scholarship);
  } catch (err: any) {
    console.error("Admin PATCH error:", err);
    return NextResponse.json({ error: err.message || "Failed to update" }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (userId !== process.env.ADMIN_USER_ID) {
    return new Response(null, { status: 404 });
  }

  const { id } = await params;
  try {
    await db.scholarship.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Admin DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
