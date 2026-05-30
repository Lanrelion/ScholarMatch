import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(
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
      where: { id }
    });
    
    if (!scholarship) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(scholarship);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
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
  const body = await req.json();

  try {
    // Basic validation / conversion
    const data: any = { ...body };
    if (data.amount !== undefined) {
      data.amount = data.amount ? parseFloat(data.amount) : null;
    }
    if (data.deadline !== undefined) {
      data.deadline = data.deadline ? new Date(data.deadline) : null;
    }
    // Fields of study string to array
    if (typeof data.fields === "string") {
      data.fieldsOfStudy = data.fields.split(",").map((s: string) => s.trim()).filter(Boolean);
      delete data.fields;
    }
    // Nationalities string to array
    if (typeof data.eligibleNationalities === "string") {
      if (data.eligibleNationalities.trim() === "ALL") {
        data.eligibleNationalities = []; // Empty implies all
      } else {
        data.eligibleNationalities = data.eligibleNationalities.split(",").map((s: string) => s.trim().toUpperCase()).filter(Boolean);
      }
    }

    // Map UI fields to Schema fields
    if (data.universityName !== undefined) {
      data.hostInstitution = data.universityName;
      delete data.universityName;
    }
    if (data.universityCountry !== undefined) {
      data.hostCountry = data.universityCountry;
      delete data.universityCountry;
    }

    // Delete UI-only fields that do not exist in the Prisma schema
    delete data.programName;
    delete data.scholarshipType;
    delete data.applicationRoute;

    const updated = await db.scholarship.update({
      where: { id },
      data
    });

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath(`/admin/${id}/edit`);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
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
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
