// Single source of truth for the pre-signing terms shown on /book and echoed
// into the post-payment confirmation email. The Terms modal on /book renders
// these; /api/booking/create-payment-link forwards the same blocks to the
// as-email-funnel Lambda so the confirmation email quotes verbatim what the
// client accepted at checkout.

export type BookingKind = "discovery_call" | "project_discussion" | "site_walkthrough";
export type BookingVariant = "any" | "ncr" | "outside_ncr";

export type TermsBlock = { title: string; body: string };

const CONFIRMATION_CREDIT: TermsBlock = {
  title: "90-Day Confirmation Credit",
  body:
    "This fee is not simply an additional cost. If a Design Consultancy Agreement for this project is signed, or treated as accepted under its Implied Acceptance by Payment clause, within ninety (90) calendar days of the date the fee was paid for a Project Discussion (online meeting) or a Site & Vision Walkthrough (within or outside NCR), the full amount is credited against the Stage 01 invoice under that Agreement.",
};

const CANCELLATION_REFUND: TermsBlock = {
  title: "Cancellation & Refund",
  body:
    "Where a Project Discussion or a Site & Vision Walkthrough (within or outside NCR) is cancelled or rescheduled by the Client, the fee is refunded in full with more than 48 hours' notice; the Firm retains 50% of the fee with 24 to 48 hours' notice; and the full fee is retained for less than 24 hours' notice or a no-show. Any travel or accommodation cost already arranged or incurred by the Firm in connection with the visit is non-refundable in all circumstances, regardless of when notice of cancellation is given, as set out in our Pre-Signing Fee Schedule.",
};

function travelBlockFor(kind: BookingKind, variant: BookingVariant): TermsBlock {
  if (kind !== "site_walkthrough") {
    return {
      title: "Format",
      body:
        "The Project Discussion is conducted on Google Meet; no travel arrangements apply.",
    };
  }
  if (variant === "outside_ncr") {
    return {
      title: "Travel & Accommodation, Outside NCR",
      body:
        "Travel and accommodation outside NCR are arranged and billed separately to the Client at actuals. Airline flights are the Firm's preferred mode of transport where feasible; taxi fares are billed in addition. The Firm does not travel by train or bus. Accommodation is booked at a minimum 4-star business hotel; the Firm does not accept accommodation as a guest in the Client's home.",
    };
  }
  return {
    title: "Travel & Expenses, Within NCR",
    body:
      "Travel and expenses within NCR are arranged and billed separately to the Client at actuals. Fares for Uber Black or an equivalent taxi service are quoted upon receipt of the site location and shall be cleared in full before departure.",
  };
}

// Returns the full set of pre-signing T&C blocks for a paid tier. Discovery
// Call is complimentary and has no terms — callers should skip this for that
// kind.
export function bookingTermsFor(
  kind: BookingKind,
  variant: BookingVariant,
): TermsBlock[] {
  if (kind === "discovery_call") return [];
  return [
    CONFIRMATION_CREDIT,
    CANCELLATION_REFUND,
    travelBlockFor(kind, variant),
  ];
}

// Simple HTML entity escape so block bodies can be safely embedded into email
// HTML without opening XSS via user content (bodies are static, but the utility
// keeps future edits safe).
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Renders the T&C blocks as a self-contained HTML fragment styled to sit
// inside the studio's confirmation email. No external CSS assumed; every rule
// is inline.
export function renderBookingTermsHtml(blocks: TermsBlock[]): string {
  if (!blocks.length) return "";
  const items = blocks
    .map(
      (b) => `
    <div style="margin-top:20px">
      <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#2C2C2C">${escapeHtml(b.title)}</div>
      <p style="margin:6px 0 0;font-family:Jost,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#2C2C2C">${escapeHtml(b.body)}</p>
    </div>`,
    )
    .join("");
  return `
  <div style="margin-top:32px;padding:20px 22px;background:#FAF7F2;border:1px solid #E4DED4">
    <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#7A6E5D">Atelier Shreenu · Pre-Signing Terms Accepted</div>
    ${items}
  </div>`;
}

// Renders the same blocks as plain text for the multipart/alternative text
// part of the email.
export function renderBookingTermsText(blocks: TermsBlock[]): string {
  if (!blocks.length) return "";
  return [
    "PRE-SIGNING TERMS ACCEPTED",
    "----------------------------------------",
    ...blocks.flatMap((b) => [b.title.toUpperCase(), b.body, ""]),
  ].join("\n");
}
