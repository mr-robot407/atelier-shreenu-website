import { NextRequest, NextResponse } from "next/server";
import { invokeFunnel } from "@/lib/funnel-lambda";
import {
  bookingTermsFor,
  renderBookingTermsHtml,
  renderBookingTermsText,
  type BookingKind,
  type BookingVariant,
} from "@/content/booking-terms";

const ALLOWED_ORIGINS = [
  "https://ateliershreenu.com",
  "https://www.ateliershreenu.com",
  "http://localhost:3000",
];

const VALID_KINDS = new Set(["project_discussion", "site_walkthrough"]);
const VALID_VARIANTS = new Set(["any", "ncr", "outside_ncr"]);

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") ?? "";
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let data: {
    email?: string;
    first_name?: string;
    slot_iso?: string;
    booking_kind?: string;
    variant?: string;
    terms_accepted_at?: string;
  };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const email = (data.email ?? "").trim();
  const firstName = (data.first_name ?? "").trim();
  const slotIso = (data.slot_iso ?? "").trim();
  const kind = (data.booking_kind ?? "").trim();
  const variant = (data.variant ?? "any").trim();
  const termsAcceptedAt = (data.terms_accepted_at ?? "").trim();

  if (!termsAcceptedAt || Number.isNaN(Date.parse(termsAcceptedAt))) {
    return NextResponse.json(
      { error: "terms must be accepted before payment" },
      { status: 400 },
    );
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }
  if (!slotIso) {
    return NextResponse.json({ error: "missing slot_iso" }, { status: 400 });
  }
  if (!VALID_KINDS.has(kind)) {
    return NextResponse.json({ error: "invalid booking_kind" }, { status: 400 });
  }
  if (!VALID_VARIANTS.has(variant)) {
    return NextResponse.json({ error: "invalid variant" }, { status: 400 });
  }
  if (kind === "site_walkthrough" && variant === "any") {
    return NextResponse.json(
      { error: "site_walkthrough requires variant=ncr|outside_ncr" },
      { status: 400 },
    );
  }

  // Forward the exact T&C blocks the client accepted at checkout so the
  // as-email-funnel Lambda can quote them verbatim in the confirmation email.
  const termsBlocks = bookingTermsFor(kind as BookingKind, variant as BookingVariant);

  try {
    const { statusCode, body } = await invokeFunnel({
      source: "booking_payment_link",
      email,
      first_name: firstName || "Guest",
      slot_iso: slotIso,
      booking_kind: kind,
      variant,
      terms_accepted_at: termsAcceptedAt,
      terms_blocks: termsBlocks,
      terms_html: renderBookingTermsHtml(termsBlocks),
      terms_text: renderBookingTermsText(termsBlocks),
    });
    if (statusCode === 200) {
      const parsed = body as { url?: string; reference_id?: string };
      if (!parsed.url) {
        return NextResponse.json(
          { error: "payment link had no url" },
          { status: 502 },
        );
      }
      return NextResponse.json({ url: parsed.url, reference_id: parsed.reference_id });
    }
    const text = typeof body === "string" ? body : JSON.stringify(body);
    return NextResponse.json({ error: text }, { status: statusCode });
  } catch (err) {
    console.error("booking/create-payment-link failed:", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
