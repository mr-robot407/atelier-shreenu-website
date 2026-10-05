import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { ALLOWED_ORIGINS } from "@/lib/allowed-origins";

export const dynamic = "force-dynamic";

const MIN_PAISE = 100;
const MAX_PAISE = 1_00_00_000; // ₹1,00,000 — sanity cap; raise if needed

type OrderRequest = {
  amount?: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
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

  let body: OrderRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount < MIN_PAISE || amount > MAX_PAISE) {
    return NextResponse.json(
      { error: `amount must be an integer between ${MIN_PAISE} and ${MAX_PAISE} paise` },
      { status: 400 },
    );
  }

  const currency = (body.currency ?? "INR").toUpperCase();
  const receipt =
    (body.receipt ?? `rcpt_${Date.now()}`).toString().slice(0, 40); // Razorpay caps receipt at 40

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency,
      receipt,
      notes: body.notes,
    });
    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
    });
  } catch (err: unknown) {
    const message = (err as Error)?.message ?? "razorpay error";
    const status = /auth/i.test(message) ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
