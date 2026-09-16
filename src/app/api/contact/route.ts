import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { SESClient, SendEmailCommand, SendRawEmailCommand } from "@aws-sdk/client-ses";
import { randomUUID } from "crypto";
import {
  awsRegion,
  awsAccessKeyId,
  awsSecretAccessKey,
  contactTableName,
} from "@/lib/aws-runtime-config";
import { renderAckEmail } from "@/lib/email-templates";

const credentials =
  awsAccessKeyId
    ? { accessKeyId: awsAccessKeyId, secretAccessKey: awsSecretAccessKey }
    : undefined;

const dynamoClient = new DynamoDBClient({
  region: awsRegion,
  ...(credentials ? { credentials } : {}),
});
const db = DynamoDBDocumentClient.from(dynamoClient);

const sesClient = new SESClient({
  region: awsRegion,
  ...(credentials ? { credentials } : {}),
});

const CONTACT_TABLE = contactTableName;
const RATE_LIMIT_TABLE = "atelier-shreenu-rate-limits";
const NOTIFY_EMAIL = "info@ateliershreenu.com";
const RATE_LIMIT_MAX = 5;        // max submissions
const RATE_LIMIT_WINDOW = 3600;  // per hour (seconds)

const FORM_LABELS: Record<string, string> = {
  project: "New Project Enquiry",
  vendor: "New Vendor Enquiry",
  careers: "New Career Application",
};

function firstNameFrom(fields: Record<string, string>): string {
  // v13 directive: use the plain first name when we have one; otherwise
  // fall back to "Sir / Madam" so the salutation reads
  // "Greetings Sir / Madam," rather than "Greetings there,".
  const raw = (fields.name ?? fields.contact_person ?? "").trim();
  if (!raw) return "Sir / Madam";
  const first = raw.split(/\s+/)[0];
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

const FIELD_LABELS: Record<string, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  location: "Project Location",
  project_type: "Project Type",
  service_type: "Service Type",
  consultation_type: "Consultation Type",
  message: "Message",
  company_name: "Company Name",
  contact_person: "Contact Person",
  category: "Category",
  services: "Products / Services Offered",
  website_url: "Website",
  showroom_location: "Showroom / Office Location",
  career_type: "Career Type",
  experience_level: "Experience Level",
  portfolio_url: "Portfolio Link",
  resume_filename: "Attached Resume",
  resume_size_kb: "Resume Size (KB)",
};

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  const ttl = now + RATE_LIMIT_WINDOW;

  try {
    const existing = await db.send(
      new GetCommand({ TableName: RATE_LIMIT_TABLE, Key: { ip } })
    );

    if (!existing.Item) {
      // First request from this IP — create record
      await db.send(
        new PutCommand({
          TableName: RATE_LIMIT_TABLE,
          Item: { ip, count: 1, ttl },
        })
      );
      return true;
    }

    if (existing.Item.count >= RATE_LIMIT_MAX) {
      return false;
    }

    // Increment count, refresh TTL
    await db.send(
      new UpdateCommand({
        TableName: RATE_LIMIT_TABLE,
        Key: { ip },
        UpdateExpression: "SET #c = #c + :inc, #t = :ttl",
        ExpressionAttributeNames: { "#c": "count", "#t": "ttl" },
        ExpressionAttributeValues: { ":inc": 1, ":ttl": ttl },
      })
    );
    return true;
  } catch (err) {
    console.error("Rate limit check failed:", err);
    return true; // fail open — don't block legit users if DynamoDB has issues
  }
}

function formatEmailBody(
  formType: string,
  fields: Record<string, string>
): string {
  const lines: string[] = [
    `Form: ${FORM_LABELS[formType] ?? formType}`,
    `Submitted: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`,
    "",
    "── Details ─────────────────────────────",
    "",
  ];

  for (const [key, value] of Object.entries(fields)) {
    if (!value || key === "form-name" || key === "bot-field") continue;
    const label = FIELD_LABELS[key] ?? key;
    lines.push(`${label}: ${value}`);
  }

  lines.push("");
  lines.push("────────────────────────────────────────");
  lines.push("Atelier Shreenu — Contact Form");

  return lines.join("\n");
}

const ALLOWED_ORIGINS = [
  "https://ateliershreenu.com",
  "https://www.ateliershreenu.com",
  "http://localhost:3000",
];

const MAX_FIELD_LENGTH = 2000;
const MAX_FIELDS = 20;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB — must match Contact.tsx
const ALLOWED_UPLOAD_MIME = new Set(["application/pdf"]);

type Attachment = { filename: string; mime: string; bytes: Buffer };

function base64Wrapped(buf: Buffer): string {
  // Wrap at 76 chars per RFC 2045.
  return buf.toString("base64").replace(/.{76}/g, "$&\r\n");
}

function buildRawEmail(opts: {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  attachment: Attachment;
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

  const safeName = opts.attachment.filename.replace(/["\r\n]/g, "_");
  const filePart = [
    `--${boundary}`,
    `Content-Type: ${opts.attachment.mime}; name="${safeName}"`,
    `Content-Disposition: attachment; filename="${safeName}"`,
    "Content-Transfer-Encoding: base64",
    "",
    base64Wrapped(opts.attachment.bytes),
  ].join("\r\n");

  return [headers, "", textPart, filePart, `--${boundary}--`, ""].join("\r\n");
}

function validateFields(fields: Record<string, string>): boolean {
  if (Object.keys(fields).length > MAX_FIELDS) return false;
  for (const value of Object.values(fields)) {
    if (typeof value !== "string") return false;
    if (value.length > MAX_FIELD_LENGTH) return false;
  }
  return true;
}

export async function POST(req: NextRequest) {
  // Origin check
  const origin = req.headers.get("origin") ?? "";
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = getClientIp(req);
  const allowed = await checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  let data: Record<string, string>;
  let attachment: Attachment | null = null;
  const contentType = req.headers.get("content-type") ?? "";

  try {
    if (contentType.startsWith("multipart/form-data")) {
      const form = await req.formData();
      const collected: Record<string, string> = {};
      for (const [key, value] of form.entries()) {
        if (typeof value === "string") {
          collected[key] = value;
          continue;
        }
        // File entry (careers resume). Enforce one file, size + MIME allowlist.
        if (value.size === 0) continue;
        if (attachment) {
          return NextResponse.json({ error: "Only one file allowed" }, { status: 400 });
        }
        if (value.size > MAX_UPLOAD_BYTES) {
          return NextResponse.json({ error: "File too large" }, { status: 413 });
        }
        if (!ALLOWED_UPLOAD_MIME.has(value.type)) {
          return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });
        }
        const bytes = Buffer.from(await value.arrayBuffer());
        attachment = { filename: value.name || "resume.pdf", mime: value.type, bytes };
      }
      data = collected;
    } else {
      data = await req.json();
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot — bots fill this, humans don't
  if (data.website) {
    return NextResponse.json({ success: true }); // silent reject
  }

  const { formType, ...fields } = data;
  if (attachment) {
    fields.resume_filename = attachment.filename;
    fields.resume_size_kb = String(Math.round(attachment.bytes.length / 1024));
  }

  if (!formType || !["project", "vendor", "careers"].includes(formType)) {
    return NextResponse.json({ error: "Invalid form type" }, { status: 400 });
  }

  // Input validation
  if (!validateFields(fields)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const submissionId = randomUUID();
  const submittedAt = new Date().toISOString();

  try {
    await db.send(
      new PutCommand({
        TableName: CONTACT_TABLE,
        Item: { submissionId, submittedAt, formType, ...fields },
      })
    );
  } catch (err) {
    console.error("DynamoDB write failed:", err);
    return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
  }

  const submitterEmail = fields.email?.trim();
  const validSubmitter =
    submitterEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submitterEmail)
      ? submitterEmail
      : undefined;

  // 1) Team notification — from info@ to info@; Reply-To → submitter so
  //    hitting Reply in the inbox addresses the enquirer. The inbound Lambda
  //    drops this because sender==info@ (self-loop guard).
  const notifySubject = `${FORM_LABELS[formType] ?? "Contact Form"} — Atelier Shreenu`;
  const notifyText = formatEmailBody(formType, fields);
  try {
    if (attachment) {
      const raw = buildRawEmail({
        from: NOTIFY_EMAIL,
        to: NOTIFY_EMAIL,
        replyTo: validSubmitter,
        subject: notifySubject,
        text: notifyText,
        attachment,
      });
      await sesClient.send(
        new SendRawEmailCommand({
          Source: NOTIFY_EMAIL,
          Destinations: [NOTIFY_EMAIL],
          RawMessage: { Data: Buffer.from(raw, "utf-8") },
        })
      );
    } else {
      await sesClient.send(
        new SendEmailCommand({
          Source: NOTIFY_EMAIL,
          Destination: { ToAddresses: [NOTIFY_EMAIL] },
          ...(validSubmitter ? { ReplyToAddresses: [validSubmitter] } : {}),
          Message: {
            Subject: { Data: notifySubject },
            Body: { Text: { Data: notifyText } },
          },
        })
      );
    }
  } catch (err) {
    console.error("SES notification email failed:", err);
  }

  // 2) Acknowledgment to submitter — from info@ so any reply lands at info@
  //    and gets processed autonomously by the inbound agent. HTML+text using
  //    the studio's shared brand template.
  if (validSubmitter) {
    const ack = renderAckEmail(formType, firstNameFrom(fields), fields.consultation_type);
    try {
      await sesClient.send(
        new SendEmailCommand({
          Source: NOTIFY_EMAIL,
          Destination: { ToAddresses: [validSubmitter] },
          Message: {
            Subject: { Data: ack.subject, Charset: "UTF-8" },
            Body: {
              Html: { Data: ack.html, Charset: "UTF-8" },
              Text: { Data: ack.text, Charset: "UTF-8" },
            },
          },
        })
      );
    } catch (err) {
      console.error("SES acknowledgment email failed:", err);
    }
  }

  return NextResponse.json({ success: true });
}
