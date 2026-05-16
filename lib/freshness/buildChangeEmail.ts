import { Scholarship } from "@prisma/client";
import { ChangeDetail } from "./detectChanges";

export function buildChangeEmail(
  scholarship: Scholarship,
  changes: ChangeDetail[],
  appUrl: string
): { subject: string; html: string } {
  const isCritical = changes.some(c => c.severity === "critical");
  const isClosed = changes.some(c => c.field === "isActive" && c.newValue === "closed");
  const deadlineMoved = changes.find(c => c.field === "deadline");

  let subject = `Update on your saved scholarship: ${scholarship.title}`;
  if (isCritical) {
    if (isClosed) {
      subject = `Scholarship closed: ${scholarship.title}`;
    } else if (deadlineMoved) {
      subject = `Deadline changed: ${scholarship.title}`;
    }
  }

  const changesHtml = changes.map(c => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #4a5568;">
        ${c.field.charAt(0).toUpperCase() + c.field.slice(1)}:
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #edf2f7; color: #718096;">
        <span style="text-decoration: line-through; color: #a0aec0;">${c.previousValue}</span> 
        <span style="color: ${c.severity === 'critical' ? '#e53e3e' : '#3182ce'}; margin-left: 8px;">→ ${c.newValue}</span>
      </td>
    </tr>
  `).join("");

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2d3748; line-height: 1.6;">
      <h2 style="color: #2b6cb0;">${scholarship.title}</h2>
      <p style="color: #4a5568; font-weight: bold;">Provider: ${scholarship.provider}</p>
      
      <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
        <h3 style="margin-top: 0; font-size: 16px; color: #2d3748;">What changed:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${changesHtml}
        </table>
      </div>

      ${isClosed ? `
        <div style="background-color: #fff5f5; padding: 15px; border-radius: 6px; border-left: 4px solid #f56565; margin: 20px 0;">
          <p style="margin: 0; color: #c53030;"><strong>Note:</strong> This scholarship is now closed. We recommend finding an alternative.</p>
        </div>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${appUrl}/dashboard" style="background-color: #3182ce; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">View your other matches →</a>
        </p>
      ` : `
        <p style="text-align: center; margin: 30px 0;">
          <a href="${appUrl}/scholarship/${scholarship.id}" style="background-color: #3182ce; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">View updated scholarship →</a>
        </p>
      `}

      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
      <p style="font-size: 12px; color: #a0aec0; text-align: center;">
        You are receiving this because you saved this scholarship on ScholarMatch.
      </p>
    </div>
  `;

  return { subject, html };
}
