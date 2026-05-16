import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resend } from "@/lib/resend";
import { sendPushNotification } from "@/lib/webpush";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const now = new Date();
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
          deadline: { gte: in29Days, lte: in30Days }
        }
      },
      include: { scholarship: true }
    });
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
          deadline: { gte: in6Days, lte: in7Days }
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
          deadline: { gte: now, lte: in1Day }
        }
      },
      include: { scholarship: true }
    });
    for (const r of oneDayReminders) {
      await sendReminder(r, "1d", results, errors);
      await db.savedScholarship.update({ where: { id: r.id }, data: { reminder1d: false } });
    }

    return NextResponse.json({ sent: results, errors });
  } catch (err: any) {
    console.error("Cron Error:", err);
    return NextResponse.json({ error: "internal_error", details: err.message }, { status: 500 });
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

  const pushLabels = {
    "30d": "30 days left — apply now",
    "7d": "7 days left — apply now",
    "1d": "Closing tomorrow — last chance"
  };

  try {
    // 1. Send Email
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: record.reminderEmail,
      subject: subjects[type],
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #374151;">
          <h1 style="color: #1D9E75; font-size: 20px;">${scholarship.title}</h1>
          <p><strong>Funder:</strong> ${scholarship.provider}</p>
          <p><strong>Deadline:</strong> ${deadlineFormatted}</p>
          <p><strong>Your Match Score:</strong> ${Math.round(record.matchScore * 100)}%</p>
          
          <div style="margin: 24px 0;">
            <a href="${scholarship.sourceUrl}" style="background-color: #1D9E75; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; display: inline-block;">Apply Now</a>
          </div>
          
          <p style="font-size: 14px; color: #6B7280;">
            View full details on ScholarMatch: <a href="${process.env.NEXT_PUBLIC_APP_URL}/scholarship/${scholarship.id}">${process.env.NEXT_PUBLIC_APP_URL}/scholarship/${scholarship.id}</a>
          </p>
          
          <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 32px 0;" />
          <p style="font-size: 12px; color: #9CA3AF;">
            You saved this scholarship on ScholarMatch. You can manage your reminder preferences in your saved scholarships list.
          </p>
        </div>
      `
    });

    // 2. Send Push Notifications
    const subscriptions = await db.pushSubscription.findMany({
      where: { userId: record.userId }
    });

    for (const sub of subscriptions) {
      const result = await sendPushNotification(sub, {
        title: pushLabels[type],
        body: scholarship.title,
        url: `/scholarship/${scholarship.id}`,
        tag: `reminder-${record.id}-${type}`
      });

      // Clean up expired subscriptions
      if (result.error === "410") {
        await db.pushSubscription.delete({
          where: { id: sub.id }
        });
      }
    }

    results[type]++;
  } catch (err: any) {
    errors.push(`Failed to send ${type} for ${scholarship.id}: ${err.message}`);
  }
}
