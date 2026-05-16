import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Missing CLERK_WEBHOOK_SECRET. Add it to .env.local and the Clerk Dashboard."
    );
  }

  // Get the Svix headers for verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify the webhook signature
  const wh = new Webhook(WEBHOOK_SECRET);
  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  // Handle events
  const eventType = event.type;

  if (eventType === "user.created") {
    const { id, email_addresses, primary_email_address_id } = event.data;

    // Find the primary email; fall back to first available
    const primaryEmail =
      email_addresses.find((e) => e.id === primary_email_address_id)
        ?.email_address ?? email_addresses[0]?.email_address;

    if (!primaryEmail) {
      return new Response("No email address found on user", { status: 400 });
    }

    await db.user.create({
      data: {
        id,           // Clerk user ID is the PK — keeps auth and DB in sync
        email: primaryEmail,
      },
    });

    console.log(`[webhook] Created user: ${id} (${primaryEmail})`);
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, primary_email_address_id } = event.data;

    const primaryEmail =
      email_addresses.find((e) => e.id === primary_email_address_id)
        ?.email_address ?? email_addresses[0]?.email_address;

    if (primaryEmail) {
      await db.user.update({
        where: { id },
        data: { email: primaryEmail },
      });
      console.log(`[webhook] Updated user: ${id}`);
    }
  }

  if (eventType === "user.deleted") {
    const { id } = event.data;
    if (id) {
      // Cascade deletes handle Profile, SavedScholarship, MatchReview
      await db.user.delete({ where: { id } });
      console.log(`[webhook] Deleted user: ${id}`);
    }
  }

  return new Response("OK", { status: 200 });
}
