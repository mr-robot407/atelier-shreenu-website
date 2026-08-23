import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { randomUUID } from "crypto";
import {
  awsRegion,
  awsAccessKeyId,
  awsSecretAccessKey,
  contactTableName,
} from "@/lib/aws-runtime-config";

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

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const allowed = await checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  let data: Record<string, string>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { formType, ...fields } = data;

  if (!formType || !["project", "vendor", "careers"].includes(formType)) {
    return NextResponse.json({ error: "Invalid form type" }, { status: 400 });
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

  try {
    await sesClient.send(
      new SendEmailCommand({
        Source: NOTIFY_EMAIL,
        Destination: { ToAddresses: [NOTIFY_EMAIL] },
        Message: {
          Subject: {
            Data: `${FORM_LABELS[formType] ?? "Contact Form"} — Atelier Shreenu`,
          },
          Body: {
            Text: { Data: formatEmailBody(formType, fields) },
          },
        },
      })
    );
  } catch (err) {
    console.error("SES email failed:", err);
  }

  return NextResponse.json({ success: true });
}
