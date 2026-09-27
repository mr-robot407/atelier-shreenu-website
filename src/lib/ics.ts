// Minimal iCalendar (RFC 5545) generator, sufficient for attaching a single
// event to a studio notification email so Ranjeet can one-click add the
// booking to his calendar from Gmail / Outlook / Apple Mail.

export type IcsEvent = {
  uid: string;
  startIso: string;
  durationMinutes: number;
  summary: string;
  description?: string;
  location?: string;
  organizerEmail: string;
  organizerName?: string;
  // Defaults to REQUEST (new invite). Use CANCEL to withdraw a previously
  // sent invite — mail clients then remove the event from the calendar.
  method?: "REQUEST" | "CANCEL";
  // Bumped when the event is updated/cancelled. RFC 5545 §3.8.7.4: a CANCEL
  // must have a sequence >= the original REQUEST.
  sequence?: number;
};

function toIcsDate(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function escapeText(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

// RFC 5545 §3.1: fold content lines longer than 75 octets with CRLF + space.
function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [];
  for (let i = 0; i < line.length; i += 75) {
    parts.push(line.slice(i, i + 75));
  }
  return parts.join("\r\n ");
}

export function buildIcs(event: IcsEvent): string {
  const method = event.method ?? "REQUEST";
  const sequence = event.sequence ?? (method === "CANCEL" ? 1 : 0);
  const status = method === "CANCEL" ? "CANCELLED" : "CONFIRMED";

  const dtStart = toIcsDate(event.startIso);
  const end = new Date(
    new Date(event.startIso).getTime() + event.durationMinutes * 60_000,
  );
  const dtEnd = toIcsDate(end.toISOString());
  const dtStamp = toIcsDate(new Date().toISOString());
  const organizerCn = escapeText(event.organizerName ?? event.organizerEmail);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Atelier Shreenu//Booking//EN",
    "CALSCALE:GREGORIAN",
    `METHOD:${method}`,
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeText(event.summary)}`,
    ...(event.description ? [`DESCRIPTION:${escapeText(event.description)}`] : []),
    ...(event.location ? [`LOCATION:${escapeText(event.location)}`] : []),
    `ORGANIZER;CN=${organizerCn}:mailto:${event.organizerEmail}`,
    `SEQUENCE:${sequence}`,
    `STATUS:${status}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].map(foldLine);

  return lines.join("\r\n");
}
