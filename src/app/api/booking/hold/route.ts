import { NextRequest, NextResponse } from "next/server";
import { invokeFunnel } from "@/lib/funnel-lambda";

const VALID_KINDS = new Set([
  "discovery_call",
  "project_discussion",
  "site_walkthrough",
]);

export async function POST(req: NextRequest) {
  let data: {
    slot_iso?: string;
    booking_kind?: string;
    variant?: string;
  };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const slotIso = (data.slot_iso ?? "").trim();
  const kind = (data.booking_kind ?? "").trim();
  const variant = (data.variant ?? "").trim();

  if (!slotIso) {
    return NextResponse.json({ error: "missing slot_iso" }, { status: 400 });
  }
  if (!VALID_KINDS.has(kind)) {
    return NextResponse.json({ error: "invalid booking_kind" }, { status: 400 });
  }

  try {
    const { statusCode, body } = await invokeFunnel({
      source: "hold_slot",
      slot_iso: slotIso,
      booking_kind: kind,
      variant,
    });
    if (statusCode === 409) {
      return NextResponse.json({ error: "slot_taken" }, { status: 409 });
    }
    if (statusCode !== 200) {
      return NextResponse.json({ error: "hold failed" }, { status: 502 });
    }
    const parsed = body as { hold_token?: string; ttl_minutes?: number };
    return NextResponse.json({
      hold_token: parsed.hold_token ?? "",
      ttl_minutes: parsed.ttl_minutes ?? 30,
    });
  } catch (err) {
    console.error("booking/hold failed:", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
