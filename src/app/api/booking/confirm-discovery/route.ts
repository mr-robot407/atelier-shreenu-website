import { NextRequest, NextResponse } from "next/server";
import { SESClient, SendRawEmailCommand } from "@aws-sdk/client-ses";
import { randomUUID } from "crypto";
import { invokeFunnel } from "@/lib/funnel-lambda";
import { buildIcs } from "@/lib/ics";
import {
  awsRegion,
  awsAccessKeyId,
  awsSecretAccessKey,
} from "@/lib/aws-runtime-config";

const ALLOWED_ORIGINS = [
  "https://ateliershreenu.com",
  "https://www.ateliershreenu.com",
  "http://localhost:3000",
];

const STUDIO_INBOX = "info@ateliershreenu.com";
const DISCOVERY_DURATION_MIN = 10;

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

// Multipart/mixed: plain-text body + .ics calendar file attachment. The .ics
// carries METHOD:REQUEST so Gmail / Outlook / Apple Mail surface the "Add to
// calendar" affordance on open.
function buildNotificationRaw(opts: {
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

async function sendStudioNotification(opts: {
  clientName: string;
  clientEmail: string;
  slotIso: string;
}): Promise<void> {
  const slotLabel = formatIstSlot(opts.slotIso);
  const subject = `Discovery Call booked: ${opts.clientName} · ${slotLabel} IST`;
  const text = [
    `A Discovery Call has been booked through ateliershreenu.com/book.`,
    ``,
    `Client: ${opts.clientName}`,
    `Email:  ${opts.clientEmail}`,
    `Slot:   ${slotLabel} IST (${DISCOVERY_DURATION_MIN} minutes)`,
    ``,
    `The .ics attachment adds the call to your calendar.`,
  ].join("\n");

  const ics = buildIcs({
    uid: `discovery-${randomUUID()}@ateliershreenu.com`,
    startIso: opts.slotIso,
    durationMinutes: DISCOVERY_DURATION_MIN,
    summary: `Discovery Call · ${opts.clientName}`,
    description: `Complimentary ten-minute Discovery Call.\nClient: ${opts.clientName}\nEmail: ${opts.clientEmail}`,
    location: "Phone call",
    organizerEmail: STUDIO_INBOX,
    organizerName: "Atelier Shreenu",
  });

  const raw = buildNotificationRaw({
    from: STUDIO_INBOX,
    to: STUDIO_INBOX,
    replyTo: opts.clientEmail,
    subject,
    text,
    ics,
    icsFilename: "discovery-call.ics",
  });

  await sesClient.send(
    new SendRawEmailCommand({
      Source: STUDIO_INBOX,
      Destinations: [STUDIO_INBOX],
      RawMessage: { Data: Buffer.from(raw, "utf-8") },
    }),
  );
}

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
    if (statusCode !== 200) {
      const text = typeof body === "string" ? body : JSON.stringify(body);
      return NextResponse.json({ error: text }, { status: statusCode });
    }
  } catch (err) {
    console.error("booking/confirm-discovery funnel failed:", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }

  // Studio notification + calendar. Non-blocking: a failure here should not
  // undo a successful booking on the client side.
  try {
    await sendStudioNotification({
      clientName: firstName || "Guest",
      clientEmail: email,
      slotIso,
    });
  } catch (err) {
    console.error("booking/confirm-discovery studio notify failed:", err);
  }

  return NextResponse.json({ ok: true });
}
