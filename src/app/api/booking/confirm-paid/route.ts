// Post-payment confirmation email + studio notify for paid booking tiers
// (Project Discussion, Site Walkthrough within/beyond NCR).
//
// This route is called from /book/thanks on load after Razorpay redirects the
// client back. It exists as a safety net alongside the as-email-funnel Lambda,
// which is supposed to send the same confirmation on payment.captured. If both
// paths fire, the client receives a duplicate; if only this one fires (Lambda
// webhook not delivered), the client still receives the confirmation. Losing
// the email entirely is the worse failure mode, so we accept the occasional
// dupe.

import { NextRequest, NextResponse } from "next/server";
import { SESClient, SendEmailCommand, SendRawEmailCommand } from "@aws-sdk/client-ses";
import { randomUUID } from "crypto";
import { buildIcs } from "@/lib/ics";
import { signAction } from "@/lib/booking-token";
import {
  bookingTermsFor,
  renderBookingTermsHtml,
  renderBookingTermsText,
  type BookingKind,
  type BookingVariant,
} from "@/content/booking-terms";
import {
  renderPaidBookingConfirmation,
  type PaidBookingKind,
  type PaidBookingVariant,
} from "@/lib/email-templates";
import {
  awsRegion,
  awsAccessKeyId,
  awsSecretAccessKey,
  siteUrl,
} from "@/lib/aws-runtime-config";

const ALLOWED_ORIGINS = [
  "https://ateliershreenu.com",
  "https://www.ateliershreenu.com",
  "http://localhost:3000",
];

const STUDIO_INBOX = "info@ateliershreenu.com";

const DURATION_BY_KIND: Record<PaidBookingKind, Record<PaidBookingVariant, number>> = {
  project_discussion: { any: 30, ncr: 30, outside_ncr: 30 },
  site_walkthrough: { any: 60, ncr: 60, outside_ncr: 120 },
};

const VALID_KINDS = new Set(["project_discussion", "site_walkthrough"]);
const VALID_VARIANTS = new Set(["any", "ncr", "outside_ncr"]);

const credentials = awsAccessKeyId
  ? { accessKeyId: awsAccessKeyId, secretAccessKey: awsSecretAccessKey }
  : undefined;

const sesClient = new SESClient({
  region: awsRegion,
  ...(credentials ? { credentials } : {}),
});

function base64Wrapped(buf: Buffer): string {
  return buf.toString("base64").replace(/.{76}/g, "$&\r\n");
}

function buildStudioRaw(opts: {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  ics: string;
  icsFilename: string;
}): string {
  const boundary = `--=_AS_${randomUUID()}`;
  const headers = [
    `From: ${opts.from}`,
    `To: ${opts.to}`,
    ...(opts.replyTo ? [`Reply-To: ${opts.replyTo}`] : []),
    `Subject: ${opts.subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
  ].join("\r\n");

  const textPart = [
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 7bit",
    "",
    opts.text,
  ].join("\r\n");

  const icsPart = [
    `--${boundary}`,
    `Content-Type: text/calendar; method=REQUEST; charset="UTF-8"; name="${opts.icsFilename}"`,
    `Content-Disposition: attachment; filename="${opts.icsFilename}"`,
    "Content-Transfer-Encoding: base64",
    "",
    base64Wrapped(Buffer.from(opts.ics, "utf-8")),
  ].join("\r\n");

  return [headers, "", textPart, icsPart, `--${boundary}--`, ""].join("\r\n");
}

function formatIstSlot(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
}

function kindSummary(kind: PaidBookingKind, variant: PaidBookingVariant): string {
  if (kind === "project_discussion") return "Project Discussion";
  if (variant === "outside_ncr") return "Site Walkthrough beyond NCR";
  return "Site Walkthrough within NCR";
}

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
  };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const email = (data.email ?? "").trim();
  const firstName = (data.first_name ?? "").trim() || "Guest";
  const slotIso = (data.slot_iso ?? "").trim();
  const kind = (data.booking_kind ?? "").trim();
  const variant = (data.variant ?? "any").trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }
  if (!slotIso || Number.isNaN(Date.parse(slotIso))) {
    return NextResponse.json({ error: "invalid slot_iso" }, { status: 400 });
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

  const kindTyped = kind as PaidBookingKind;
  const variantTyped = variant as PaidBookingVariant;
  const durationMin = DURATION_BY_KIND[kindTyped][variantTyped];

  const slotLabel = formatIstSlot(slotIso);
  const termsBlocks = bookingTermsFor(kind as BookingKind, variant as BookingVariant);
  const termsHtml = renderBookingTermsHtml(termsBlocks);
  const termsText = renderBookingTermsText(termsBlocks);

  // 1) Client confirmation. Voice + shell match renderAckEmail so paid and
  //    complimentary journeys read as one flow.
  const clientEmail = renderPaidBookingConfirmation({
    firstName,
    kind: kindTyped,
    variant: variantTyped,
    slotLabel,
    termsHtml,
    termsText,
  });

  try {
    await sesClient.send(
      new SendEmailCommand({
        Source: STUDIO_INBOX,
        Destination: { ToAddresses: [email] },
        ReplyToAddresses: [STUDIO_INBOX],
        Message: {
          Subject: { Data: clientEmail.subject, Charset: "UTF-8" },
          Body: {
            Html: { Data: clientEmail.html, Charset: "UTF-8" },
            Text: { Data: clientEmail.text, Charset: "UTF-8" },
          },
        },
      }),
    );
  } catch (err) {
    console.error("booking/confirm-paid client email failed:", err);
    // Keep going — the studio still needs the notify even if the client
    // address rejected the mail.
  }

  // 2) Studio notification with .ics + one-click Decline link, mirroring the
  //    Discovery Call notify flow.
  const uid = `${kind}-${randomUUID()}@ateliershreenu.com`;
  const summary = kindSummary(kindTyped, variantTyped);
  const tokenKind =
    kindTyped === "project_discussion"
      ? "project_discussion"
      : variantTyped === "outside_ncr"
        ? "site_walkthrough_outside_ncr"
        : "site_walkthrough_ncr";

  const declineToken = signAction({
    action: "decline_booking",
    uid,
    email,
    first_name: firstName,
    slot_iso: slotIso,
    kind: tokenKind,
  });
  const declineUrl = `${siteUrl.replace(/\/+$/, "")}/api/booking/decline?token=${declineToken}`;

  const notifyText = [
    `A paid booking has been confirmed through ateliershreenu.com/book.`,
    ``,
    `Type:   ${summary}`,
    `Client: ${firstName}`,
    `Email:  ${email}`,
    `Slot:   ${slotLabel} IST (${durationMin} minutes)`,
    ``,
    `The .ics attachment adds the appointment to your calendar. Payment was`,
    `handled by Razorpay; the receipt is dispatched separately by Razorpay.`,
    ``,
    `──`,
    `If this looks like spam or you cannot take the appointment, decline in one click:`,
    declineUrl,
    `(Sends a cancellation to the client and removes the entry from both calendars.)`,
  ].join("\n");

  const ics = buildIcs({
    uid,
    startIso: slotIso,
    durationMinutes: durationMin,
    summary: `${summary} · ${firstName}`,
    description: `${summary}.\nClient: ${firstName}\nEmail: ${email}`,
    location: kind === "project_discussion" ? "Google Meet (link to follow)" : "On site (address to follow)",
    organizerEmail: STUDIO_INBOX,
    organizerName: "Atelier Shreenu",
  });

  try {
    await sesClient.send(
      new SendRawEmailCommand({
        Source: STUDIO_INBOX,
        Destinations: [STUDIO_INBOX],
        RawMessage: {
          Data: Buffer.from(
            buildStudioRaw({
              from: STUDIO_INBOX,
              to: STUDIO_INBOX,
              replyTo: email,
              subject: `${summary} booked: ${firstName} · ${slotLabel} IST`,
              text: notifyText,
              ics,
              icsFilename: `${kind}.ics`,
            }),
            "utf-8",
          ),
        },
      }),
    );
  } catch (err) {
    console.error("booking/confirm-paid studio notify failed:", err);
  }

  return NextResponse.json({ ok: true });
}
