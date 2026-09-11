import { NextRequest, NextResponse } from "next/server";
import { invokeFunnel } from "@/lib/funnel-lambda";

const VALID_KINDS = new Set([
  "discovery_call",
  "project_discussion",
  "site_walkthrough",
]);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const kind = searchParams.get("kind") ?? "discovery_call";

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "invalid or missing date; expected YYYY-MM-DD" },
      { status: 400 },
    );
  }
  if (!VALID_KINDS.has(kind)) {
    return NextResponse.json({ error: "invalid booking_kind" }, { status: 400 });
  }

  try {
    const { statusCode, body } = await invokeFunnel({
      source: "booking_slots",
      date,
      booking_kind: kind,
    });
    if (statusCode !== 200) {
      return NextResponse.json(
        { error: "failed to fetch slots" },
        { status: 502 },
      );
    }
    const parsed = body as { slots?: string[] };
    return NextResponse.json({ slots: parsed.slots ?? [] });
  } catch (err) {
    console.error("booking/slots failed:", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
