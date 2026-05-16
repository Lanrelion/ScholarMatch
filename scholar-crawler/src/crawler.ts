import "dotenv/config"
import { PlaywrightCrawler } from "crawlee"
import Anthropic from "@anthropic-ai/sdk"
import { db } from "./db"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
})

const AFRICAN_ISO_CODES = [
  "DZ", "AO", "BJ", "BW", "BF", "BI", "CV", "CM", "CF", "TD", "KM", "CD", "CG", 
  "CI", "DJ", "EG", "GQ", "ER", "SZ", "ET", "GA", "GM", "GH", "GN", "GW", "KE", 
  "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG", 
  "RW", "ST", "SN", "SC", "SL", "SO", "ZA", "SS", "SD", "TZ", "TG", "TN", "UG", 
  "ZM", "ZW"
];

export const crawler = new PlaywrightCrawler({
  maxRequestsPerCrawl: 100,
  maxConcurrency: 3,
  requestHandlerTimeoutSecs: 30,

  // Respectful crawling
  minConcurrency: 1,
  maxRequestRetries: 2,
  navigationTimeoutSecs: 20,

  async requestHandler({ request, page, log }) {
    log.info(`Crawling: ${request.url}`)

    // Extract text content
    const text = await page.evaluate(() => {
      const el = document.body
      return el ? el.innerText.slice(0, 5000) : ""
    })

    if (text.length < 200) {
      log.warning(`Skipping thin page: ${request.url}`)
      return
    }

    // Ask Claude to identify scholarship links 
    // on listing pages
    if (request.label === "LISTING") {
      const links = await page.$$eval("a[href]", 
        (els: Element[]) => els.map(el => ({
          href: (el as HTMLAnchorElement).href,
          text: el.textContent?.trim() ?? ""
        }))
      )

      const schLinks = links.filter((l: { href: string; text: string }) => 
        l.text.toLowerCase().includes("scholarship")
        || l.text.toLowerCase().includes("bursary")
        || l.text.toLowerCase().includes("grant")
        || l.text.toLowerCase().includes("award")
      ).slice(0, 20)

      for (const link of schLinks) {
        await crawler.addRequests([{
          url: link.href,
          label: "SCHOLARSHIP"
        }])
      }
      return
    }

    // SCHOLARSHIP page — extract structured data
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 800,
      messages: [{
        role: "user",
        content: `Extract scholarship data from this 
webpage. Return ONLY valid JSON, no markdown.

{
  "title": "full scholarship name",
  "funder": "organisation name",
  "description": "2-3 sentence description",
  "amount": "funding amount or null",
  "currency": "3-letter code or null",
  "deadline": "YYYY-MM-DD or null",
  "isActive": true or false,
  "degreeLevel": ["UNDERGRADUATE","MASTERS","PHD"],
  "fields": ["field1", "field2"],
  "nationalityRule": "all_african" | 
    "specific" | "worldwide" | "unknown",
  "specificCountries": ["NG","KE"] or [],
  "gpaMinimum": number or null,
  "financialNeedRequired": true or false or null,
  "fundingType": "full" | "partial" | "unknown",
  "universityName": "name or null",
  "universityCountry": "ISO code or null",
  "programName": "program name or null",
  "applicationRoute": "DIRECT" | 
    "ADMISSION_FIRST" | "AUTOMATIC",
  "isScholarship": true or false
}

If this page is not a scholarship page, 
return { "isScholarship": false }

Webpage text:
${text}`
      }]
    })

    const raw = message.content[0].type === "text"
      ? message.content[0].text.trim()
      : null
    
    if (!raw) return

    let parsed: any
    try {
      // Same JSON hunter as freshness extractor
      const match = raw.match(/\{[\s\S]*\}/)
      parsed = JSON.parse(match?.[0] ?? raw)
    } catch { return }

    if (!parsed.isScholarship || !parsed.title) return

    // Expand nationality rule
    let eligibleNationalities: string[] = []
    if (parsed.nationalityRule === "all_african") {
      eligibleNationalities = AFRICAN_ISO_CODES
    } else if (parsed.nationalityRule === "specific") {
      eligibleNationalities = parsed.specificCountries
    }
    // "worldwide" and "unknown" → empty array 
    // (no restriction in matching)

    // Upsert — keyed on sourceUrl
    await db.scholarship.upsert({
      where: { sourceUrl: request.url },
      create: {
        title: parsed.title,
        provider: parsed.funder ?? "Unknown",
        sourceUrl: request.url,
        sourceDomain: new URL(request.url).hostname
          .replace("www.", ""),
        description: parsed.description,
        amount: parsed.amount 
          ? parseFloat(parsed.amount) : null,
        currency: parsed.currency || "USD",
        deadline: parsed.deadline 
          ? new Date(parsed.deadline) : null,
        eligibleDegrees: parsed.degreeLevel ?? [],
        fieldsOfStudy: parsed.fields ?? [],
        eligibleNationalities,
        eligibilityRaw: text.slice(0, 2000),
        eligibilityParsed: {
          gpaMinimum: parsed.gpaMinimum,
          financialNeedRequired: 
            parsed.financialNeedRequired,
          fundingType: parsed.fundingType,
        },
        universityName: parsed.universityName,
        universityCountry: parsed.universityCountry,
        programName: parsed.programName,
        scholarshipType: parsed.universityName 
          ? "UNIVERSITY" : "NATIONAL",
        applicationRoute: parsed.applicationRoute 
          ?? "DIRECT",
        isActive: false,    // ← ALWAYS false
        verified: false,    // ← ALWAYS false
        lastCrawledAt: new Date(),
      },
      update: {
        // Update content fields but NEVER 
        // overwrite isActive or verified
        title: parsed.title,
        deadline: parsed.deadline 
          ? new Date(parsed.deadline) : null,
        eligibilityRaw: text.slice(0, 2000),
        lastCrawledAt: new Date(),
      }
    })

    log.info(`Saved: ${parsed.title}`)
  },

  failedRequestHandler({ request, log }) {
    log.error(`Failed: ${request.url}`)
  }
})
