import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { ALLOWED_ORIGINS } from "@/lib/allowed-origins";

export const dynamic = "force-dynamic";

type VerifyRequest = {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
};

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") ?? "";
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json(
      { error: "Razorpay credentials not configured" },
      { status: 500 },
    );
  }

  let body: VerifyRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json(
      { error: "missing razorpay_order_id, razorpay_payment_id, or razorpay_signature" },
      { status: 400 },
    );
  }

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const expectedBuf = Buffer.from(expected, "hex");
  const receivedBuf = Buffer.from(razorpay_signature, "hex");
  const ok =
    expectedBuf.length === receivedBuf.length &&
    crypto.timingSafeEqual(expectedBuf, receivedBuf);

  if (!ok) {
    return NextResponse.json(
      { verified: false, error: "signature mismatch" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    verified: true,
    order_id: razorpay_order_id,
    payment_id: razorpay_payment_id,
  });
}
