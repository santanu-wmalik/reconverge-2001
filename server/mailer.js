// Transactional email via Resend.
//
// Env config (all optional in dev — falls back to console-log):
//   RESEND_API_KEY   — the `re_…` key from resend.com/api-keys
//   MAIL_FROM        — e.g. "REConverge 2001 <noreply@reconverge.downstream-solutions.com>"
//   MAIL_REPLY_TO    — e.g. "santanu.kumar.malik@gmail.com"
//   APP_URL          — public site origin used to build reset links, e.g.
//                      https://reconverge-2001.onrender.com
//
// In dev, if RESEND_API_KEY is missing we log the would-be email to stdout
// so the flow is testable without hitting the wire.

let _resend = null;
async function getClient() {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  const { Resend } = await import('resend');
  _resend = new Resend(key);
  return _resend;
}

const DEFAULT_FROM = 'REConverge 2001 <noreply@reconverge.downstream-solutions.com>';

export async function sendEmail({ to, subject, html, text }) {
  const from = process.env.MAIL_FROM || DEFAULT_FROM;
  const replyTo = process.env.MAIL_REPLY_TO || undefined;
  const client = await getClient();

  if (!client) {
    console.log('[mailer] RESEND_API_KEY missing — logging email instead of sending:');
    console.log(`  to:       ${to}`);
    console.log(`  from:     ${from}`);
    console.log(`  reply-to: ${replyTo || '(none)'}`);
    console.log(`  subject:  ${subject}`);
    console.log(`  text:\n${text || '(html-only)'}`);
    return { skipped: true };
  }

  const { data, error } = await client.emails.send({
    from,
    to,
    subject,
    html,
    text,
    replyTo,
  });
  if (error) {
    console.error('[mailer] Resend error:', error);
    throw new Error(error.message || 'Failed to send email');
  }
  return data;
}

// ── password-reset email ────────────────────────────────────────────────
export async function sendPasswordResetEmail({ to, name, resetUrl, expiresMinutes }) {
  const greetName = name && String(name).trim() ? String(name).trim().split(/\s+/)[0] : 'there';
  const subject = 'Reset your REConverge 2001 password';

  const text = [
    `Hi ${greetName},`,
    '',
    'Someone (hopefully you) asked to reset the password for your REConverge 2001 account.',
    '',
    `Click the link below to set a new password. This link expires in ${expiresMinutes} minutes and can only be used once.`,
    '',
    resetUrl,
    '',
    "If you didn't request this, you can safely ignore this email — your password won't change.",
    '',
    '— REConverge 2001 Volunteer Team',
  ].join('\n');

  // Inline `color` on EVERY paragraph. Many mail clients (Yahoo, Outlook
  // web, some Gmail views) don't inherit color through nested tables, so
  // body-only color renders paragraphs invisible on a dark card. Explicit
  // per-element color is the safe fix.
  const P = 'margin:0 0 12px;line-height:1.55;color:#e5e7eb;font-size:15px;';
  const html = `
<!doctype html>
<html>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background:#0b1220; padding:24px; color:#e5e7eb;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; margin:0 auto; background:#111827; border-radius:12px; padding:32px; border:1px solid #1f2937;">
      <tr><td style="color:#e5e7eb;">
        <h1 style="font-size:20px; margin:0 0 16px; color:#fbbf24;">Reset your password</h1>
        <p style="${P}"><strong style="color:#ffffff;">Hi ${escapeHtml(greetName)},</strong></p>
        <p style="${P}">
          Someone (hopefully you) asked to reset the password for your
          <strong style="color:#ffffff;">REConverge 2001</strong> account.
        </p>
        <p style="margin:0 0 24px;line-height:1.55;color:#e5e7eb;font-size:15px;">
          Click the button below to set a new password. This link expires in
          <strong style="color:#ffffff;">${expiresMinutes} minutes</strong> and can only be used once.
        </p>
        <p style="text-align:center; margin:0 0 24px; color:#e5e7eb;">
          <a href="${escapeAttr(resetUrl)}"
             style="display:inline-block; padding:12px 28px; background:#fbbf24; color:#0b1220; text-decoration:none; font-weight:600; border-radius:8px;">
            Reset my password
          </a>
        </p>
        <p style="margin:0 0 12px; font-size:13px; color:#d1d5db; line-height:1.5;">
          Or copy and paste this URL into your browser:<br/>
          <span style="word-break:break-all; color:#fbbf24;">${escapeHtml(resetUrl)}</span>
        </p>
        <hr style="border:none; border-top:1px solid #1f2937; margin:24px 0;" />
        <p style="margin:0; font-size:13px; color:#d1d5db; line-height:1.5;">
          If you didn't request this, you can safely ignore this email — your password won't change.
        </p>
        <p style="margin:16px 0 0; font-size:13px; color:#d1d5db;">— REConverge 2001 Volunteer Team</p>
      </td></tr>
    </table>
  </body>
</html>`.trim();

  return sendEmail({ to, subject, html, text });
}

function escapeHtml(s = '') {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
function escapeAttr(s = '') { return escapeHtml(s); }
