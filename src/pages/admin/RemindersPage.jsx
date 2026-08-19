import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { alumniApi, rsvpApi, adminApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { pageTransition } from '../../utils/animationVariants';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import SectionHeading from '../../components/shared/SectionHeading';

// Combined "who can we message" list.
// - Registered alumni (users who have created an account, from `alumni` table)
// - Public RSVP form submissions (`rsvps` table) — often overlap with alumni;
//   deduplicated by lowercased email.
// Demo accounts (alumni@email.com, admin@email.com, superuser@email.com)
// are filtered out so a test-run doesn't spam them.
//
// The list is a snapshot on load — refresh the page to re-fetch. That's fine
// for a Reminders workflow that runs a few times per month.

const DEMO_EMAILS = new Set([
  'alumni@email.com',
  'admin@email.com',
  'superuser@email.com',
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_SUBJECT = 'REConverge 2001 — Update';
const DEFAULT_BODY = [
  'Hope this note finds you well.',
  '',
  'Quick update on the upcoming reunion — please take a moment to check the site for the latest details.',
  '',
  'Please do not reply to this message. For questions, use the general or branch-specific WhatsApp group we\'ve set up for the reunion — that\'s where the whole team can jump in.',
].join('\n');

const FILTER_OPTIONS = [
  { key: 'all', label: 'All' },
  { key: 'registered', label: 'Registered' },
  { key: 'rsvp_only', label: 'RSVP only' },
  { key: 'unpaid', label: 'Registered · Unpaid' },
  { key: 'paid', label: 'Paid' },
];

const DEFAULT_WEBSITE = 'https://reconverge-2001.onrender.com/';

export default function RemindersPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(() => new Set());

  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [body, setBody] = useState(DEFAULT_BODY);
  const [linkUrl, setLinkUrl] = useState(DEFAULT_WEBSITE);
  const [linkLabel, setLinkLabel] = useState('Open the reunion site');
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  // Sender identity — captured now, sent with every email so the sign-off
  // reflects whichever super-admin is doing the blast.
  const senderName = user?.name || 'Reunion Volunteer';

  // Optional attachment — { filename, contentType, size, contentBase64 }.
  // Read once from a File, kept in memory for both the batch send and the
  // test-send. 5 MB hard cap so the base64 payload stays inside the 12 MB
  // request-body ceiling on the server.
  const [attachment, setAttachment] = useState(null);
  const [attachmentError, setAttachmentError] = useState('');
  const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

  const handlePickAttachment = (e) => {
    setAttachmentError('');
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_ATTACHMENT_BYTES) {
      setAttachmentError(`Too large: ${(file.size / 1024 / 1024).toFixed(1)} MB (max 5 MB).`);
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      // dataUrl looks like "data:<mime>;base64,<b64>"; strip the prefix.
      const b64 = dataUrl.includes(',') ? dataUrl.split(',', 2)[1] : dataUrl;
      setAttachment({
        filename: file.name,
        contentType: file.type || undefined,
        size: file.size,
        contentBase64: b64,
      });
    };
    reader.onerror = () => setAttachmentError('Could not read that file.');
    reader.readAsDataURL(file);
  };

  // Test-send modal state
  const [testOpen, setTestOpen] = useState(false);
  const [testEmail, setTestEmail] = useState(user?.email || '');
  const [testName, setTestName] = useState(user?.name || '');
  const [testSending, setTestSending] = useState(false);

  // ── data load ──────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [alumni, rsvps] = await Promise.all([
          alumniApi.getAll().catch(() => []),
          rsvpApi.getAll().catch(() => []),
        ]);
        if (cancelled) return;

        const byEmail = new Map();

        // Registered alumni first — they win on collision because they carry
        // more useful fields (branch, paymentStatus, registrationId).
        for (const a of alumni || []) {
          const email = String(a.email || '').trim().toLowerCase();
          if (!email || !EMAIL_RE.test(email) || DEMO_EMAILS.has(email)) continue;
          byEmail.set(email, {
            email,
            name: a.name || '',
            branch: a.branch || '',
            city: a.currentCity || '',
            isRegistered: Boolean(a.isRegistered),
            paymentStatus: a.paymentStatus || null,
            paymentUid: a.paymentUid || null,
            registrationId: a.registrationId || null,
            hasRsvped: false,
            source: 'registered',
          });
        }

        for (const r of rsvps || []) {
          const email = String(r.email || '').trim().toLowerCase();
          if (!email || !EMAIL_RE.test(email) || DEMO_EMAILS.has(email)) continue;
          if (byEmail.has(email)) {
            byEmail.get(email).hasRsvped = true;
          } else {
            byEmail.set(email, {
              email,
              name: r.fullName || r.name || '',
              branch: r.branch || '',
              city: '',
              isRegistered: false,
              paymentStatus: null,
              paymentUid: null,
              registrationId: null,
              hasRsvped: true,
              source: 'rsvp_only',
            });
          }
        }

        const list = [...byEmail.values()].sort((a, b) =>
          (a.name || a.email).localeCompare(b.name || b.email)
        );
        setRows(list);
      } catch (err) {
        console.error('Reminders — load failed', err);
        showToast('Could not load recipient list. Try refreshing.', 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [showToast]);

  // ── derived ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (ql) {
        const hay = `${r.name} ${r.email} ${r.branch} ${r.city}`.toLowerCase();
        if (!hay.includes(ql)) return false;
      }
      switch (filter) {
        case 'registered': return r.isRegistered;
        case 'rsvp_only':  return !r.isRegistered && r.hasRsvped;
        case 'unpaid':     return r.isRegistered && r.paymentStatus !== 'paid' && r.paymentStatus !== 'confirmed';
        case 'paid':       return r.paymentStatus === 'paid' || r.paymentStatus === 'confirmed';
        default:           return true;
      }
    });
  }, [rows, filter, q]);

  const stats = useMemo(() => ({
    total: rows.length,
    registered: rows.filter((r) => r.isRegistered).length,
    rsvpOnly: rows.filter((r) => !r.isRegistered && r.hasRsvped).length,
    paid: rows.filter((r) => r.paymentStatus === 'paid' || r.paymentStatus === 'confirmed').length,
    unpaid: rows.filter((r) => r.isRegistered && r.paymentStatus !== 'paid' && r.paymentStatus !== 'confirmed').length,
  }), [rows]);

  const allFilteredSelected = filtered.length > 0 && filtered.every((r) => selected.has(r.email));

  const toggleOne = (email) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email); else next.add(email);
      return next;
    });
  };
  const toggleAllFiltered = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) filtered.forEach((r) => next.delete(r.email));
      else filtered.forEach((r) => next.add(r.email));
      return next;
    });
  };
  const clearSelection = () => setSelected(new Set());

  // ── send ───────────────────────────────────────────────────────────
  const insertLinkMarker = () => {
    if (!linkUrl.trim()) {
      showToast('Add a URL first', 'error');
      return;
    }
    // Simple append — admin can move it around inside the textarea.
    setBody((prev) => `${prev}${prev.endsWith('\n') ? '' : '\n'}\n${linkLabel || 'Open the reunion site'}: ${linkUrl}\n`);
    showToast('Link appended to the message.', 'success');
  };

  const handleSend = async () => {
    const chosen = rows.filter((r) => selected.has(r.email));
    if (chosen.length === 0) { showToast('Select at least one recipient', 'error'); return; }
    if (!subject.trim()) { showToast('Subject is required', 'error'); return; }
    if (!body.trim())    { showToast('Message body is required', 'error'); return; }
    if (linkUrl && !/^https?:\/\//i.test(linkUrl)) {
      showToast('Link URL must start with http:// or https://', 'error');
      return;
    }
    const ok = window.confirm(
      `Send this email to ${chosen.length} recipient${chosen.length === 1 ? '' : 's'}?\n\nThis cannot be undone.`
    );
    if (!ok) return;

    setSending(true);
    setLastResult(null);
    try {
      const result = await adminApi.sendReminder({
        recipients: chosen.map((r) => ({ email: r.email, name: r.name })),
        subject: subject.trim(),
        body,
        linkUrl: linkUrl.trim() || undefined,
        linkLabel: linkLabel.trim() || undefined,
        senderName,
        attachment: attachment
          ? {
              filename: attachment.filename,
              contentType: attachment.contentType,
              contentBase64: attachment.contentBase64,
            }
          : undefined,
      });
      setLastResult(result);
      showToast(
        `Sent ${result.sentCount} of ${result.dedupedTo}${result.failedCount ? ` — ${result.failedCount} failed` : ''}`,
        result.failedCount ? 'error' : 'success'
      );
    } catch (err) {
      console.error('Send reminder failed', err);
      showToast(err.message || 'Send failed. Try again.', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleSendTest = async () => {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(testEmail.trim())) {
      showToast('Enter a valid email', 'error'); return;
    }
    if (!subject.trim() || !body.trim()) {
      showToast('Fill in Subject and Message first', 'error'); return;
    }
    if (linkUrl && !/^https?:\/\//i.test(linkUrl)) {
      showToast('Link URL must start with http:// or https://', 'error'); return;
    }
    setTestSending(true);
    try {
      const result = await adminApi.sendReminder({
        recipients: [{ email: testEmail.trim(), name: testName.trim() }],
        subject: `[TEST] ${subject.trim()}`,
        body,
        linkUrl: linkUrl.trim() || undefined,
        linkLabel: linkLabel.trim() || undefined,
        senderName,
        attachment: attachment
          ? {
              filename: attachment.filename,
              contentType: attachment.contentType,
              contentBase64: attachment.contentBase64,
            }
          : undefined,
      });
      if (result.sentCount === 1) {
        showToast(`Test sent to ${testEmail.trim()}`, 'success');
        setTestOpen(false);
      } else {
        showToast(
          `Test failed: ${result.failed?.[0]?.error || 'unknown error'}`,
          'error'
        );
      }
    } catch (err) {
      showToast(err.message || 'Test send failed', 'error');
    } finally {
      setTestSending(false);
    }
  };

  // ── render ─────────────────────────────────────────────────────────
  return (
    <motion.div {...pageTransition}>
      <SectionHeading
        title="Reminders & Updates"
        subtitle="Send a personalised message to registered alumni and RSVP form respondents. One email per recipient — never a shared BCC."
      />

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatCard label="Total contacts" value={stats.total} />
        <StatCard label="Registered" value={stats.registered} />
        <StatCard label="RSVP only" value={stats.rsvpOnly} />
        <StatCard label="Paid" value={stats.paid} tone="success" />
        <StatCard label="Registered · Unpaid" value={stats.unpaid} tone="warn" />
      </div>

      {/* Compose bar (sticky at top of page content) */}
      <GlassCard className="mb-6 border-gold-500/30" hover={false}>
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <span>✉️</span> Compose message
        </h3>
        <div className="grid gap-3">
          <Input
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="REConverge 2001 — Update"
          />
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/20 focus:bg-white/10"
              placeholder="Hi {{firstName}}, ..."
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Placeholders <span className="font-mono text-slate-300">{'{{name}}'}</span> and{' '}
              <span className="font-mono text-slate-300">{'{{firstName}}'}</span> are replaced per recipient.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <Input
                label="Website link (optional)"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://reconverge-2001.onrender.com"
              />
            </div>
            <Input
              label="Button label"
              value={linkLabel}
              onChange={(e) => setLinkLabel(e.target.value)}
              placeholder="Open the reunion site"
            />
          </div>
          {/* Optional attachment */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Attachment (optional) <span className="text-slate-500 text-xs">— max 5 MB</span>
            </label>
            {!attachment ? (
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:border-gold-400/40 hover:text-white transition">
                📎 Choose file…
                <input
                  type="file"
                  className="hidden"
                  onChange={handlePickAttachment}
                />
              </label>
            ) : (
              <div className="flex flex-wrap items-center gap-3 text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                <span>📎</span>
                <span className="text-white font-medium break-all">{attachment.filename}</span>
                <span className="text-slate-500">
                  {(attachment.size / 1024).toFixed(0)} KB
                  {attachment.contentType ? ` · ${attachment.contentType}` : ''}
                </span>
                <button
                  type="button"
                  onClick={() => { setAttachment(null); setAttachmentError(''); }}
                  className="ml-auto text-red-300 hover:text-red-200 transition"
                >
                  Remove
                </button>
              </div>
            )}
            {attachmentError && (
              <p className="text-xs text-red-300 mt-1">{attachmentError}</p>
            )}
            <p className="text-[11px] text-slate-500 mt-1">
              Attached to every recipient's email. Common formats work: PDF, PNG, JPG, DOCX, XLSX.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="ghost" size="sm" onClick={insertLinkMarker}>
              ↩ Append link to message
            </Button>
            <Button variant="outline" size="sm" onClick={() => setTestOpen(true)}>
              🧪 Send test email
            </Button>
            <span className="text-[11px] text-slate-500">
              (The link also renders as a gold button at the bottom of the email.
              Sign-off will read <span className="text-slate-300">{senderName}</span>.)
            </span>
          </div>
        </div>
      </GlassCard>

      {/* Filter + search */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 text-xs rounded-md transition ${
                filter === f.key
                  ? 'bg-gold-500 text-navy-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-[200px]">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, branch, city…"
          />
        </div>
      </div>

      {/* Selection + send bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={allFilteredSelected}
              onChange={toggleAllFiltered}
              className="rounded bg-white/10 border-white/20 text-gold-500 focus:ring-gold-400/30"
            />
            <span>Select all filtered ({filtered.length})</span>
          </label>
          <span className="text-slate-500">·</span>
          <span>{selected.size} selected</span>
          {selected.size > 0 && (
            <button
              type="button"
              onClick={clearSelection}
              className="text-xs text-slate-400 hover:text-white underline underline-offset-2"
            >
              clear
            </button>
          )}
        </div>
        <Button
          onClick={handleSend}
          loading={sending}
          disabled={selected.size === 0 || !subject.trim() || !body.trim()}
        >
          Send to {selected.size} recipient{selected.size === 1 ? '' : 's'}
        </Button>
      </div>

      {/* Recipient list */}
      <GlassCard hover={false} padding="p-0">
        {loading ? (
          <p className="p-8 text-center text-slate-400 text-sm">Loading contacts…</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-slate-400 text-sm">No contacts match this filter.</p>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((r) => {
              const checked = selected.has(r.email);
              return (
                <label
                  key={r.email}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${
                    checked ? 'bg-gold-500/5' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleOne(r.email)}
                    className="rounded bg-white/10 border-white/20 text-gold-500 focus:ring-gold-400/30 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-white font-medium truncate">{r.name || '(no name)'}</span>
                      {r.source === 'registered' && <Badge size="sm">Registered</Badge>}
                      {r.source === 'rsvp_only' && <Badge variant="gold" size="sm">RSVP only</Badge>}
                      {r.hasRsvped && r.source === 'registered' && (
                        <Badge variant="gold" size="sm">RSVP ✓</Badge>
                      )}
                      <PaymentPill status={r.paymentStatus} isRegistered={r.isRegistered} />
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {r.email}
                      {r.branch && <> · {r.branch}</>}
                      {r.city && <> · {r.city}</>}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </GlassCard>

      {/* Test-send modal */}
      <Modal
        isOpen={testOpen}
        onClose={() => !testSending && setTestOpen(false)}
        title="🧪 Send test email"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            Sends one copy of the current subject / message / link to any address you like.
            Subject will be prefixed with <span className="text-slate-300">[TEST]</span> so it's
            easy to spot in the inbox.
          </p>
          <Input
            label="Send test to (email)"
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <Input
            label="Recipient name (used in greeting + placeholders)"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            placeholder="e.g. Santanu"
          />
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button onClick={handleSendTest} loading={testSending} disabled={!testEmail.trim()}>
              Send test now
            </Button>
            <Button variant="ghost" onClick={() => setTestOpen(false)} disabled={testSending}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Last send result */}
      {lastResult && (
        <GlassCard className="mt-6 border-white/10" hover={false}>
          <h4 className="text-white font-semibold mb-2">Last send</h4>
          <p className="text-sm text-slate-300">
            Requested <span className="text-white">{lastResult.requested}</span>,
            deduped to <span className="text-white">{lastResult.dedupedTo}</span>,
            sent <span className="text-emerald-300">{lastResult.sentCount}</span>
            {lastResult.failedCount > 0 && (
              <>
                , failed <span className="text-red-300">{lastResult.failedCount}</span>.
              </>
            )}
          </p>
          {lastResult.failed?.length > 0 && (
            <ul className="mt-2 text-xs text-red-300 space-y-1">
              {lastResult.failed.map((f) => (
                <li key={f.email}>· {f.email} — {f.error}</li>
              ))}
            </ul>
          )}
        </GlassCard>
      )}
    </motion.div>
  );
}

// ── local sub-components ────────────────────────────────────────────
function StatCard({ label, value, tone }) {
  const toneCls = tone === 'success'
    ? 'text-emerald-300'
    : tone === 'warn'
      ? 'text-amber-300'
      : 'text-gold-400';
  return (
    <GlassCard padding="p-4">
      <p className="text-[11px] uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`text-2xl font-heading font-bold ${toneCls}`}>{value}</p>
    </GlassCard>
  );
}

function PaymentPill({ status, isRegistered }) {
  if (!isRegistered) return null;
  if (status === 'paid' || status === 'confirmed') {
    return <Badge variant="success" size="sm">Paid</Badge>;
  }
  if (status === 'pending') {
    return <Badge variant="gold" size="sm">Under verification</Badge>;
  }
  return <Badge variant="warning" size="sm">Awaiting payment</Badge>;
}
