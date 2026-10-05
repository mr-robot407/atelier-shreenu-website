import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { ALLOWED_ORIGINS } from "@/lib/allowed-origins";

export const dynamic = "force-dynamic";

const VALID_KINDS = new Set(["project_discussion", "site_walkthrough"]);
const VALID_VARIANTS = new Set(["any", "ncr", "outside_ncr"]);

// v13 fee schedule — amounts in paise, inclusive of 18% GST.
// Kept in sync with /book/page.tsx PATHS and email-templates.ts copy.
const FEES_PAISE: Record<string, number> = {
  "project_discussion:any": 177000,
  "site_walkthrough:ncr": 354000,
  "site_walkthrough:outside_ncr": 708000,
};

const DESCRIPTIONS: Record<string, string> = {
  "project_discussion:any": "Project Discussion · Online (30 min)",
  "site_walkthrough:ncr": "Site Visit · Within NCR (60 min)",
  "site_walkthrough:outside_ncr": "Site Visit · Outside NCR (2 hours)",
};

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") ?? "";
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Razorpay credentials not configured" },
      { status: 500 },
    );
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

  const feeKey = `${kind}:${variant}`;
  const amountPaise = FEES_PAISE[feeKey];
  if (!amountPaise) {
    return NextResponse.json(
      { error: `no fee configured for ${feeKey}` },
      { status: 400 },
    );
  }

  // Receipt is capped at 40 chars by Razorpay — keep it human but short.
  const receipt = `bk_${kind.slice(0, 4)}_${Date.now().toString(36)}`.slice(0, 40);

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt,
      notes: {
        email,
        first_name: firstName,
        slot_iso: slotIso,
        booking_kind: kind,
        variant,
        terms_accepted_at: termsAcceptedAt,
      },
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
      description: DESCRIPTIONS[feeKey],
    });
  } catch (err: unknown) {
    const message = (err as Error)?.message ?? "razorpay error";
    const status = /auth|invalid_api_key/i.test(message) ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
