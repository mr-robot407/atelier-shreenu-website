// Rule-based spam / imposter classifier for contact-form submissions. Runs on
// every /api/contact submission; if flagged, the studio notify email gets a
// prominent banner and the DDB record is tagged for later review. It never
// blocks a submission — the studio still sees every enquiry, just with an
// unmistakable warning.
//
// Rules were tuned against real incoming spam (SEO backlink outreach, equity
// fundraising pitches, vendor solicitations posing as project enquiries).
// Add new patterns here as new spam shapes appear.

export type SpamResult = {
  flagged: boolean;
  reasons: string[];
};

type Rule = {
  reason: string;
  test: (haystack: string, fields: Record<string, string>) => boolean;
};

const RULES: Rule[] = [
  {
    reason: "backlink_outreach",
    test: (h) =>
      /\b(backlink|back-link|link[- ]building|guest[- ]post|guest[- ]blog|domain authority|dofollow|do[- ]follow|off[- ]page seo|seo audit|gap analysis|competitor analysis|reviewed your website|analysed your website|keyword ranking)\b/i.test(
        h,
      ),
  },
  {
    reason: "investment_pitch",
    test: (h) =>
      /\b(equity (?:fund|funding|fundraising|raise)|fund raising|ticket size|hni fund|family office|venture capital|private equity|debt syndication|investing in indian|angel invest|series [a-c] round)\b/i.test(
        h,
      ),
  },
  {
    reason: "vendor_solicit",
    test: (h, fields) => {
      // Only meaningful on project/careers submissions — vendor form is *supposed* to sound like this.
      if (fields.formType === "vendor" || fields.company_name || fields.category) {
        return false;
      }
      const message = (fields.message ?? "").toLowerCase();
      return /\b(we (?:supply|offer|provide|manufacture|deal in|specialise in|specialize in)|our (?:services|products|catalog|catalogue|portfolio of services)|quote for your|we can (?:supply|provide|offer)|reach out to us for|best (?:prices|rates))\b/i.test(
        message,
      );
    },
  },
  {
    reason: "crypto_or_forex",
    test: (h) =>
      /\b(crypto(?:currency)?|bitcoin|forex|binary options|trading signals|nft (?:mint|drop|project))\b/i.test(
        h,
      ),
  },
  {
    reason: "throwaway_email",
    test: (_h, fields) => {
      const email = (fields.email ?? "").toLowerCase();
      return /@(?:tempmail|mailinator|guerrillamail|throwaway|10minutemail|yopmail|trashmail|maildrop|dispostable|getnada)\./.test(
        email,
      );
    },
  },
  {
    reason: "phone_country_mismatch",
    test: (_h, fields) => {
      const phone = (fields.phone ?? "").replace(/\s|-|\(|\)/g, "");
      const location = (fields.location ?? "").toLowerCase();
      if (!phone || !location) return false;
      // Indian project location but phone starts with a non-Indian country code.
      const looksIndianLocation =
        /\b(india|delhi|gurugram|gurgaon|noida|mumbai|bangalore|bengaluru|kolkata|chennai|hyderabad|pune|jaipur|ahmedabad|nashik|vrindavan|goa|kerala|rajasthan)\b/.test(
          location,
        );
      const startsWithUsCode = /^\+?1[2-9]\d{9}$/.test(phone);
      const startsWithUkCode = /^\+?44/.test(phone);
      if (looksIndianLocation && (startsWithUsCode || startsWithUkCode)) return true;
      // Non-Indian project location with an Indian +91 number — much rarer,
      // don't flag by default (many NRIs legitimately fit this pattern).
      return false;
    },
  },
  {
    reason: "generic_greeting_only",
    test: (_h, fields) => {
      const message = (fields.message ?? "").trim();
      if (!message) return false;
      // Very short, generic openers with no project content.
      if (message.length < 25) return false;
      return /^(?:hi|hello|hey|dear (?:team|sir|madam)|greetings)[,.!\s]*(?:i am|my name is|this is)?[^.]{0,60}$/i.test(
        message,
      );
    },
  },
];

export function classifySubmission(
  fields: Record<string, string>,
): SpamResult {
  // Concatenate all searchable text once so rules can regex over the whole payload.
  const haystack = Object.values(fields).filter((v) => typeof v === "string").join("\n");
  const reasons: string[] = [];
  for (const rule of RULES) {
    if (rule.test(haystack, fields)) reasons.push(rule.reason);
  }
  return { flagged: reasons.length > 0, reasons };
}

// Human-readable one-line explanation for each reason, used inside the banner
// in the notification email. Kept short and studio-appropriate.
const REASON_LABELS: Record<string, string> = {
  backlink_outreach: "SEO / backlink outreach language",
  investment_pitch: "investment or fundraising pitch",
  vendor_solicit: "vendor pitching services in a project enquiry",
  crypto_or_forex: "crypto / forex / trading solicitation",
  throwaway_email: "throwaway email domain",
  phone_country_mismatch: "phone country code does not match project location",
  generic_greeting_only: "generic greeting with no project detail",
};

export function reasonLabels(reasons: string[]): string[] {
  return reasons.map((r) => REASON_LABELS[r] ?? r);
}
