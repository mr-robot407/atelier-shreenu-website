// Studio-branded ack email templates for /api/contact form submissions.
// Structure mirrors as-email-agent/templates/html/*.ACK.html so the design
// matches the studio's other transactional mail (Cormorant Garamond / Jost,
// #FAF7F2 warm neutral, #2C2C2C ink).

type FormType = "project" | "vendor" | "careers";

const CALENDAR_BOOKING_LINK = "https://ateliershreenu.com/book";
const SITE_URL = "https://ateliershreenu.com";
const IG_URL = "https://www.instagram.com/ateliershreenu/";

// Deep-link the ack CTA based on the consultation type picked in the form.
// Options mirror /book path keys (discovery_call / project_discussion /
// site_walkthrough + variant). Unknown / missing values fall back to the
// generic /book landing so the CTA never breaks.
type BookingContext = { href: string; buttonLabel: string; ctaSentence: string };

function bookingContextFor(consultationType?: string): BookingContext {
  const c = (consultationType ?? "").toLowerCase();
  if (c.includes("discovery")) {
    return {
      href: `${CALENDAR_BOOKING_LINK}?kind=discovery_call&lock=1`,
      buttonLabel: "Book the discovery call",
      ctaSentence:
        "The studio offers a complimentary ten-minute discovery call with the founding partner — Architect Ranjeet Mukherjee. The booking link is below.",
    };
  }
  if (c.includes("google meet") || c.includes("project discussion")) {
    return {
      href: `${CALENDAR_BOOKING_LINK}?kind=project_discussion&lock=1`,
      buttonLabel: "Book the project discussion",
      ctaSentence:
        "The studio offers a thirty-minute Project Discussion on Google Meet with the founding partner — Architect Ranjeet Mukherjee. The booking link is below.",
    };
  }
  if (c.includes("outside ncr") || c.includes("overnight")) {
    return {
      href: `${CALENDAR_BOOKING_LINK}?kind=site_walkthrough&variant=outside_ncr&lock=1`,
      buttonLabel: "Book the site walkthrough",
      ctaSentence:
        "The studio offers an on-site walkthrough beyond NCR with the founding partner — Architect Ranjeet Mukherjee. The booking link is below.",
    };
  }
  if (c.includes("within ncr") || c.includes("regional")) {
    return {
      href: `${CALENDAR_BOOKING_LINK}?kind=site_walkthrough&variant=ncr&lock=1`,
      buttonLabel: "Book the site walkthrough",
      ctaSentence:
        "The studio offers an on-site walkthrough across Delhi NCR with the founding partner — Architect Ranjeet Mukherjee. The booking link is below.",
    };
  }
  return {
    href: CALENDAR_BOOKING_LINK,
    buttonLabel: "Book a discovery call",
    ctaSentence:
      "The studio offers a complimentary ten-minute discovery call with the founding partner — Architect Ranjeet Mukherjee. The booking link is below.",
  };
}

const SUBJECTS: Record<FormType, string> = {
  project: "Thank you for the enquiry — Atelier Shreenu",
  vendor: "Received — Atelier Shreenu",
  careers: "Application received — Atelier Shreenu",
};

function bodyText(formType: FormType, firstName: string, consultationType?: string): string {
  const year = new Date().getFullYear();
  const footer =
    `Atelier Shreenu | Palam Vihar, Gurugram — 122017, Haryana, India\n` +
    `info@ateliershreenu.com | ateliershreenu.com | © ${year}`;

  if (formType === "project") {
    const bk = bookingContextFor(consultationType);
    return (
      `Subject: ${SUBJECTS.project}\n\n` +
      `Dear ${firstName},\n\n` +
      `Thank you for the message. The studio is glad to hear from you and will respond within the day. Should you wish to take the conversation forward immediately, ${bk.ctaSentence.charAt(0).toLowerCase() + bk.ctaSentence.slice(1)}\n\n` +
      `${bk.buttonLabel}:\n${bk.href}\n\n` +
      `View selected work:\n${SITE_URL}\n\n` +
      `The studio's Instagram — @ateliershreenu — carries selected projects, materials, and process notes:\n${IG_URL}\n\n` +
      `The studio is at your service.\n\n` +
      `Atelier Shreenu | info@ateliershreenu.com | ateliershreenu.com\n\n` +
      footer
    );
  }
  if (formType === "vendor") {
    return (
      `Subject: ${SUBJECTS.vendor}\n\n` +
      `Greetings ${firstName},\n\n` +
      `Thank you for the note. The studio has received it and will be in touch directly should there be a fit with current or upcoming work.\n\n` +
      `Follow on Instagram: ${IG_URL}\n\n` +
      footer
    );
  }
  // careers
  return (
    `Subject: ${SUBJECTS.careers}\n\n` +
    `Dear ${firstName},\n\n` +
    `Thank you for the interest in Atelier Shreenu. The application has been received and will be reviewed by the studio. Should there be a fit for a current or upcoming position, the studio will be in touch within three working days. The studio does not promise individual replies to every application.\n\n` +
    `Thank you.\n\n` +
    `Atelier Shreenu | info@ateliershreenu.com | ateliershreenu.com\n\n` +
    footer
  );
}

// Studio email shell — Cormorant Garamond header + Jost body, #FAF7F2 canvas.
// The {body} placeholder receives per-form-type inner HTML.
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
                Atelier Shreenu | Palam Vihar, Gurugram &mdash; 122017, Haryana, India | <a href="mailto:info@ateliershreenu.com" style="color:#888;text-decoration:none;">info@ateliershreenu.com</a> | <a href="https://ateliershreenu.com" style="color:#888;text-decoration:none;">ateliershreenu.com</a> | &copy; ${year}
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

function bodyHtml(formType: FormType, firstName: string, consultationType?: string): string {
  if (formType === "project") {
    const bk = bookingContextFor(consultationType);
    return `              <p style="margin:0 0 20px 0;">Dear ${firstName},</p>

              <p style="margin:0 0 20px 0;">Thank you for the message. The studio is glad to hear from you and will respond within the day. Should you wish to take the conversation forward immediately, ${bk.ctaSentence.charAt(0).toLowerCase() + bk.ctaSentence.slice(1).replace(/—/g, "&mdash;")}</p>

              <table cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 12px 0;">
                <tr>
                  <td>
                    <a href="${bk.href}" style="display:inline-block;padding:12px 28px;background:#2C2C2C;color:#fff;text-decoration:none;font-family:'Jost',Arial,sans-serif;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;">${bk.buttonLabel} &rarr;</a>
                  </td>
                </tr>
              </table>

              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px 0;">
                <tr>
                  <td>
                    <a href="${SITE_URL}" style="display:inline-block;padding:12px 28px;background:transparent;color:#2C2C2C;text-decoration:none;font-family:'Jost',Arial,sans-serif;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;border:1px solid #2C2C2C;">View selected work &rarr;</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px 0;">The studio's Instagram &mdash; @ateliershreenu &mdash; carries selected projects, materials, and process notes: <a href="${IG_URL}" style="color:#2C2C2C;">${IG_URL}</a></p>

              <p style="margin:0 0 20px 0;">The studio is at your service.</p>

              <p style="margin:0;">Atelier Shreenu | <a href="mailto:info@ateliershreenu.com" style="color:#2C2C2C;">info@ateliershreenu.com</a> | <a href="${SITE_URL}" style="color:#2C2C2C;">ateliershreenu.com</a></p>`;
  }
  if (formType === "vendor") {
    return `              <p style="margin:0 0 20px 0;">Greetings ${firstName},</p>

              <p style="margin:0 0 20px 0;">Thank you for the note. The studio has received it and will be in touch directly should there be a fit with current or upcoming work.</p>

              <p style="margin:0 0 20px 0;">Follow on Instagram: <a href="${IG_URL}" style="color:#2C2C2C;">${IG_URL}</a></p>

              <p style="margin:0;">Atelier Shreenu | <a href="mailto:info@ateliershreenu.com" style="color:#2C2C2C;">info@ateliershreenu.com</a> | <a href="${SITE_URL}" style="color:#2C2C2C;">ateliershreenu.com</a></p>`;
  }
  // careers
  return `              <p style="margin:0 0 20px 0;">Dear ${firstName},</p>

              <p style="margin:0 0 20px 0;">Thank you for the interest in Atelier Shreenu. The application has been received and will be reviewed by the studio. Should there be a fit for a current or upcoming position, the studio will be in touch within three working days. The studio does not promise individual replies to every application.</p>

              <p style="margin:0 0 20px 0;">Thank you.</p>

              <p style="margin:0;">Atelier Shreenu | <a href="mailto:info@ateliershreenu.com" style="color:#2C2C2C;">info@ateliershreenu.com</a> | <a href="${SITE_URL}" style="color:#2C2C2C;">ateliershreenu.com</a></p>`;
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
    : "project";
  const subject = SUBJECTS[ft];
  return {
    subject,
    html: shell(subject, bodyHtml(ft, firstName, consultationType)),
    text: bodyText(ft, firstName, consultationType),
  };
}
