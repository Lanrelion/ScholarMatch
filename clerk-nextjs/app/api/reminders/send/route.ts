import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { resend } from "../../../../lib/resend";

export async function GET(req: Request) {
  console.log("[Cron] Auth bypass enabled for testing.");
  // const cronAuth = req.headers.get("x-cron-auth");
  // if (cronAuth !== process.env.CRON_SECRET) {
  //   return new Response("Unauthorized", { status: 401 });
  // }

  const now = new Date();
  console.log(`[Cron] Reminders job started at ${now.toISOString()}`);
  const errors: string[] = [];
  const results = { "30d": 0, "7d": 0, "1d": 0 };

  try {
    // 1. 30-day reminders
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const in29Days = new Date(now.getTime() + 29 * 24 * 60 * 60 * 1000);
    const thirtyDayReminders = await db.savedScholarship.findMany({
      where: {
        reminder30d: true,
        reminderEmail: { not: null },
        scholarship: {
          isActive: true,
          deadline: { lte: in30Days }
        }
      },
      include: { scholarship: true }
    });
    console.log(`[Cron] 30d check: threshold=${in30Days.toISOString()}, found=${thirtyDayReminders.length}`);
    for (const r of thirtyDayReminders) {
      await sendReminder(r, "30d", results, errors);
      await db.savedScholarship.update({ where: { id: r.id }, data: { reminder30d: false } });
    }

    // 2. 7-day reminders
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const in6Days = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000);
    const sevenDayReminders = await db.savedScholarship.findMany({
      where: {
        reminder7d: true,
        reminderEmail: { not: null },
        scholarship: {
          isActive: true,
          deadline: { lte: in7Days }
        }
      },
      include: { scholarship: true }
    });
    for (const r of sevenDayReminders) {
      await sendReminder(r, "7d", results, errors);
      await db.savedScholarship.update({ where: { id: r.id }, data: { reminder7d: false } });
    }

    // 3. 1-day reminders
    const in1Day = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
    const oneDayReminders = await db.savedScholarship.findMany({
      where: {
        reminder1d: true,
        reminderEmail: { not: null },
        scholarship: {
          isActive: true,
          deadline: { lte: in1Day }
        }
      },
      include: { scholarship: true }
    });
    for (const r of oneDayReminders) {
      await sendReminder(r, "1d", results, errors);
      await db.savedScholarship.update({ where: { id: r.id }, data: { reminder1d: false } });
    }

    console.log(`[Cron] Finished. Sent:`, results);
    return NextResponse.json({ sent: results, errors });
  } catch (err: any) {
    console.error("[Cron Error]", err);
    return NextResponse.json({ error: "internal_error", details: err.message, stack: err.stack }, { status: 500 });
  }
}

async function sendReminder(record: any, type: "30d" | "7d" | "1d", results: any, errors: string[]) {
  const scholarship = record.scholarship;
  const deadlineFormatted = new Date(scholarship.deadline).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  const subjects = {
    "30d": `30 days left — ${scholarship.title}`,
    "7d": `One week left to apply — ${scholarship.title}`,
    "1d": `Last chance — ${scholarship.title} closes tomorrow`
  };

  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: record.reminderEmail!,
      subject: `Reminder: ${scholarship.title} deadline in ${type}`,
      html: `
        <h2>Scholarship Deadline Reminder</h2>
        <p>This is a reminder that the scholarship <strong>${scholarship.title}</strong> is due in <strong>${type}</strong>.</p>
        <p>Deadline: ${new Date(scholarship.deadline).toLocaleDateString()}</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/scholarship/${scholarship.id}">View Details</a></p>
      `
    });
    console.log(`[Cron] Resend response for ${scholarship.id}:`, JSON.stringify(data));
    results[type]++;
  } catch (err: any) {
    console.error(`[Cron] Resend Error for ${scholarship.id}:`, err);
    errors.push(`Failed to send ${type} for ${scholarship.id}: ${err.message}`);
  }
}
