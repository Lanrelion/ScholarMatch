import { anthropic } from "../anthropic";

export type ExtractedFields = {
  deadline: string | null;      // ISO date string or null
  isActive: boolean;            // false if closed/expired
  amount: string | null;        // raw amount text
  eligibilitySummary: string;   // one sentence summary
  rawText: string;              // first 2000 chars of page
};

export async function extractScholarshipFields(
  sourceUrl: string
): Promise<ExtractedFields | null> {
  try {
    // STEP 1 — Fetch the page
    const res = await fetch(sourceUrl, {
      headers: {
        "User-Agent": "ScholarMatchBot/1.0 (scholarship monitoring; contact: your@email.com)"
      },
      signal: AbortSignal.timeout(10000)  // 10s timeout
    });

    if (!res.ok) {
      console.warn(`[Freshness] Fetch failed for ${sourceUrl}: ${res.status}`);
      return null;
    }

    const html = await res.text();

    // Strip HTML tags to get readable text
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 4000);   // Claude context budget

    // STEP 2 — Ask Claude to extract fields
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620", // Using the correct available model name
      max_tokens: 500,
      messages: [{
        role: "user",
        content: `Extract scholarship information from this webpage text. Return ONLY valid JSON with these exact keys. No explanation, no markdown.

{
  "deadline": "YYYY-MM-DD or null if not found",
  "isActive": true or false (false if closed/expired/no longer accepting applications),
  "amount": "funding amount as text or null",
  "eligibilitySummary": "one sentence max"
}

Webpage text:
${text}`
      }]
    });

    const content = message.content[0];
    const raw = content.type === "text" ? content.text.trim() : null;

    if (!raw) {
      console.error("[Freshness] Claude returned empty response");
      return null;
    }

    // STEP 3 — Parse and return
    try {
      // Clean possible markdown backticks if Claude adds them
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      const cleanJson = jsonMatch ? jsonMatch[0] : raw;
      const parsed = JSON.parse(cleanJson);
      
      // Basic validation of the date
      if (parsed.deadline && isNaN(Date.parse(parsed.deadline))) {
        parsed.deadline = null;
      }
      
      return { 
        ...parsed, 
        rawText: text.slice(0, 2000) 
      };
    } catch (parseError) {
      console.error("[Freshness] JSON Parse error:", parseError, "Raw content:", raw);
      return null;
    }
  } catch (err) {
    console.error(`[Freshness] Error extracting fields for ${sourceUrl}:`, err);
    return null;
  }
}
