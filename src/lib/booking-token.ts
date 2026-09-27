// HMAC-signed tokens for one-click booking actions (e.g. Decline link in the
// studio notification email). The signing secret is injected at build time
// via BOOKING_ACTION_SECRET (see amplify.yml + aws-runtime-config.ts).
//
// Token format:  base64url(JSON payload) + "." + base64url(HMAC-SHA256)
// The payload always includes ts (issued-at, ms since epoch) so verifyAction
// can reject stale tokens.

import { createHmac, timingSafeEqual } from "crypto";
import { bookingActionSecret } from "@/lib/aws-runtime-config";

const DEFAULT_MAX_AGE_MS = 60 * 24 * 60 * 60 * 1000; // 60 days

function b64urlEncode(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf-8") : input;
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64urlDecode(input: string): Buffer {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  return Buffer.from(
    input.replace(/-/g, "+").replace(/_/g, "/") + pad,
    "base64",
  );
}

function getSecret(): string {
  if (bookingActionSecret) return bookingActionSecret;
  // Deterministic dev fallback so local testing works without extra setup.
  // Prod builds MUST have BOOKING_ACTION_SECRET set via amplify env vars,
  // otherwise the token space is trivially guessable.
  if (process.env.NODE_ENV !== "production") {
    return "atelier-shreenu-dev-only-secret-do-not-use-in-prod";
  }
  throw new Error("BOOKING_ACTION_SECRET is not configured");
}

export type BookingKindForToken =
  | "discovery_call"
  | "project_discussion"
  | "site_walkthrough_ncr"
  | "site_walkthrough_outside_ncr";

export type BookingActionPayload = {
  // "decline_discovery" is retained for backward compatibility with links that
  // were signed before the paid-booking path was added; new tokens should use
  // "decline_booking" and set `kind`.
  action: "decline_discovery" | "decline_booking";
  uid: string;         // ICS UID, so CANCEL invite matches the original
  email: string;
  first_name: string;
  slot_iso: string;
  kind?: BookingKindForToken;
  ts: number;          // ms since epoch
};

export function signAction(payload: Omit<BookingActionPayload, "ts">): string {
  const body: BookingActionPayload = { ...payload, ts: Date.now() };
  const encoded = b64urlEncode(JSON.stringify(body));
  const sig = createHmac("sha256", getSecret()).update(encoded).digest();
  return `${encoded}.${b64urlEncode(sig)}`;
}

export function verifyAction(
  token: string,
  maxAgeMs: number = DEFAULT_MAX_AGE_MS,
): BookingActionPayload | null {
  if (!token || typeof token !== "string") return null;
  const dot = token.indexOf(".");
  if (dot <= 0 || dot === token.length - 1) return null;

  const encodedPayload = token.slice(0, dot);
  const providedSigB64 = token.slice(dot + 1);

  let expectedSig: Buffer;
  let providedSig: Buffer;
  try {
    expectedSig = createHmac("sha256", getSecret())
      .update(encodedPayload)
      .digest();
    providedSig = b64urlDecode(providedSigB64);
  } catch {
    return null;
  }

  if (providedSig.length !== expectedSig.length) return null;
  if (!timingSafeEqual(providedSig, expectedSig)) return null;

  let payload: BookingActionPayload;
  try {
    payload = JSON.parse(b64urlDecode(encodedPayload).toString("utf-8"));
  } catch {
    return null;
  }

  if (typeof payload.ts !== "number") return null;
  if (Date.now() - payload.ts > maxAgeMs) return null;

  return payload;
}
