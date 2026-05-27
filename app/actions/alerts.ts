"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function dismissDeadlineAlert(savedScholarshipId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Security check
    const savedItem = await db.savedScholarship.findUnique({
      where: { id: savedScholarshipId }
    });

    if (!savedItem || savedItem.userId !== userId) {
      throw new Error("Not found or unauthorized");
    }

    await db.savedScholarship.update({
      where: { id: savedScholarshipId },
      data: { deadlineDismissed: true }
    });

    revalidatePath("/alerts");
    return { success: true };
  } catch (error) {
    console.error("Error dismissing deadline alert:", error);
    return { success: false, error: "Failed to dismiss alert" };
  }
}

export async function dismissChangeAlert(savedScholarshipId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Security check
    const savedItem = await db.savedScholarship.findUnique({
      where: { id: savedScholarshipId }
    });

    if (!savedItem || savedItem.userId !== userId) {
      throw new Error("Not found or unauthorized");
    }

    await db.savedScholarship.update({
      where: { id: savedScholarshipId },
      data: { changeAlerted: false } // resets it so it doesn't show in alerts anymore
    });

    revalidatePath("/alerts");
    return { success: true };
  } catch (error) {
    console.error("Error dismissing change alert:", error);
    return { success: false, error: "Failed to dismiss alert" };
  }
}
