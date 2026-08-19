// Admin-triggered reminder / update blast.
//
// One personalised email per recipient (never a shared BCC — better
// deliverability, avoids leaking the mailing list). Sends sequentially with a
// short pacing gap so we stay well within Resend's throughput limits and
// don't burst the DB / mail-provider connection pool.
//
// Access: any admin role (admin OR super-admin). Explicitly NOT open to
// alumni or unauthenticated callers even though the surrounding middleware
// only enforces "authenticated" for non-super-admin routes.
//
// Rate limit: naive in-memory sliding window per caller — 500 emails per
// 15-minute window. Prevents accidental double-fires and reunion-day
// mass-spam mistakes without external infra.

import { sendEmail } from './mailer.js';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 500;
const SEND_SPACING_MS = 250;   // ~4 emails/sec — safe for Resend free tier
const MAX_RECIPIENTS_PER_CALL = 500;

const _recentSends = new Map(); // userId → [timestamps]

function withinRateLimit(userId, want) {
  const now = Date.now();
  const list = (_recentSends.get(userId) || []).filter((t) => now - t < WINDOW_MS);
  if (list.length + want > MAX_PER_WINDOW) return false;
  _recentSends.set(userId, list);
  return true;
}
function recordSend(userId) {
  const list = _recentSends.get(userId) || [];
  list.push(Date.now());
  _recentSends.set(userId, list);
}

// Simple 15-second async gap without pulling in a promise-timer lib.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Substitute {{name}} / {{firstName}} in the subject and body so admins can
// personalise without templating gymnastics.
function personalise(str, { name }) {
  const first = name && String(name).trim() ? String(name).trim().split(/\s+/)[0] : '';
  return String(str || '')
    .replaceAll('{{name}}', name || 'there')
    .replaceAll('{{firstName}}', first || 'there');
}

function toHtml({ greeting, bodyLines, linkUrl, linkLabel, senderName }) {
  // Inline the text color on EVERY paragraph. Many mail clients (Yahoo,
  // Outlook web, some Gmail views) don't inherit `color` from <body> into
  // nested tables, so paragraphs render in the client's default which on
  // a dark card is invisible. Explicit per-element color is the safe fix.
  const P = 'margin:0 0 12px;line-height:1.55;color:#e5e7eb;font-size:15px;';
  const bodyHtml = bodyLines
    .map((line) => `<p style="${P}">${escapeHtml(line)}</p>`)
    .join('');
  const buttonHtml = linkUrl
    ? `
      <p style="text-align:center;margin:24px 0;color:#e5e7eb;">
        <a href="${escapeAttr(linkUrl)}"
           style="display:inline-block;padding:12px 28px;background:#fbbf24;color:#0b1220;text-decoration:none;font-weight:600;border-radius:8px;">
          ${escapeHtml(linkLabel || 'Open link')}
        </a>
      </p>
      <p style="margin:0 0 12px;font-size:13px;color:#d1d5db;line-height:1.5;">
        Or copy this URL: <span style="word-break:break-all;color:#fbbf24;">${escapeHtml(linkUrl)}</span>
      </p>`
    : '';
  return `
<!doctype html>
<html>
  <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;background:#0b1220;padding:24px;color:#e5e7eb;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:560px;margin:0 auto;background:#111827;border-radius:12px;padding:32px;border:1px solid #1f2937;">
      <tr><td style="color:#e5e7eb;">
        <h1 style="font-size:20px;margin:0 0 16px;color:#fbbf24;">REConverge 2001</h1>
        <p style="${P}"><strong style="color:#ffffff;">${escapeHtml(greeting)}</strong></p>
        ${bodyHtml}
        ${buttonHtml}
        <hr style="border:none;border-top:1px solid #1f2937;margin:24px 0;" />
        <p style="margin:0 0 4px;font-size:14px;color:#e5e7eb;line-height:1.5;">Thank you,</p>
        <p style="margin:0;font-size:15px;color:#fbbf24;font-weight:600;line-height:1.5;">${escapeHtml(senderName)}</p>
        <p style="margin:2px 0 0;font-size:13px;color:#d1d5db;line-height:1.5;">On behalf of the 2001 Reunion Team</p>
      </td></tr>
    </table>
  </body>
</html>`.trim();
}

function toText({ greeting, bodyLines, linkUrl, linkLabel, senderName }) {
  return [
    greeting,
    '',
    ...bodyLines,
    ...(linkUrl ? ['', `${linkLabel || 'Open link'}: ${linkUrl}`] : []),
    '',
    'Thank you,',
    senderName,
    'On behalf of the 2001 Reunion Team',
  ].join('\n');
}

export function mountReminders(app) {
  app.post('/api/admin/send-reminder', async (req, res) => {
    const session = req.auth;
    if (!session) return res.status(401).json({ error: 'Authentication required' });
    const role = String(session.role || '');
    if (role !== 'super-admin') {
      return res.status(403).json({ error: 'Super-admin access required' });
    }

    const { recipients, subject, body, linkUrl, linkLabel, senderName, attachment } = req.body || {};

    // Validate attachment shape / size (5 MB cap on the RAW file).
    // Base64 grows ~4/3× — a 5 MB file arrives as ~6.7 MB of base64 string,
    // which comfortably fits under the express.json 12 MB limit and stays
    // well inside mail-provider limits.
    let attachments;
    if (attachment && attachment.filename && attachment.contentBase64) {
      const b64 = String(attachment.contentBase64);
      // Base64 length × 0.75 ≈ raw bytes (ignoring padding).
      const approxBytes = Math.floor((b64.length * 3) / 4);
      const MAX = 5 * 1024 * 1024;
      if (approxBytes > MAX) {
        return res.status(413).json({
          error: `Attachment too large: ${(approxBytes / 1024 / 1024).toFixed(1)} MB (max 5 MB).`,
        });
      }
      attachments = [{
        filename: String(attachment.filename).slice(0, 200),
        content: b64,
        contentType: attachment.contentType ? String(attachment.contentType).slice(0, 100) : undefined,
      }];
    }
    if (!Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: 'recipients must be a non-empty array' });
    }
    if (recipients.length > MAX_RECIPIENTS_PER_CALL) {
      return res.status(413).json({
        error: `Too many recipients — max ${MAX_RECIPIENTS_PER_CALL} per call. Break the list into smaller batches.`,
      });
    }
    if (!subject || !String(subject).trim()) {
      return res.status(400).json({ error: 'subject is required' });
    }
    if (!body || !String(body).trim()) {
      return res.status(400).json({ error: 'body is required' });
    }
    if (linkUrl && !/^https?:\/\//i.test(String(linkUrl))) {
      return res.status(400).json({ error: 'linkUrl must start with http(s)://' });
    }
    if (!withinRateLimit(session.userId, recipients.length)) {
      return res.status(429).json({
        error: `Rate limit — max ${MAX_PER_WINDOW} emails per 15-minute window per admin. Try again later.`,
      });
    }

    // De-duplicate + basic email validation up front so we don't waste sends.
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const seen = new Set();
    const clean = [];
    const invalid = [];
    for (const r of recipients) {
      const email = String(r?.email || '').trim().toLowerCase();
      if (!email || !emailRe.test(email)) { invalid.push(email); continue; }
      if (seen.has(email)) continue;
      seen.add(email);
      clean.push({ email, name: String(r?.name || '').trim() });
    }

    const bodyLines = String(body).split(/\r?\n/);
    const cleanSenderName = (String(senderName || '').trim()) || 'Reunion Volunteer';
    const sent = [];
    const failed = [];

    for (const r of clean) {
      try {
        const greeting = `Hi ${r.name ? r.name.split(/\s+/)[0] : 'there'},`;
        const personalisedSubject = personalise(subject, { name: r.name });
        const personalisedBodyLines = bodyLines.map((l) =>
          personalise(l, { name: r.name })
        );
        await sendEmail({
          to: r.email,
          subject: personalisedSubject,
          text: toText({ greeting, bodyLines: personalisedBodyLines, linkUrl, linkLabel, senderName: cleanSenderName }),
          html: toHtml({ greeting, bodyLines: personalisedBodyLines, linkUrl, linkLabel, senderName: cleanSenderName }),
          attachments,
        });
        recordSend(session.userId);
        sent.push(r.email);
      } catch (err) {
        console.error(`[reminders] send failed for ${r.email}:`, err.message);
        failed.push({ email: r.email, error: err.message });
      }
      // Pace the loop to be nice to the mail provider.
      await sleep(SEND_SPACING_MS);
    }

    res.json({
      requested: recipients.length,
      dedupedTo: clean.length,
      invalid,
      sentCount: sent.length,
      failedCount: failed.length,
      failed,
    });
  });
}

// ── helpers ────────────────────────────────────────────────────────────
function escapeHtml(s = '') {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
function escapeAttr(s = '') { return escapeHtml(s); }
