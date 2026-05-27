import { Scholarship } from "@prisma/client";
import { ExtractedFields } from "./extractScholarshipFields";

export type ChangeDetail = {
  field: "deadline" | "isActive" | "amount" | "eligibility";
  previousValue: string;
  newValue: string;
  severity: "critical" | "info"; // critical = scholarship closed or deadline moved, info = amount or eligibility wording changed
};

export type ChangeResult = {
  hasChanges: boolean;
  changes: ChangeDetail[];
};

export function detectChanges(
  stored: Scholarship,
  extracted: ExtractedFields
): ChangeResult {
  const changes: ChangeDetail[] = [];

  // 1. Deadline change
  if (extracted.deadline) {
    const extractedDate = new Date(extracted.deadline);
    const storedDate = stored.deadline ? new Date(stored.deadline) : null;

    if (!storedDate || Math.abs(extractedDate.getTime() - storedDate.getTime()) > 24 * 60 * 60 * 1000) {
      changes.push({
        field: "deadline",
        previousValue: storedDate?.toISOString().split('T')[0] ?? "unknown",
        newValue: extracted.deadline,
        severity: "critical"
      });
    }
  }

  // 2. isActive change
  if (extracted.isActive === false && stored.isActive === true) {
    changes.push({
      field: "isActive",
      previousValue: "open",
      newValue: "closed",
      severity: "critical"
    });
  }

  // 3. Amount change
  if (extracted.amount && stored.amount) {
    // Compare as simplified strings to avoid minor formatting noise
    const storedAmountStr = stored.amount.toString().replace(/[^\d.]/g, '');
    const extractedAmountStr = extracted.amount.replace(/[^\d.]/g, '');
    
    if (storedAmountStr !== extractedAmountStr && extractedAmountStr !== "") {
      changes.push({
        field: "amount",
        previousValue: stored.amount.toString(),
        newValue: extracted.amount,
        severity: "info"
      });
    }
  }

  return { 
    hasChanges: changes.length > 0, 
    changes 
  };
}
