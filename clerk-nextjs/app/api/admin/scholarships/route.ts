import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (userId !== process.env.ADMIN_USER_ID) {
    return new Response(null, { status: 404 });
  }

  const body = await req.json();

  try {
    const data: any = { ...body };
    if (data.amount !== undefined) {
      data.amount = data.amount ? parseFloat(data.amount) : null;
    }
    if (data.deadline !== undefined) {
      data.deadline = data.deadline ? new Date(data.deadline) : null;
    }
    if (typeof data.fields === "string") {
      data.fieldsOfStudy = data.fields.split(",").map((s: string) => s.trim()).filter(Boolean);
      delete data.fields;
    }
    if (typeof data.eligibleNationalities === "string") {
      if (data.eligibleNationalities.trim() === "ALL") {
        data.eligibleNationalities = []; 
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

    // Delete UI-only fields
    delete data.programName;
    delete data.scholarshipType;
    delete data.applicationRoute;

    const scholarship = await db.scholarship.create({
      data
    });

    return NextResponse.json(scholarship, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Failed to create scholarship" }, { status: 500 });
  }
}
