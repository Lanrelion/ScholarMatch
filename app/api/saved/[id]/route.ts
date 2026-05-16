import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await db.savedScholarship.findUnique({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    await db.savedScholarship.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (err) {
    console.error("Saved DELETE error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  try {
    const existing = await db.savedScholarship.findUnique({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const updated = await db.savedScholarship.update({
      where: { id },
      data: {
        sourceVisited: body.sourceVisited,
        reminder30d: body.reminder30d,
        reminder7d: body.reminder7d,
        reminder1d: body.reminder1d,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Saved PATCH error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
