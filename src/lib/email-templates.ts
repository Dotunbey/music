import { escapeHtml } from "@/lib/html-escape";

export type EmailContent = {
  subject: string;
  html: string;
  text: string;
};

const palette = {
  ink: "#0c0b09",
  charcoal: "#15110e",
  cream: "#f7efe3",
  muted: "#8a7f6d",
  red: "#d92d10",
  brass: "#c59b5d",
  white: "#ffffff",
};

const displayFont = "Georgia, 'Times New Roman', serif";
const bodyFont = "'Segoe UI', Helvetica, Arial, sans-serif";

function button(href: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;"><tr><td style="border-radius:6px;background:${palette.red};">
    <a href="${escapeHtml(href)}" style="display:inline-block;padding:13px 28px;font-family:${bodyFont};font-size:14px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;color:${palette.white};text-decoration:none;border-radius:6px;">${escapeHtml(label)}</a>
  </td></tr></table>`;
}

function fieldRow(label: string, value: string) {
  return `<tr>
    <td style="padding:10px 16px 10px 0;font-family:${bodyFont};font-size:11px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;color:${palette.muted};vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
    <td style="padding:10px 0;font-family:${bodyFont};font-size:14px;line-height:22px;color:${palette.ink};vertical-align:top;">${escapeHtml(value)}</td>
  </tr>`;
}

function emailShell(params: {
  preheader: string;
  contentHtml: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="color-scheme" content="light"/>
</head>
<body style="margin:0;padding:0;background:${palette.cream};">
<div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(params.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${palette.cream};padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;">
  <tr>
    <td style="background:${palette.ink};border-radius:8px 8px 0 0;padding:24px 32px;">
      <span style="display:inline-block;width:38px;height:38px;line-height:38px;text-align:center;border:1px solid rgba(247,239,227,0.3);border-radius:6px;font-family:${displayFont};font-size:20px;font-weight:bold;color:${palette.cream};">tb</span>
      <span style="padding-left:12px;font-family:${bodyFont};font-size:13px;font-weight:bold;letter-spacing:0.14em;text-transform:uppercase;color:${palette.cream};">Tami Bedford</span>
    </td>
  </tr>
  <tr>
    <td style="background:${palette.white};padding:36px 32px;border-radius:0 0 8px 8px;">
      ${params.contentHtml}
    </td>
  </tr>
  <tr>
    <td style="padding:24px 32px;font-family:${bodyFont};font-size:12px;line-height:19px;color:${palette.muted};">
      Tami Bedford — premium music sessions and creative studio.<br/>
      Piano · Organ · Music Production · Gospel &amp; Contemporary
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function heading(text: string) {
  return `<h1 style="margin:0 0 8px;font-family:${displayFont};font-size:28px;line-height:34px;font-weight:bold;color:${palette.ink};">${escapeHtml(text)}</h1>`;
}

function paragraph(html: string) {
  return `<p style="margin:0 0 16px;font-family:${bodyFont};font-size:15px;line-height:24px;color:${palette.charcoal};">${html}</p>`;
}

function divider() {
  return `<hr style="border:none;border-top:1px solid #eee5d5;margin:24px 0;"/>`;
}

export function renderTeamNotificationEmail(params: {
  inquiryId: string;
  name: string;
  email: string;
  phone?: string;
  trackLabel: string;
  type: string;
  experience: string;
  preferredTime: string;
  delivery: string;
  message: string;
  sourcePath: string;
  adminUrl?: string;
}): EmailContent {
  const subject = `New ${params.trackLabel} inquiry from ${params.name}`;

  const contentHtml = [
    `<p style="margin:0 0 6px;font-family:${bodyFont};font-size:12px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;color:${palette.red};">New inquiry</p>`,
    heading(`${params.name} — ${params.trackLabel}`),
    paragraph(
      `Received just now via <strong>${escapeHtml(params.sourcePath)}</strong>. Replying to this email goes straight to ${escapeHtml(params.name)}.`,
    ),
    `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">`,
    fieldRow("Email", params.email),
    fieldRow("Phone", params.phone ?? "Not provided"),
    fieldRow("Inquiry type", params.type),
    fieldRow("Experience", params.experience),
    fieldRow("Preferred time", params.preferredTime),
    fieldRow("Prefers contact via", params.delivery),
    `</table>`,
    divider(),
    `<p style="margin:0 0 6px;font-family:${bodyFont};font-size:11px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;color:${palette.muted};">Message</p>`,
    paragraph(escapeHtml(params.message).replace(/\n/g, "<br/>")),
    params.adminUrl ? button(params.adminUrl, "Open in Admin Panel") : "",
  ].join("");

  const text = [
    `New ${params.trackLabel} inquiry`,
    "",
    `Name: ${params.name}`,
    `Email: ${params.email}`,
    `Phone: ${params.phone ?? "Not provided"}`,
    `Inquiry type: ${params.type}`,
    `Experience: ${params.experience}`,
    `Preferred time: ${params.preferredTime}`,
    `Prefers contact via: ${params.delivery}`,
    `Source: ${params.sourcePath}`,
    "",
    "Message:",
    params.message,
    "",
    params.adminUrl ? `Admin record: ${params.adminUrl}` : `Inquiry ID: ${params.inquiryId}`,
  ].join("\n");

  return { subject, html: emailShell({ preheader: subject, contentHtml }), text };
}

export function renderApplicantConfirmationEmail(params: {
  firstName: string;
  trackLabel: string;
  experience: string;
  preferredTime: string;
  priceLine?: string;
  whatsappUrl: string;
  siteUrl?: string;
}): EmailContent {
  const subject = `We received your ${params.trackLabel} inquiry`;

  const contentHtml = [
    `<p style="margin:0 0 6px;font-family:${bodyFont};font-size:12px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;color:${palette.brass};">Inquiry received</p>`,
    heading(`Thank you, ${params.firstName}.`),
    paragraph(
      `Your inquiry for <strong>${escapeHtml(params.trackLabel)}</strong> is with the team. Here is what you told us:`,
    ),
    `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">`,
    fieldRow("Session", params.trackLabel + (params.priceLine ? ` (${params.priceLine})` : "")),
    fieldRow("Experience", params.experience),
    fieldRow("Preferred time", params.preferredTime),
    `</table>`,
    divider(),
    `<p style="margin:0 0 6px;font-family:${bodyFont};font-size:11px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;color:${palette.muted};">What happens next</p>`,
    paragraph(
      "The team reviews your goals and replies to agree on timing — nothing is locked in until you both confirm. No payment is requested before that conversation.",
    ),
    paragraph(
      "Want a faster first touch? Message us on WhatsApp and mention this inquiry.",
    ),
    button(params.whatsappUrl, "Chat on WhatsApp"),
    params.siteUrl
      ? paragraph(
          `<a href="${escapeHtml(params.siteUrl)}/sessions" style="color:${palette.red};">Compare all session paths</a> while you wait.`,
        )
      : "",
  ].join("");

  const text = [
    `Thank you, ${params.firstName}.`,
    "",
    `Your inquiry for ${params.trackLabel} is with the team.`,
    "",
    `Session: ${params.trackLabel}${params.priceLine ? ` (${params.priceLine})` : ""}`,
    `Experience: ${params.experience}`,
    `Preferred time: ${params.preferredTime}`,
    "",
    "What happens next: the team reviews your goals and replies to agree on",
    "timing. Nothing is locked in until you both confirm, and no payment is",
    "requested before that conversation.",
    "",
    `Faster first touch: ${params.whatsappUrl}`,
    params.siteUrl ? `Compare sessions: ${params.siteUrl}/sessions` : "",
  ].join("\n");

  return { subject, html: emailShell({ preheader: subject, contentHtml }), text };
}
