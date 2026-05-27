"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Updates the collection status of a saved scholarship via drag and drop
 */
export async function updateCollectionStatus(savedScholarshipId: string, newStatus: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Security check: ensure the saved scholarship belongs to the current user
    const savedItem = await db.savedScholarship.findUnique({
      where: { id: savedScholarshipId }
    });

    if (!savedItem || savedItem.userId !== userId) {
      throw new Error("Not found or unauthorized");
    }

    // Valid statuses
    const validStatuses = ["incoming", "safety", "target", "reach"];
    if (!validStatuses.includes(newStatus)) {
      throw new Error("Invalid collection status");
    }

    await db.savedScholarship.update({
      where: { id: savedScholarshipId },
      data: { collectionStatus: newStatus }
    });

    revalidatePath("/saved");
    return { success: true };
  } catch (error) {
    console.error("Error updating collection status:", error);
    return { success: false, error: "Failed to update collection status" };
  }
}
