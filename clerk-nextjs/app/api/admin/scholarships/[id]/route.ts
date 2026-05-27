import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
