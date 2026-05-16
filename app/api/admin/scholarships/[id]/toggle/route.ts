import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (userId !== process.env.ADMIN_USER_ID) {
    return new Response(null, { status: 404 });
  }

  const { id } = await params;

  try {
    const scholarship = await db.scholarship.findUnique({
      where: { id },
      select: { isActive: true }
    });

    if (!scholarship) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await db.scholarship.update({
      where: { id },
      data: { 
        isActive: !scholarship.isActive,
        verified: true // Mark as verified if activated from admin
      }
    });

    return NextResponse.json({ isActive: updated.isActive });
  } catch (error) {
    return NextResponse.json({ error: "Failed to toggle" }, { status: 500 });
  }
}
