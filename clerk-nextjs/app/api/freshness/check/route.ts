import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { resend } from "../../../../lib/resend";
import { extractScholarshipFields } from "../../../../lib/freshness/extractScholarshipFields";
import { detectChanges } from "../../../../lib/freshness/detectChanges";
import { buildChangeEmail } from "../../../../lib/freshness/buildChangeEmail";

export async function GET(req: Request) {
  // STEP 1 — Auth check (same as reminders cron)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // For manual testing, allow if query param matches
    const url = new URL(req.url);
    if (url.searchParams.get("key") !== process.env.CRON_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const now = new Date();
  console.log(`[Freshness] Job started at ${now.toISOString()}`);

  const results = {
    checked: 0,
    changesFound: 0,
    alertsSent: 0,
    errors: [] as string[]
  };

  try {
    // STEP 2 — Find scholarships due for re-check (72 hours since last check)
    const url = new URL(req.url);
    const force = url.searchParams.get("force") === "true";
    const cutoff = new Date(Date.now() - 72 * 60 * 60 * 1000);

    const savedToCheck = await db.savedScholarship.findMany({
      where: {
        OR: force ? undefined : [
          { lastCheckedAt: null },
          { lastCheckedAt: { lt: cutoff } }
        ],
        scholarship: { isActive: true }
      },
      include: { scholarship: true },
      take: 50 // process max 50 per run
    });

    // STEP 3 — Process each saved scholarship
    for (const item of savedToCheck) {
      if (!item.scholarship.sourceUrl) continue;
      results.checked++;

      try {
        // a. Call extractScholarshipFields(sourceUrl)
        const extracted = await extractScholarshipFields(item.scholarship.sourceUrl);
        
        if (!extracted) {
          // If null (fetch failed) → skip, do NOT update lastCheckedAt so it retries
          continue;
        }

        // b. Call detectChanges(stored, extracted)
        const { hasChanges, changes } = detectChanges(item.scholarship, extracted);

        // c. Update lastCheckedAt and scholarship.lastCrawledAt
        await db.savedScholarship.update({
          where: { id: item.id },
          data: { lastCheckedAt: new Date() }
        });

        await db.scholarship.update({
          where: { id: item.scholarshipId },
          data: { lastCrawledAt: new Date() }
        });

        // d. If hasChanges AND !item.changeAlerted
        if (hasChanges) {
          results.changesFound++;

          // Update the scholarship record in DB
          const updateData: any = {
            isActive: extracted.isActive,
            lastChangedAt: new Date(),
          };

          if (extracted.deadline && !isNaN(Date.parse(extracted.deadline))) {
            updateData.deadline = new Date(extracted.deadline);
          }

          await db.scholarship.update({
            where: { id: item.scholarshipId },
            data: updateData
          });

          if (!item.changeAlerted && item.reminderEmail) {
            // Send change alert email via Resend
            const { subject, html } = buildChangeEmail(
              item.scholarship,
              changes,
              process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
            );

            await resend.emails.send({
              from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
              to: item.reminderEmail,
              subject,
              html
            });

            // Mark as alerted
            await db.savedScholarship.update({
              where: { id: item.id },
              data: { changeAlerted: true }
            });

            // If scholarship is now closed, cancel pending reminders
            if (!extracted.isActive) {
              await db.savedScholarship.update({
                where: { id: item.id },
                data: {
                  reminder30d: false,
                  reminder7d: false,
                  reminder1d: false
                }
              });
            }

            results.alertsSent++;
          }
        } else if (item.changeAlerted) {
          // e. If !hasChanges AND item.changeAlerted (scholarship recovered)
          await db.savedScholarship.update({
            where: { id: item.id },
            data: { changeAlerted: false }
          });
        }

      } catch (itemError: any) {
        console.error(`[Freshness] Error processing item ${item.id}:`, itemError);
        results.errors.push(`Item ${item.id}: ${itemError.message}`);
      }
    }

    console.log(`[Freshness] Job finished:`, results);
    return NextResponse.json(results);
  } catch (err: any) {
    console.error("[Freshness Job Error]", err);
    return NextResponse.json({ 
      error: "internal_error", 
      details: err.message 
    }, { status: 500 });
  }
}
