// Studio-branded ack email templates for /api/contact form submissions.
//
// Voice, punctuation and shape follow the Atelier Shreenu Concierge Voice
// Guidelines (September 2026 edition):
//   • No em dashes or en dashes anywhere.
//   • "Greetings <First>," salutation, never "Dear".
//   • Fixed close: "With best wishes, / Team Atelier Shreenu / Atelier Shreenu
//     by The Vrindavan Project / ateliershreenu.com".
//   • Compact shape: three to four short paragraphs, never over 180 words.
//   • Instagram invitation appears in every template.
//
// Design tokens mirror as-email-agent/templates/html/*.ACK.html: Cormorant
// Garamond for the wordmark, Jost for the body, #FAF7F2 warm canvas, #2C2C2C
// ink. Buttons: solid #2C2C2C for the primary CTA, hairline outline for the
// secondary.

type FormType = "project" | "vendor" | "careers";

const BOOKING_URL = "https://ateliershreenu.com/book";
const BLOG_URL = "https://ateliershreenu.com/blog/";
const IG_URL = "https://www.instagram.com/ateliershreenu/";
const IG_HANDLE = "@ateliershreenu";
const CONTACT_EMAIL = "info@ateliershreenu.com";
const SITE_LABEL = "ateliershreenu.com";

// Deep-link the primary CTA in the project ack based on the consultation
// picked in the form. Kept in place even though /api/contact currently skips
// project acks (project enquirers are redirected directly to /book), so the
// template is ready if that flow is ever reactivated.
type BookingContext = { href: string; buttonLabel: string; sentence: string };

function bookingContextFor(consultationType?: string): BookingContext {
  const c = (consultationType ?? "").toLowerCase();
  if (
    c.includes("google meet") ||
    c.includes("google-meet") ||
    c.includes("project discussion") ||
    c.includes("project-discussion")
  ) {
    return {
      href: `${BOOKING_URL}?kind=project_discussion&lock=1`,
      buttonLabel: "Book the Project Discussion",
      sentence:
        "The next step is a thirty-minute Project Discussion on Google Meet with the founding partner, Architect Ranjeet Mukherjee.",
    };
  }
  if (c.includes("outside ncr") || c.includes("outside-ncr") || c.includes("overnight")) {
    return {
      href: `${BOOKING_URL}?kind=site_walkthrough&variant=outside_ncr&lock=1`,
      buttonLabel: "Book the Site Walkthrough",
      sentence:
        "The next step is a Site and Vision Walkthrough beyond NCR with the founding partner, Architect Ranjeet Mukherjee.",
    };
  }
  if (c.includes("within ncr") || c.includes("within-ncr") || c.includes("regional") || c.includes("ncr")) {
    return {
      href: `${BOOKING_URL}?kind=site_walkthrough&variant=ncr&lock=1`,
      buttonLabel: "Book the Site Walkthrough",
      sentence:
        "The next step is a Site and Vision Walkthrough across Delhi NCR with the founding partner, Architect Ranjeet Mukherjee.",
    };
  }
  return {
    href: `${BOOKING_URL}?kind=discovery_call&lock=1`,
    buttonLabel: "Book the Discovery Call",
    sentence:
      "The next step is a complimentary ten-minute Discovery Call with the founding partner, Architect Ranjeet Mukherjee.",
  };
}

const SUBJECTS: Record<FormType, string> = {
  project: "Enquiry received",
  vendor: "Note received",
  careers: "Application received",
};

const SIGN_OFF_LINES = [
  "With best wishes,",
  "Team Atelier Shreenu",
  "Atelier Shreenu by The Vrindavan Project",
  SITE_LABEL,
];

function footerText(): string {
  const year = new Date().getFullYear();
  return (
    `Atelier Shreenu | Palam Vihar, Gurugram 122017, Haryana, India\n` +
    `${CONTACT_EMAIL} | ${SITE_LABEL} | © ${year}`
  );
}

function bodyText(
  formType: FormType,
  firstName: string,
  consultationType?: string,
): string {
  const footer = footerText();
  const signOff = SIGN_OFF_LINES.join("\n");

  if (formType === "project") {
    const bk = bookingContextFor(consultationType);
    return (
      `Greetings ${firstName},\n\n` +
      `Thank you for the message. The studio has received it, and will respond within the day.\n\n` +
      `Should you wish to move things forward immediately, ${bk.sentence
        .charAt(0)
        .toLowerCase() + bk.sentence.slice(1)}\n\n` +
      `${bk.buttonLabel}: ${bk.href}\n\n` +
      `Alongside, the studio's blog carries longer writing on materials, process, and built work: ${BLOG_URL}\n\n` +
      `The studio's Instagram, ${IG_HANDLE}, carries selected projects and process notes: ${IG_URL}\n\n` +
      `${signOff}\n\n` +
      footer
    );
  }

  if (formType === "vendor") {
    return (
      `Greetings ${firstName},\n\n` +
      `Thank you for the note. The studio has received it, and will be in touch directly should there be a fit with current or upcoming work.\n\n` +
      `The studio's Instagram, ${IG_HANDLE}, carries selected projects and process notes: ${IG_URL}\n\n` +
      `${signOff}\n\n` +
      footer
    );
  }

  // careers
  return (
    `Greetings ${firstName},\n\n` +
    `Thank you for writing. The application has been received and will be reviewed by the studio. Should there be a fit for a current or upcoming role, we will be in touch within three working days. The studio does not promise a reply to every application.\n\n` +
    `While you wait, the studio's Instagram, ${IG_HANDLE}, carries selected projects and process notes: ${IG_URL}\n\n` +
    `${signOff}\n\n` +
    footer
  );
}

// Studio email shell. #FAF7F2 canvas, hairline separators, small-caps wordmark.
function shell(title: string, body: string): string {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Jost:wght@300;400&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; padding: 0; background-color: #FAF7F2; }
    a { color: #2C2C2C; }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#FAF7F2;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FAF7F2;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#FAF7F2;font-family:'Jost',Arial,sans-serif;color:#2C2C2C;font-size:15px;line-height:1.7;">

          <tr>
            <td align="center" style="padding:24px 32px 8px 32px;">
              <span style="font-family:'Cormorant Garamond',Georgia,serif;font-size:13px;color:#888;letter-spacing:0.12em;text-transform:uppercase;">Atelier Shreenu</span>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px;">
              <hr style="border:none;border-top:1px solid #E0DDD8;margin:0;">
            </td>
          </tr>

          <tr>
            <td style="padding:32px;">
${body}
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px;">
              <hr style="border:none;border-top:1px solid #E0DDD8;margin:0;">
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:20px 32px 32px 32px;">
              <span style="font-family:'Jost',Arial,sans-serif;font-size:12px;color:#888;line-height:1.6;">
                Atelier Shreenu | Palam Vihar, Gurugram 122017, Haryana, India | <a href="mailto:${CONTACT_EMAIL}" style="color:#888;text-decoration:none;">${CONTACT_EMAIL}</a> | <a href="https://ateliershreenu.com" style="color:#888;text-decoration:none;">${SITE_LABEL}</a> | &copy; ${year}
              </span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function signOffHtml(): string {
  return SIGN_OFF_LINES.map(
    (line, i) =>
      `              <p style="margin:${i === 0 ? "24px" : "0"} 0 ${i === SIGN_OFF_LINES.length - 1 ? "0" : "4px"} 0;">${line}</p>`,
  ).join("\n");
}

function primaryButton(href: string, label: string): string {
  return `              <table cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 12px 0;">
                <tr>
                  <td>
                    <a href="${href}" style="display:inline-block;padding:12px 28px;background:#2C2C2C;color:#fff;text-decoration:none;font-family:'Jost',Arial,sans-serif;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;">${label}</a>
                  </td>
                </tr>
              </table>`;
}

function secondaryButton(href: string, label: string): string {
  return `              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 12px 0;">
                <tr>
                  <td>
                    <a href="${href}" style="display:inline-block;padding:12px 28px;background:transparent;color:#2C2C2C;text-decoration:none;font-family:'Jost',Arial,sans-serif;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;border:1px solid #2C2C2C;">${label}</a>
                  </td>
                </tr>
              </table>`;
}

function bodyHtml(
  formType: FormType,
  firstName: string,
  consultationType?: string,
): string {
  if (formType === "project") {
    const bk = bookingContextFor(consultationType);
    return `              <p style="margin:0 0 20px 0;">Greetings ${firstName},</p>

              <p style="margin:0 0 20px 0;">Thank you for the message. The studio has received it, and will respond within the day.</p>

              <p style="margin:0 0 20px 0;">Should you wish to move things forward immediately, ${bk.sentence.charAt(0).toLowerCase() + bk.sentence.slice(1)}</p>

${primaryButton(bk.href, bk.buttonLabel)}

              <p style="margin:24px 0 0 0;">Alongside, the studio's blog carries longer writing on materials, process, and built work.</p>

${secondaryButton(BLOG_URL, "Read the blog")}
${secondaryButton(IG_URL, `Follow on Instagram · ${IG_HANDLE}`)}

${signOffHtml()}`;
  }

  if (formType === "vendor") {
    return `              <p style="margin:0 0 20px 0;">Greetings ${firstName},</p>

              <p style="margin:0 0 20px 0;">Thank you for the note. The studio has received it, and will be in touch directly should there be a fit with current or upcoming work.</p>

              <p style="margin:0 0 12px 0;">The studio's Instagram carries selected projects and process notes.</p>

${primaryButton(IG_URL, `Follow on Instagram · ${IG_HANDLE}`)}

${signOffHtml()}`;
  }

  // careers
  return `              <p style="margin:0 0 20px 0;">Greetings ${firstName},</p>

              <p style="margin:0 0 20px 0;">Thank you for writing. The application has been received and will be reviewed by the studio. Should there be a fit for a current or upcoming role, we will be in touch within three working days. The studio does not promise a reply to every application.</p>

              <p style="margin:0 0 12px 0;">While you wait, the studio's Instagram carries selected projects and process notes.</p>

${primaryButton(IG_URL, `Follow on Instagram · ${IG_HANDLE}`)}

${signOffHtml()}`;
}

export function renderAckEmail(
  formType: string,
  firstName: string,
  consultationType?: string,
): { subject: string; html: string; text: string } {
  const ft: FormType = (["project", "vendor", "careers"] as const).includes(
    formType as FormType,
  )
    ? (formType as FormType)
    : "vendor";
  const subject = SUBJECTS[ft];
  return {
    subject,
    html: shell(subject, bodyHtml(ft, firstName, consultationType)),
    text: bodyText(ft, firstName, consultationType),
  };
}
