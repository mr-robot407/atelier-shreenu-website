import { NextRequest, NextResponse } from "next/server";
import { invokeFunnel } from "@/lib/funnel-lambda";

const ALLOWED_ORIGINS = [
  "https://ateliershreenu.com",
  "https://www.ateliershreenu.com",
  "http://localhost:3000",
];

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") ?? "";
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let data: { email?: string; first_name?: string; slot_iso?: string };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const email = (data.email ?? "").trim();
  const firstName = (data.first_name ?? "").trim();
  const slotIso = (data.slot_iso ?? "").trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }
  if (!slotIso) {
    return NextResponse.json({ error: "missing slot_iso" }, { status: 400 });
  }

  try {
    const { statusCode, body } = await invokeFunnel({
      source: "booking_discovery",
      email,
      first_name: firstName || "Guest",
      slot_iso: slotIso,
    });
    if (statusCode === 200) {
      return NextResponse.json({ ok: true });
    }
    const text = typeof body === "string" ? body : JSON.stringify(body);
    return NextResponse.json({ error: text }, { status: statusCode });
  } catch (err) {
    console.error("booking/confirm-discovery failed:", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
