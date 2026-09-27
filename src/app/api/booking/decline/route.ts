import { NextRequest } from "next/server";
import { SESClient, SendRawEmailCommand, SendEmailCommand } from "@aws-sdk/client-ses";
import { randomUUID } from "crypto";
import { buildIcs } from "@/lib/ics";
import { verifyAction, type BookingKindForToken } from "@/lib/booking-token";
import {
  awsRegion,
  awsAccessKeyId,
  awsSecretAccessKey,
} from "@/lib/aws-runtime-config";

const STUDIO_INBOX = "info@ateliershreenu.com";

// Match durations to what was on the calendar so the CANCEL invite lines up
// with the original REQUEST.
const DURATION_BY_KIND: Record<BookingKindForToken, number> = {
  discovery_call: 10,
  project_discussion: 30,
  site_walkthrough_ncr: 60,
  site_walkthrough_outside_ncr: 120,
};

const LABEL_BY_KIND: Record<BookingKindForToken, string> = {
  discovery_call: "Discovery Call",
  project_discussion: "Project Discussion",
  site_walkthrough_ncr: "Site and Vision Walkthrough within NCR",
  site_walkthrough_outside_ncr: "Site and Vision Walkthrough beyond NCR",
};

const PAID_KINDS = new Set<BookingKindForToken>([
  "project_discussion",
  "site_walkthrough_ncr",
  "site_walkthrough_outside_ncr",
]);

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

function buildCancelRaw(opts: {
  from: string;
  to: string;
  subject: string;
  text: string;
  ics: string;
}): string {
  const boundary = `--=_AS_${randomUUID()}`;
  const headers = [
    `From: ${opts.from}`,
    `To: ${opts.to}`,
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

  // METHOD=CANCEL is what makes Gmail / Outlook / Apple Mail drop the event
  // from the recipient's calendar. UID must match the original REQUEST.
  const icsPart = [
    `--${boundary}`,
    'Content-Type: text/calendar; method=CANCEL; charset="UTF-8"; name="cancel.ics"',
    'Content-Disposition: attachment; filename="cancel.ics"',
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

function htmlPage(opts: { title: string; heading: string; body: string; ok: boolean }): string {
  const accent = opts.ok ? "#7D2027" : "#8C8579";
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>${opts.title}</title>
    <style>
      body { margin:0; background:#FAF7F2; color:#1C1C1C; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      main { max-width: 560px; margin: 0 auto; padding: 96px 24px; text-align: center; }
      .eyebrow { font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: ${accent}; margin: 0 0 24px; }
      h1 { font-family: Georgia, "Times New Roman", serif; font-size: 40px; line-height: 1.15; letter-spacing: -0.01em; margin: 0 0 24px; }
      p { font-size: 15px; line-height: 1.65; color: #6B6459; margin: 0 0 12px; }
      a { color: #7D2027; }
    </style>
  </head>
  <body>
    <main>
      <p class="eyebrow">${opts.ok ? "Cancelled" : "Notice"}</p>
      <h1>${opts.heading}</h1>
      <p>${opts.body}</p>
    </main>
  </body>
</html>`;
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const payload = verifyAction(token);

  if (!payload || !["decline_discovery", "decline_booking"].includes(payload.action)) {
    return new Response(
      htmlPage({
        title: "Link expired · Atelier Shreenu",
        heading: "This decline link is no longer valid.",
        body: "The link may have expired or the booking has already been actioned. If you need to cancel a booking, please forward the original notification to the studio.",
        ok: false,
      }),
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const { uid, email, first_name, slot_iso } = payload;
  // Legacy tokens signed before the paid-booking work default to Discovery Call.
  const kind: BookingKindForToken = payload.kind ?? "discovery_call";
  const kindLabel = LABEL_BY_KIND[kind];
  const durationMin = DURATION_BY_KIND[kind];
  const isPaid = PAID_KINDS.has(kind);
  const slotLabel = formatIstSlot(slot_iso);
  const clientName = first_name || "Guest";

  // CANCEL invite. Same UID as the original REQUEST so both calendars drop it.
  const cancelIcs = buildIcs({
    uid,
    startIso: slot_iso,
    durationMinutes: durationMin,
    summary: `${kindLabel} · ${clientName}`,
    description: `This ${kindLabel} has been cancelled by the studio.`,
    location: kind === "discovery_call" ? "Phone call" : (kind === "project_discussion" ? "Google Meet" : "On site"),
    organizerEmail: STUDIO_INBOX,
    organizerName: "Atelier Shreenu",
    method: "CANCEL",
    sequence: 1,
  });

  // 1) Cancel invite to the studio inbox — drops the event from Ranjeet's calendar.
  try {
    await sesClient.send(
      new SendRawEmailCommand({
        Source: STUDIO_INBOX,
        Destinations: [STUDIO_INBOX],
        RawMessage: {
          Data: Buffer.from(
            buildCancelRaw({
              from: STUDIO_INBOX,
              to: STUDIO_INBOX,
              subject: `Cancelled: ${kindLabel} · ${clientName} · ${slotLabel} IST`,
              text: [
                `The ${kindLabel} with ${clientName} on ${slotLabel} IST has been declined.`,
                ``,
                `Client: ${clientName}`,
                `Email:  ${email}`,
                `Slot:   ${slotLabel} IST`,
                ``,
                `A cancellation notice has been sent to the client. The calendar entry will be removed automatically.`,
                ...(isPaid
                  ? [
                      ``,
                      `PAID BOOKING NOTE: this cancellation does NOT issue a refund. If a`,
                      `refund is warranted under the studio's cancellation policy, please`,
                      `initiate it manually from the Razorpay dashboard.`,
                    ]
                  : []),
              ].join("\n"),
              ics: cancelIcs,
            }),
            "utf-8",
          ),
        },
      }),
    );
  } catch (err) {
    console.error("decline: studio cancel failed:", err);
  }

  // 2) Cancel invite + polite note to the client. Voice matches the studio's
  //    fixed acknowledgement register (no dashes, "Greetings", plain signoff).
  try {
    await sesClient.send(
      new SendRawEmailCommand({
        Source: STUDIO_INBOX,
        Destinations: [email],
        RawMessage: {
          Data: Buffer.from(
            buildCancelRaw({
              from: STUDIO_INBOX,
              to: email,
              subject: `${kindLabel} cancelled`,
              text: [
                `Greetings ${clientName},`,
                ``,
                `The ${kindLabel} scheduled for ${slotLabel} IST is no longer able to proceed on the studio's side, and has been cancelled. Apologies for any inconvenience.`,
                ...(isPaid
                  ? [
                      ``,
                      `Any refund due under the studio's cancellation policy will be processed to the original payment method separately. You do not need to take any action.`,
                    ]
                  : []),
                ``,
                `If you would like to write to the studio directly with more context about your project, please reply to this email and we will consider it personally.`,
                ``,
                `With best wishes,`,
                `Team Atelier Shreenu`,
                `Atelier Shreenu by The Vrindavan Project`,
                `ateliershreenu.com`,
              ].join("\n"),
              ics: cancelIcs,
            }),
            "utf-8",
          ),
        },
      }),
    );
  } catch (err) {
    console.error("decline: client cancel failed:", err);
    // Best-effort delivery. Even if the client email fails, the studio calendar
    // has been cleared, which is the primary goal.
  }

  // 3) Fallback plain-text confirmation to the studio in case the raw email
  //    was tripped up by the client's own SPF/DMARC on the recipient side.
  try {
    await sesClient.send(
      new SendEmailCommand({
        Source: STUDIO_INBOX,
        Destination: { ToAddresses: [STUDIO_INBOX] },
        Message: {
          Subject: { Data: `Declined: ${kindLabel} · ${clientName} · ${slotLabel}` },
          Body: {
            Text: {
              Data: [
                `Decline actioned via one-click link.`,
                ``,
                `Client:   ${clientName}`,
                `Email:    ${email}`,
                `Slot:     ${slotLabel} IST`,
                `UID:      ${uid}`,
                ``,
                `A CANCEL invite has been issued to both calendars and a polite cancellation email has been sent to the client.`,
              ].join("\n"),
            },
          },
        },
      }),
    );
  } catch (err) {
    console.error("decline: fallback studio email failed:", err);
  }

  return new Response(
    htmlPage({
      title: "Booking declined · Atelier Shreenu",
      heading: "The booking has been declined.",
      body: `A cancellation invite has been sent to both calendars and a polite note has been emailed to ${clientName} at ${email}. You can close this tab.`,
      ok: true,
    }),
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
