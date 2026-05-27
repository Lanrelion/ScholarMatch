import { Resend } from "resend";

if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_123456789") {
  console.warn("WARNING: RESEND_API_KEY is missing or using placeholder. Email sending will fail.");
}

export const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");
