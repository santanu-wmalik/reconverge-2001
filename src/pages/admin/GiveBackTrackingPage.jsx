import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animationVariants';
import { useToast } from '../../context/ToastContext';
import { gbTrackingApi, publicApi } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

// Give Back Tracking — the fundraising committee's outreach master list
// (imported from the "Reunion Fundraising" sheet). Gated by the 'gbtracking'
// permission, granted per-user by the super admin in Users.
//
// Goal: plan future calls — who owns each batchmate, what came out of the
// last call, and where the next ₹ is likely to come from.

const yes = (v) => /^y|^paid|^\d/i.test(String(v || '').trim());

// Live status from the API when the row matched the database; otherwise
// derived from the imported sheet columns.
// Effective commit in lakhs — the sheet's soft commit, or failing that the
// amount from the website intent-to-give (stored in ₹).
const commitOf = (r) => {
  const sheet = Number(r.commitLakhs);
  if (sheet > 0) return sheet;
  const web = Number(r.intentAmount);
  return web > 0 ? web / 100000 : 0;
};
const lakhs = (n) => `₹${Number(n.toFixed(2)).toLocaleString('en-IN')} L`;

// Amount actually paid — live from the matched profile, else the sheet value.
const paidAmt = (r) => {
  const live = Number(r.live?.paymentAmount);
  if (live > 0) return live;
  const sheet = Number(String(r.paid || '').replace(/[^\d.]/g, ''));
  return sheet > 0 ? sheet : 0;
};
const thousands = (n) => `₹${Number((n / 1000).toFixed(1)).toLocaleString('en-IN')}K`;

// "Needs caller": no POC assigned, a phone number to actually call, and no
// commitment yet (sheet or website) — the actionable backlog.
const needsCaller = (r) =>
  !(r.poc || '').trim() && Boolean((r.phone || r.live?.phone || '').trim())
  && !(commitOf(r) > 0) && !yes(r.intentSubmitted);

// Split a POC cell into individual names — "Asif / Dheeraj" credits both.
const pocNamesOf = (r) =>
  String(r.poc || '').split(/[,/&]|\band\b/i).map((s) => s.trim()).filter(Boolean);

const statusOf = (r) =>
  r.status || (yes(r.paid) ? 'Paid' : yes(r.registered) ? 'Registered' : null);

const STATUS_CHIP = {
  'Paid':           'text-forest-800 bg-forest-500/15',
  'Give Back':      'text-gold-700 bg-gold-500/15',
  'Registered':     'text-sky-800 bg-sky-100',
  'Shown Interest': 'text-amber-800 bg-amber-100',
};

// Co. match and website intent live in the expanded editor only — they are
// not grid columns.
const EDIT_FIELDS = [
  ['commitLakhs', 'Soft commit (₹ Lakhs)', 'e.g. 5'],
  ['companyMatch', 'Company match', 'e.g. Yes — Google'],
  ['intentSubmitted', 'Intent on website', 'Yes / No'],
  ['moneySent', 'Money sent to NITCAA', 'Yes / amount'],
  ['phone', 'Phone', '+91-…'],
];

// ─── Multi-select dropdown (checkbox list) ────────────────────────────────
function MultiSelect({ label, options, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  const toggle = (v) => {
    const next = new Set(selected);
    if (next.has(v)) next.delete(v); else next.add(v);
    onChange(next);
  };
  const title = selected.size === 0
    ? `All ${label}`
    : selected.size <= 2
      ? Array.from(selected).map((v) => (options.find(([k]) => k === v)?.[1] ?? v)).join(', ')
      : `${label}: ${selected.size} selected`;
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 bg-white border rounded-xl px-3 py-2 text-sm ${selected.size ? 'border-forest-500/50 text-forest-700 font-semibold' : 'border-forest-500/15 text-ink'}`}
        aria-expanded={open}
      >
        <span className="max-w-[180px] truncate">{title}</span>
        <span className="text-ink-muted text-xs">▾</span>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 min-w-[200px] max-h-72 overflow-y-auto bg-white border border-forest-500/15 rounded-xl shadow-lg py-1.5">
          <button
            onClick={() => onChange(new Set())}
            className="w-full text-left px-3 py-1.5 text-xs font-semibold text-gold-700 hover:bg-cream-100"
          >
            Clear — show all
          </button>
          {options.map(([v, l]) => (
            <label key={v} className="flex items-center gap-2.5 px-3 py-1.5 text-sm cursor-pointer hover:bg-cream-100">
              <input
                type="checkbox"
                className="accent-[#3f6238]"
                checked={selected.has(v)}
                onChange={() => toggle(v)}
              />
              <span className="truncate">{l}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Searchable name combobox ─────────────────────────────────────────────
// Free text plus suggestions from the REGISTERED alumni roster — picking a
// suggestion renames the row to the exact profile name, which guarantees the
// live match (Registration column) locks on.
function NameCombo({ value, linkedId, linkedRegId, onChange, roster }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  const needle = value.toLowerCase().trim();
  const matches = needle
    ? roster.filter((r) => r.name.toLowerCase().includes(needle)).slice(0, 8)
    : [];
  return (
    <div className="relative" ref={ref}>
      <Input
        label="Full name"
        value={value}
        onChange={(e) => { onChange(e.target.value, null); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Type to search registered alumni…"
      />
      <p className="text-[11px] mt-1 text-ink-muted">
        {linkedId
          ? <span className="text-forest-700 font-semibold">🔗 Pinned{linkedRegId ? ` to ${linkedRegId}` : ' to a registered profile'} — status comes from this profile; no fuzzy matching.</span>
          : 'Pick a suggestion to pin this row to that registered profile (needed when two alumni share a name).'}
      </p>
      {open && matches.length > 0 && (
        <div className="absolute z-50 mt-1 w-full max-h-64 overflow-y-auto bg-white border border-forest-500/15 rounded-xl shadow-lg py-1">
          {matches.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => { onChange(r.name, r.id); setOpen(false); }}
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-cream-100"
            >
              {r.name}
              <span className="text-xs text-ink-muted">
                {' '}· {r.branch || '—'}
                {r.regId ? <> · <span className="font-semibold text-forest-700">{r.regId}</span></> : ''}
                {r.paid ? ' · paid' : ''}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Inline row editor ────────────────────────────────────────────────────
function RowEditor({ row, onSaved, onCancel, onDeleted, roster }) {
  const { showToast } = useToast();
  const [draft, setDraft] = useState({
    fullName: row.fullName || '',
    matchedAlumniId: row.matchedAlumniId || null,
    poc: row.poc || '', commitLakhs: row.commitLakhs ?? '', companyMatch: row.companyMatch || '',
    intentSubmitted: row.intentSubmitted || '', moneySent: row.moneySent || '',
    phone: row.phone || '', comments: row.comments || '',
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setDraft((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!draft.fullName.trim()) return;
    setSaving(true);
    try {
      const updated = await gbTrackingApi.update(row.id, draft);
      onSaved(updated);
      showToast(`${row.fullName} updated`, 'success');
    } catch (err) {
      showToast(err.message || 'Could not save', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-cream-100 border-t border-gold-500/20 px-4 py-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <NameCombo
          value={draft.fullName}
          linkedId={draft.matchedAlumniId}
          linkedRegId={draft.matchedAlumniId ? (roster.find((r) => r.id === draft.matchedAlumniId)?.regId || row.matchedRegistrationId) : null}
          onChange={(v, id) => setDraft((p) => ({ ...p, fullName: v, matchedAlumniId: id }))}
          roster={roster}
        />
        {/* POC — a registered user picked from the dropdown (free text still
            allowed for shared assignments like "Asif / Dheeraj"). */}
        <div>
          <Input
            label="Outreach point of contact"
            placeholder="Pick a registered user…"
            value={draft.poc}
            onChange={(e) => set('poc', e.target.value)}
            list="poc-roster-list"
          />
          <datalist id="poc-roster-list">
            {roster.map((r) => <option key={r.id} value={r.name} />)}
          </datalist>
        </div>
        {EDIT_FIELDS.map(([k, label, ph]) => (
          <Input key={k} label={label} placeholder={ph} value={draft[k]} onChange={(e) => set(k, e.target.value)} />
        ))}
      </div>
      <div className="mt-3">
        <label className="block text-sm font-medium text-ink-soft mb-1.5">
          Call notes / comments
          <span className="font-normal text-ink-muted"> — what came out of the last conversation, and the plan for the next one</span>
        </label>
        <textarea
          value={draft.comments}
          onChange={(e) => set('comments', e.target.value)}
          rows={3}
          placeholder="e.g. 12 Oct — spoke on WhatsApp, warm, will decide after Diwali. Follow up first week of Nov."
          className="w-full bg-white border border-forest-500/15 rounded-xl px-2 py-2 text-sm text-ink placeholder-ink-muted outline-none focus:border-forest-500/40 resize-y"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <Button size="sm" onClick={save} loading={saving}>Save</Button>
        <Button size="sm" variant="outline" onClick={onCancel}>Cancel</Button>
        <button
          onClick={async () => {
            if (!window.confirm(`Remove ${row.fullName} from the tracker?`)) return;
            try { await gbTrackingApi.remove(row.id); onDeleted(row.id); }
            catch (err) { showToast(err.message || 'Could not delete', 'error'); }
          }}
          className="ml-auto text-xs text-red-700/80 hover:text-red-700 underline"
        >
          Remove row
        </button>
        {row.paid && (
          <span className="text-[11px] text-ink-muted">
            Paid (from sheet): <b className="text-ink-soft">{/^\d/.test(String(row.paid)) ? `₹${Number(row.paid).toLocaleString('en-IN')}` : row.paid}</b>
          </span>
        )}
        {row.updatedBy && (
          <span className="text-[11px] text-ink-muted">
            Last edit: {row.updatedBy} · {row.updatedAt ? new Date(row.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Columns (full sheet) ─────────────────────────────────────────────────
// [key, label, cellClass] — every column from the master list is in the grid.
const COLUMNS = [
  // Branch / location / home / WhatsApp / status / paid live UNDER the name;
  // the secondary filter row covers them.
  ['name',     'Name',        'px-3 py-2'],
  ['status',   'Registration', 'px-2 py-2 text-center'],
  ['paid',     'Paid',        'px-2 py-2 text-right'],
  ['phone',    'Phone',       'px-2 py-2'],
  ['email',    'Email',       'px-2 py-2'],
  ['poc',      'POC',         'px-2 py-2 w-[42px]'],
  ['intentweb', 'Intent-Web', 'px-2 py-2 text-right w-[70px]'],
  ['commit',   'Soft-Commit', 'px-2 py-2 text-right w-[78px]'],
  ['note',     'Last note',   'px-2 py-2'],
];

const sortVal = (r, key) => {
  switch (key) {
    case 'name':       return (r.fullName || '').toLowerCase();
    case 'branch':     return (r.branch || '').toLowerCase();
    case 'location':   return (r.location || '').toLowerCase();
    case 'home':       return (r.homeState || '').toLowerCase();
    case 'whatsapp':   return r.onWhatsapp === 'Yes' ? 1 : 0;
    case 'status': {
      const s = statusOf(r);
      return s === 'Paid' ? 4 : s === 'Give Back' ? 3 : s === 'Registered' ? 2 : s === 'Shown Interest' ? 1 : 0;
    }
    case 'paid':       return paidAmt(r) || (yes(r.paid) || statusOf(r) === 'Paid' ? 1 : 0);
    case 'phone':      return (r.phone || r.live?.phone || '').toLowerCase();
    case 'email':      return (r.live?.email || '').toLowerCase();
    case 'poc':        return (r.poc || '').trim().toLowerCase();
    case 'intentweb':  return Number(r.intentAmount) > 0 ? Number(r.intentAmount) / 1e5 : (yes(r.intentSubmitted) ? 0.01 : 0);
    case 'commit':     return commitOf(r);
    case 'match':      return (r.companyMatch || '').toLowerCase();
    case 'intent':     return yes(r.intentSubmitted) ? 1 : 0;
    case 'sent':       return yes(r.moneySent) ? 1 : 0;
    case 'note':       return (r.comments || '').trim().toLowerCase();
    default:           return 0;
  }
};

const VIEW_OPTIONS = [
  ['unassigned', 'Needs caller'],
  ['committed', 'Committed'],
  ['called', 'Has notes'],
  ['intent', 'Intent on website'],
  ['nophone', 'No phone'],
  ['noemail', 'No email'],
];

export default function GiveBackTrackingPage() {
  const { showToast } = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  // Multi-select filters — empty set = no filter.
  const [views, setViews] = useState(() => new Set());
  const [branchSel, setBranchSel] = useState(() => new Set());
  const [pocSel, setPocSel] = useState(() => new Set());
  // Secondary filters — the fields folded under the Name column.
  const [statusSel, setStatusSel] = useState(() => new Set());
  const [pocCard, setPocCard] = useState(null); // active POC leaderboard card
  const [homeSel, setHomeSel] = useState(() => new Set());
  const [locSel, setLocSel] = useState(() => new Set());
  const [waSel, setWaSel] = useState(() => new Set());
  const [openId, setOpenId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [showLog, setShowLog] = useState(false); // change-history popup
  const [boardAll, setBoardAll] = useState(false); // leaderboard: top 10 vs everyone
  const [newName, setNewName] = useState('');
  const [newBranch, setNewBranch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [liveModal, setLiveModal] = useState(null); // row whose registration popup is open
  const [roster, setRoster] = useState([]); // registered alumni, for the name combobox
  const [summary, setSummary] = useState(null); // public summary — intent aggregates incl. anonymous
  const [logEntries, setLogEntries] = useState([]); // change history — edit counts per caller
  // Column sort: { key, dir } — dir 1 asc, -1 desc. null = the default
  // order: website intents first, then biggest soft commit.
  const [sort, setSort] = useState(null);
  const sortBy = (key) =>
    setSort((prev) => (prev?.key === key ? (prev.dir === 1 ? { key, dir: -1 } : null) : { key, dir: 1 }));

  useEffect(() => {
    gbTrackingApi.list()
      .then(setRows)
      .catch((err) => setError(err.message || 'Could not load the tracker'))
      .finally(() => setLoading(false));
    publicApi.givebackSummary().then(setSummary).catch(() => {});
    gbTrackingApi.log().then(setLogEntries).catch(() => {});
    gbTrackingApi.roster().then(setRoster).catch(() => {
      // Older API without the roster route — fall back to the public roster
      // (no registration ids there).
      publicApi.rollOfHonour().then((d) => setRoster(d.roster || [])).catch(() => {});
    });
  }, []);

  const pocOptions = useMemo(
    () => Array.from(new Set(rows.map((r) => (r.poc || '').trim()).filter(Boolean))).sort().map((p) => [p, p]),
    [rows]
  );
  const branchOptions = useMemo(
    () => Array.from(new Set(rows.map((r) => (r.branch || '').trim()).filter(Boolean))).sort().map((b) => [b, b]),
    [rows]
  );
  const homeOptions = useMemo(
    () => Array.from(new Set(rows.map((r) => (r.homeState || '').trim()).filter(Boolean))).sort().map((h) => [h, h]),
    [rows]
  );
  const locOptions = useMemo(
    () => Array.from(new Set(rows.map((r) => (r.location || '').trim()).filter(Boolean))).sort().map((l) => [l, l]),
    [rows]
  );
  const STATUS_OPTIONS = [
    ['Paid', 'Paid'], ['Give Back', 'Give Back'], ['Registered', 'Registered'],
    ['Shown Interest', 'Shown Interest'], ['none', 'No status'],
  ];
  const WA_OPTIONS = [['Yes', 'On WhatsApp'], ['No', 'Not on WhatsApp']];

  const filtered = useMemo(() => {
    const needle = q.toLowerCase().trim();
    return rows.filter((r) => {
      if (needle && !`${r.fullName} ${r.location || ''} ${r.phone || ''} ${r.poc || ''} ${r.comments || ''}`.toLowerCase().includes(needle)) return false;
      if (branchSel.size && !branchSel.has((r.branch || '').trim())) return false;
      if (pocSel.size && !pocSel.has((r.poc || '').trim())) return false;
      if (pocCard && !pocNamesOf(r).includes(pocCard)) return false;
      if (views.has('unassigned') && !needsCaller(r)) return false;
      if (views.has('committed') && !(commitOf(r) > 0)) return false;
      if (views.has('called') && !(r.comments || '').trim()) return false;
      if (views.has('intent') && !yes(r.intentSubmitted)) return false;
      if (views.has('nophone') && (r.phone || r.live?.phone || '').trim()) return false;
      if (views.has('noemail') && (r.live?.email || '').trim()) return false;
      if (statusSel.size && !statusSel.has(statusOf(r) || 'none')) return false;
      if (homeSel.size && !homeSel.has((r.homeState || '').trim())) return false;
      if (locSel.size && !locSel.has((r.location || '').trim())) return false;
      if (waSel.size && !waSel.has(r.onWhatsapp === 'Yes' ? 'Yes' : 'No')) return false;
      return true;
    });
  }, [rows, q, branchSel, pocSel, pocCard, views, statusSel, homeSel, locSel, waSel]);

  const sorted = useMemo(() => {
    if (!sort) {
      // Default: intent on website first, then soft commit (desc), then name.
      return filtered.slice().sort((a, b) =>
        (yes(b.intentSubmitted) - yes(a.intentSubmitted)) ||
        (commitOf(b) - commitOf(a)) ||
        (a.fullName || '').localeCompare(b.fullName || '')
      );
    }
    const { key, dir } = sort;
    return filtered.slice().sort((a, b) => {
      const va = sortVal(a, key); const vb = sortVal(b, key);
      if (va < vb) return -dir;
      if (va > vb) return dir;
      return (a.fullName || '').localeCompare(b.fullName || '');
    });
  }, [filtered, sort]);

  // Pagination — back to page 1 whenever a filter or sort changes.
  useEffect(() => { setPage(0); }, [q, branchSel, pocSel, pocCard, views, statusSel, homeSel, locSel, waSel, pageSize, sort]);
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const paged = useMemo(
    () => sorted.slice(safePage * pageSize, (safePage + 1) * pageSize),
    [sorted, safePage, pageSize]
  );

  const stats = useMemo(() => {
    // The cards show the SAME numbers as the home and campaign pages: the
    // server summary (sheet commit, else matched web intent, plus anonymous
    // and off-tracker intents). The grid-row sum is the fallback while it
    // loads — it runs slightly lower because anonymous rows are hidden here.
    const committed = rows.filter((r) => commitOf(r) > 0);
    return {
      total: rows.length,
      assigned: rows.filter((r) => (r.poc || '').trim()).length,
      committed: summary?.donors ?? committed.length,
      commitTotal: summary?.pledged != null
        ? summary.pledged / 1e5
        : committed.reduce((s, r) => s + commitOf(r), 0),
      // Prefer the server aggregate — it includes ANONYMOUS intents, which
      // the grid rows deliberately omit. Grid-derived numbers are the
      // fallback while the summary loads.
      intents: summary?.webIntents
        ? summary.webIntents.count
        : rows.filter((r) => yes(r.intentSubmitted)).length,
      intentTotal: summary?.webIntents
        ? summary.webIntents.amount / 1e5
        : rows.reduce((s, r) => s + (Number(r.intentAmount) > 0 ? Number(r.intentAmount) / 1e5 : 0), 0),
      sent: rows.filter((r) => yes(r.moneySent)).length,
    };
  }, [rows, summary]);

  // POC leaderboard — shared POCs ("Asif / Dheeraj") credit BOTH in full.
  const pocBoard = useMemo(() => {
    const m = new Map();
    for (const r of rows) {
      for (const name of pocNamesOf(r)) {
        if (!m.has(name)) m.set(name, { name, assigned: 0, commits: 0, total: 0, done: 0 });
        const e = m.get(name);
        e.assigned += 1;
        const c = commitOf(r);
        if (c > 0) { e.commits += 1; e.total += c; }
        if (yes(r.moneySent)) e.done += 1; // closed — money sent to NITCAA
      }
    }
    return Array.from(m.values()).sort((a, b) => b.total - a.total || b.commits - a.commits || a.name.localeCompare(b.name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  // Edits made on this grid, credited to each caller by matching the caller's
  // (informal) name against the change-log author's registered full name.
  const changesByCaller = useMemo(() => {
    const authors = new Map(); // author full name (lower) -> edit count
    for (const e of logEntries) {
      const k = String(e.author || '').toLowerCase().trim();
      if (k) authors.set(k, (authors.get(k) || 0) + 1);
    }
    const m = new Map();
    for (const p of pocBoard) {
      const toks = p.name.toLowerCase().split(/\s+/).filter(Boolean);
      if (!toks.length || p.name.toLowerCase() === 'self') { m.set(p.name, null); continue; }
      let n = 0;
      for (const [a, c] of authors) {
        const at = a.split(/\s+/);
        if (toks.every((t) => at.some((w) => w === t || w.startsWith(t)))) n += c;
      }
      m.set(p.name, n);
    }
    return m;
  }, [logEntries, pocBoard]);

  const patchRow = (updated) => {
    const before = rows.find((r) => r.id === updated.id);
    // The PATCH response has no live-match enrichment, so keep the previous
    // live fields optimistically…
    setRows((prev) => prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)));
    setOpenId(null);
    // …and when the NAME changed, re-fetch so the new name gets matched
    // against the registered alumni straight away.
    if (before && (before.fullName !== updated.fullName || before.matchedAlumniId !== updated.matchedAlumniId)) {
      gbTrackingApi.list().then(setRows).catch(() => {});
    }
  };

  const addPerson = async () => {
    if (!newName.trim()) { showToast('Enter a name', 'error'); return; }
    try {
      const created = await gbTrackingApi.create({ fullName: newName, branch: newBranch });
      setRows((prev) => [...prev, created]);
      setNewName(''); setNewBranch(''); setAdding(false);
      setOpenId(created.id);
    } catch (err) {
      showToast(err.message || 'Could not add', 'error');
    }
  };

  return (
    <motion.div {...pageTransition}>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <span className="eyebrow">Project Cornerstone · Fundraising committee</span>
          <h1 className="mt-1 text-3xl md:text-4xl font-heading font-medium italic text-forest-600">Give Back Tracking</h1>
          <p className="text-sm text-ink-muted mt-1">
            Outreach master list — assign callers, log what each call said, and plan the next one.
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowLog(true)}>
            🕘 Changes
          </Button>
          <Button size="sm" variant="outline" onClick={() => setAdding((a) => !a)}>
            {adding ? 'Close' : '+ Add person'}
          </Button>
        </div>
      </div>

      {adding && (
        <GlassCard hover={false} className="mb-5">
          <div className="grid sm:grid-cols-[1fr_200px_auto] gap-3 items-end">
            <Input label="Full name" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <Input label="Branch" placeholder="e.g. ECE" value={newBranch} onChange={(e) => setNewBranch(e.target.value)} />
            <Button onClick={addPerson}>Add</Button>
          </div>
        </GlassCard>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3 mb-6">
        {[
          [stats.total, 'batchmates'],
          [stats.assigned, 'have a POC'],
          [stats.committed, 'soft commits'],
          [lakhs(stats.commitTotal), 'Commit Amount', true],
          [stats.intents, 'Intent on Site'],
          [lakhs(stats.intentTotal), 'Intent Amount', true],
          [stats.sent, 'sent to NITCAA'],
        ].map(([v, l, money]) => (
          <GlassCard key={l} hover={false} className="!p-4 text-center">
            <p className={`font-heading text-2xl ${money ? 'text-emerald-600' : 'text-forest-700'}`}>{loading ? '—' : v}</p>
            <p className="text-[11px] text-ink-muted mt-0.5">{l}</p>
          </GlassCard>
        ))}
      </div>

      {/* POC leaderboard — who brought in what. Shared POCs credit both. */}
      {pocBoard.length > 0 && (
        <GlassCard hover={false} className="mb-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
            <p className="nav-caps text-[10px] text-ink-muted">Caller leaderboard</p>
            <p className="text-[11px] text-ink-muted">
              Shared assignments credit every named caller in full. Click a row to filter the grid{pocCard ? ' — click again to clear' : ''}.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-ink-muted border-b border-forest-500/15">
                  <th className="px-2 py-2 w-[36px]">#</th>
                  <th className="px-2 py-2">Caller</th>
                  <th className="px-2 py-2 text-right">Raised</th>
                  <th className="px-2 py-2 text-right">Commits</th>
                  <th className="px-2 py-2 text-right">Done</th>
                  <th className="px-2 py-2 text-right">Assigned</th>
                  <th className="px-2 py-2 text-right" title="Edits made on this grid by the caller">Changes</th>
                </tr>
              </thead>
              <tbody>
                {(boardAll ? pocBoard : pocBoard.slice(0, 10)).map((p, i) => {
                  const winner = i === 0 && p.total > 0;
                  const edits = changesByCaller.get(p.name);
                  return (
                    <tr
                      key={p.name}
                      onClick={() => setPocCard((c) => (c === p.name ? null : p.name))}
                      aria-pressed={pocCard === p.name}
                      className={`cursor-pointer border-b border-forest-500/10 transition ${
                        pocCard === p.name
                          ? 'bg-forest-500/10 ring-1 ring-inset ring-forest-600/30'
                          : winner
                            ? 'bg-gold-500/10 hover:bg-gold-500/20'
                            : 'hover:bg-cream-100'
                      }`}
                    >
                      <td className="px-2 py-2 text-xs text-ink-muted tabular-nums">{winner ? '🏆' : i + 1}</td>
                      {/* First name only — the full registered name is the tooltip. */}
                      <td className={`px-2 py-2 truncate max-w-[180px] ${winner ? 'font-bold text-gold-700' : 'font-semibold text-ink'}`} title={p.name}>
                        {p.name.split(/\s+/)[0]}
                      </td>
                      <td className={`px-2 py-2 text-right font-heading tabular-nums ${winner ? 'text-lg text-gold-700' : 'text-forest-700'}`}>{lakhs(p.total)}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{p.commits || '—'}</td>
                      <td className="px-2 py-2 text-right tabular-nums">
                        {p.done > 0 ? <span className="font-semibold text-emerald-700">✓ {p.done}</span> : '—'}
                      </td>
                      <td className="px-2 py-2 text-right tabular-nums text-ink-soft">{p.assigned}</td>
                      <td className="px-2 py-2 text-right tabular-nums text-ink-soft">{edits ? edits : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {pocBoard.length > 10 && (
            <div className="text-center mt-2">
              <button
                type="button"
                onClick={() => setBoardAll((a) => !a)}
                className="text-xs font-semibold text-forest-700 hover:text-forest-800 underline underline-offset-2"
              >
                {boardAll ? '▲ Show top 10' : `▼ Show all ${pocBoard.length} callers`}
              </button>
            </div>
          )}
        </GlassCard>
      )}

      {/* Filters: search → status multi-select → branch multi-select → POC multi-select */}
      {/* relative z-30: GlassCard's backdrop-blur makes a stacking context,
          so without this the table card below paints over the open menus. */}
      <GlassCard hover={false} className="mb-5 !py-4 !overflow-visible relative z-30">
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, phone, POC, comments…"
            className="flex-1 min-w-[200px] bg-white border border-forest-500/15 rounded-xl px-3 py-2 text-sm outline-none focus:border-forest-500/40"
          />
          <div className="flex rounded-xl overflow-hidden border border-forest-500/15 text-xs font-semibold" title="Combine filters — click to toggle each">
            <button
              onClick={() => setViews(new Set())}
              className={`px-3 py-2 ${views.size === 0 ? 'bg-forest-600 text-white' : 'bg-white text-ink-soft hover:bg-cream-100'}`}
            >
              All
            </button>
            {VIEW_OPTIONS.map(([k, l]) => (
              <button
                key={k}
                onClick={() => setViews((prev) => { const next = new Set(prev); next.has(k) ? next.delete(k) : next.add(k); return next; })}
                aria-pressed={views.has(k)}
                className={`px-3 py-2 whitespace-nowrap ${views.has(k) ? 'bg-forest-600 text-white' : 'bg-white text-ink-soft hover:bg-cream-100'}`}
              >
                {views.has(k) ? '✓ ' : ''}{l}
              </button>
            ))}
          </div>
          <MultiSelect label="branches" options={branchOptions} selected={branchSel} onChange={setBranchSel} />
          <MultiSelect label="POCs" options={pocOptions} selected={pocSel} onChange={setPocSel} />
          <span className="text-xs text-ink-muted ml-auto">{filtered.length} matching</span>
        </div>
        {/* Secondary filters — the fields shown under each name */}
        <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-forest-500/10">
          <span className="nav-caps text-[10px] text-ink-muted">More filters</span>
          <MultiSelect label="status" options={STATUS_OPTIONS} selected={statusSel} onChange={setStatusSel} />
          <MultiSelect label="home states" options={homeOptions} selected={homeSel} onChange={setHomeSel} />
          <MultiSelect label="locations" options={locOptions} selected={locSel} onChange={setLocSel} />
          <MultiSelect label="WhatsApp" options={WA_OPTIONS} selected={waSel} onChange={setWaSel} />
        </div>
      </GlassCard>

      {/* Table */}
      {loading ? (
        <p className="text-center text-ink-soft py-10">Loading…</p>
      ) : error ? (
        <GlassCard hover={false} className="text-center text-sm text-red-700/90">
          {error}
          <p className="text-ink-muted mt-1">If the table is new, restart the API server so the schema applies, then run the import script.</p>
        </GlassCard>
      ) : (
        <GlassCard hover={false} className="!p-0 overflow-hidden">
          {filtered.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-forest-500/10 bg-cream-100/60 text-sm">
              <span className="text-ink-muted text-xs">
                Showing {safePage * pageSize + 1}–{Math.min(filtered.length, (safePage + 1) * pageSize)} of {filtered.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setPage(Math.max(0, safePage - 1)); setOpenId(null); }}
                  disabled={safePage === 0}
                  className="px-3 py-1.5 rounded-lg border border-forest-500/20 bg-white text-xs font-semibold disabled:opacity-40 hover:bg-cream-100"
                >
                  ← Prev
                </button>
                <span className="text-xs text-ink-soft tabular-nums">Page {safePage + 1} of {pageCount}</span>
                <button
                  onClick={() => { setPage(Math.min(pageCount - 1, safePage + 1)); setOpenId(null); }}
                  disabled={safePage >= pageCount - 1}
                  className="px-3 py-1.5 rounded-lg border border-forest-500/20 bg-white text-xs font-semibold disabled:opacity-40 hover:bg-cream-100"
                >
                  Next →
                </button>
              </div>
              <label className="flex items-center gap-1.5 text-xs text-ink-muted">
                Rows per page
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-white border border-forest-500/15 rounded-lg px-2 py-1 text-xs"
                >
                  {[25, 50, 100, 500].map((n) => <option key={n} value={n}>{n === 500 ? 'All' : n}</option>)}
                </select>
              </label>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream-200/70 text-left nav-caps text-[10px] text-ink-muted">
                  {COLUMNS.map(([key, label, cls]) => (
                    <th key={key} className={cls} aria-sort={sort?.key === key ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
                      <button
                        onClick={() => sortBy(key)}
                        className={`nav-caps text-[10px] inline-flex items-center gap-1 hover:text-forest-700 whitespace-nowrap ${sort?.key === key ? 'text-forest-700' : 'text-ink-muted'}`}
                        title="Sort by this column"
                      >
                        {label}
                        <span className="text-[9px]">{sort?.key === key ? (sort.dir === 1 ? '▲' : '▼') : '↕'}</span>
                      </button>
                    </th>
                  ))}
                  <th className="px-2 py-2" />
                </tr>
              </thead>
              <tbody>
                {paged.map((r) => (
                  <RowPair
                    key={r.id}
                    row={r}
                    open={openId === r.id}
                    onToggle={() => setOpenId((id) => (id === r.id ? null : r.id))}
                    onSaved={patchRow}
                    onDeleted={(id) => { setRows((prev) => prev.filter((x) => x.id !== id)); setOpenId(null); }}
                    onShowLive={setLiveModal}
                    roster={roster}
                  />
                ))}
              </tbody>
              {filtered.length > 0 && (
                <tfoot>
                  <tr className="border-t-2 border-forest-500/20 bg-cream-200/70 font-semibold">
                    <td className="px-3 py-2" colSpan={2}>Total · {filtered.length} matching</td>
                    <td className="px-2 py-2 text-right tabular-nums text-forest-700">
                      {thousands(filtered.reduce((s, r) => s + paidAmt(r), 0))}
                    </td>
                    <td className="px-2 py-2" />
                    <td className="px-2 py-2" />
                    <td className="px-2 py-2 text-xs text-ink-muted">
                      {filtered.filter((r) => (r.poc || '').trim()).length} with POC
                    </td>
                    <td className="px-2 py-2 text-right tabular-nums text-emerald-600">
                      {lakhs(filtered.reduce((s, r) => s + (Number(r.intentAmount) > 0 ? Number(r.intentAmount) / 1e5 : 0), 0))}
                    </td>
                    <td className="px-2 py-2 text-right tabular-nums text-forest-700">
                      {lakhs(filtered.reduce((s, r) => s + commitOf(r), 0))}
                    </td>
                    <td className="px-2 py-2 text-xs text-ink-muted">
                      {filtered.filter((r) => (r.comments || '').trim()).length} with notes
                    </td>
                    <td className="px-2 py-2" />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-sm text-ink-muted py-8">No one matches these filters.</p>
          )}
        </GlassCard>
      )}

      {liveModal && (
        <LiveDetailModal row={liveModal} onClose={() => setLiveModal(null)} />
      )}
      {showLog && <ChangeLogModal onClose={() => setShowLog(false)} />}
    </motion.div>
  );
}

// ─── "In Website" registration popup ──────────────────────────────────────
const inr = (n) => (n != null && Number.isFinite(Number(n)) ? `₹${Number(n).toLocaleString('en-IN')}` : '—');

function LiveDetailModal({ row, onClose }) {
  const d = row.live || {};
  const status = statusOf(row);
  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [onClose]);

  const fields = d.rsvpOnly
    ? [
        ['Matched RSVP name', d.name],
        ['Status', 'Shown Interest — RSVP only, no website profile yet'],
        ['Email', d.email || '—'],
        ['Family joining', d.familyJoining || '—'],
        ['Food preference', d.foodPreference || '—'],
        ['Volunteering', d.volunteer ? 'Yes' : '—'],
        ['RSVP submitted', d.since ? new Date(d.since).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'],
      ]
    : [
        ['Profile name', d.name],
        ['Registration ID', d.regId ? <b className="text-forest-700">{d.regId}</b> : '—'],
        ['Status', status],
        ['Participation', d.participation === 'giveback-only' ? 'Give Back only (not attending)' : 'Attending'],
        ['Payment status', d.paymentStatus || 'not paid'],
        ['Amount paid', d.paymentAmount > 0 ? inr(d.paymentAmount) : '—'],
        ['Registration fee', inr(d.registrationFee)],
        ['Family members', d.family ?? '—'],
        ['Email', d.email || '—'],
        ['Phone', d.phone || '—'],
        ['City', d.city || '—'],
        ['Profile created', d.since ? new Date(d.since).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'],
      ];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-forest-500/15 w-full max-w-md max-h-[85vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-forest-500/10">
          <div>
            <p className="font-heading text-xl text-forest-700">{row.fullName}</p>
            <p className="text-xs text-ink-muted mt-0.5">
              Matched website record{d.name && d.name !== row.fullName ? ` — "${d.name}"` : ''}
            </p>
          </div>
          {status && (
            <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_CHIP[status] || 'text-ink-soft bg-cream-200'}`}>
              {status}
            </span>
          )}
        </div>
        <dl className="px-5 py-4 grid grid-cols-[140px_1fr] gap-x-3 gap-y-2 text-sm">
          {fields.map(([k, v]) => (
            <Fragment key={k}>
              <dt className="text-ink-muted">{k}</dt>
              <dd className="text-ink break-words">{v ?? '—'}</dd>
            </Fragment>
          ))}
        </dl>
        <div className="px-5 pb-4 text-right">
          <Button size="sm" variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}

const check = (on) => (on ? '✓' : '—');

// Phone: sheet number first, falling back to the matched registration's
// number; when both exist and differ, the registration one shows as "/ other".
const telHref = (p) => `tel:${String(p).replace(/[^+\d]/g, '')}`;
const samePhone = (a, b) => String(a).replace(/\D/g, '').slice(-10) === String(b).replace(/\D/g, '').slice(-10);
function PhoneCell({ row }) {
  const sheet = (row.phone || '').trim();
  const live = (row.live?.phone || '').trim();
  const main = sheet || live;
  if (!main) return '—';
  const other = sheet && live && !samePhone(sheet, live) ? live : null;
  return (
    <>
      <a href={telHref(main)} onClick={(e) => e.stopPropagation()} className="text-forest-700 hover:underline" title={!sheet ? 'From the matched registration' : undefined}>
        {main}
      </a>
      {other && (
        <span className="block text-[11px] text-ink-muted">
          / <a href={telHref(other)} onClick={(e) => e.stopPropagation()} className="hover:underline" title="Other number — from the matched registration">{other}</a>
        </span>
      )}
    </>
  );
}

function RowPair({ row, open, onToggle, onSaved, onDeleted, onShowLive, roster }) {
  return (
    <>
      <tr
        onClick={onToggle}
        className={`border-t border-forest-500/10 cursor-pointer ${open ? 'bg-[#fbf7ea]' : 'hover:bg-cream-100/70'}`}
      >
        <td className="px-3 py-2 max-w-[180px]">
          <span className="font-medium text-ink whitespace-nowrap">{row.fullName}</span>
          <span className="block text-[11px] text-ink-muted font-normal truncate">
            {[row.branch, row.location, row.homeState].filter(Boolean).join(' · ') || '—'}
            {row.onWhatsapp === 'Yes' ? <> · <span title="On the batch WhatsApp group" className="cursor-default">🟢</span></> : ''}
            {yes(row.paid) && statusOf(row) !== 'Paid' ? ' · paid (sheet)' : ''}
          </span>
        </td>
        <td className="px-2 py-2 text-center whitespace-nowrap">
          {row.liveMatch && statusOf(row) ? (
            <button
              onClick={(e) => { e.stopPropagation(); onShowLive(row); }}
              title={`Matched to website profile${row.liveName ? ` "${row.liveName}"` : ''} — click for registration details`}
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full hover:ring-1 hover:ring-forest-500/40 ${STATUS_CHIP[statusOf(row)] || 'text-ink-soft bg-cream-200'}`}
            >
              {statusOf(row)}
            </button>
          ) : statusOf(row) ? (
            <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full opacity-70 ${STATUS_CHIP[statusOf(row)] || 'text-ink-soft bg-cream-200'}`} title="From the imported sheet — no website match">
              {statusOf(row)}
            </span>
          ) : '—'}
        </td>
        <td className="px-2 py-2 text-right tabular-nums whitespace-nowrap">
          {paidAmt(row) > 0
            ? <span title={Number(row.live?.paymentAmount) > 0 ? 'Live from the website' : 'From the imported sheet'}>{thousands(paidAmt(row))}</span>
            : statusOf(row) === 'Paid' ? '✓' : '—'}
        </td>
        <td className="px-2 py-2 whitespace-nowrap">
          <PhoneCell row={row} />
        </td>
        <td className="px-2 py-2 max-w-[170px]">
          {row.live?.email ? (
            <a
              href={`mailto:${row.live.email}`}
              onClick={(e) => e.stopPropagation()}
              className="block truncate text-forest-700 hover:underline"
              title={row.live.email}
            >
              {row.live.email}
            </a>
          ) : '—'}
        </td>
        <td className="px-2 py-2 whitespace-nowrap">
          {row.poc
            ? <span className="text-ink">{row.poc}</span>
            : needsCaller(row)
              ? <span className="inline-block text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full" title="Needs caller — has a phone number, no commitment yet, and no outreach point of contact assigned">NC</span>
              : '—'}
        </td>
        {/* Intent-Web — the amount from the website intent to give; "ask"
            flags people who haven't filed one yet. */}
        <td className="px-2 py-2 text-right tabular-nums whitespace-nowrap">
          {Number(row.intentAmount) > 0
            ? <span className="font-semibold text-emerald-600" title="Amount from the website intent to give">{lakhs(Number(row.intentAmount) / 1e5)}</span>
            : yes(row.intentSubmitted)
              ? <span className="text-forest-700" title="Intent to give submitted on the website">✓</span>
              : Number(row.commitLakhs) > 0
                ? <span className="inline-block text-[10px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-full" title="Soft commit made but no intent to give on the website yet — follow up to get one filed">follow-up</span>
                : '—'}
        </td>
        {/* Soft-Commit — from the sheet / POC call; when blank, the website
            intent amount stands in so the row still shows its money. */}
        <td className="px-2 py-2 text-right tabular-nums whitespace-nowrap">
          {commitOf(row) > 0
            ? <span className="font-semibold text-forest-700" title={Number(row.commitLakhs) > 0 ? 'Soft commit from outreach (sheet / POC call)' : 'No soft commit yet — showing the website intent amount'}>{lakhs(commitOf(row))}</span>
            : '—'}
        </td>
        <td className="px-2 py-2 max-w-0 w-[32%]">
          <span className="block truncate text-ink-muted" title={row.comments || ''}>{row.comments || '—'}</span>
        </td>
        <td className="px-2 py-2 text-ink-muted text-xs">{open ? '▴' : '✏️'}</td>
      </tr>
      {open && (
        <tr>
          <td colSpan={COLUMNS.length + 1} className="p-0">
            <RowEditor row={row} onSaved={onSaved} onCancel={onToggle} onDeleted={onDeleted} roster={roster} />
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Change history popup ──────────────────────────────────────────────────
// Every edit on this grid is logged server-side (one entry per changed
// field). This modal shows the trail, most recent first, with filters.
const LOG_FIELD_LABEL = {
  fullName: 'Name', branch: 'Branch', location: 'Location', homeState: 'Home state',
  onWhatsapp: 'WhatsApp', registered: 'Registered', paid: 'Paid', phone: 'Phone',
  poc: 'POC', commitLakhs: 'Soft commit (₹L)', companyMatch: 'Company match',
  intentSubmitted: 'Intent on site', moneySent: 'Sent to NITCAA', comments: 'Note',
  matchedAlumniId: 'Pinned profile',
};
const LOG_ACTION_CHIP = {
  added:   'text-forest-800 bg-forest-500/15',
  updated: 'text-sky-800 bg-sky-100',
  deleted: 'text-red-800 bg-red-100',
};
const fmtWhen = (v) => {
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true,
  });
};
const logVal = (e, v) =>
  v == null || v === '' ? '—' : e.field === 'commitLakhs' ? `₹${Number(v)} L` : String(v);

function ChangeLogModal({ onClose }) {
  const [entries, setEntries] = useState(null); // null = loading
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [author, setAuthor] = useState('');
  const [field, setField] = useState('');
  const [action, setAction] = useState('');
  const [page, setPage] = useState(0);
  const PAGE = 20;

  useEffect(() => {
    gbTrackingApi.log().then(setEntries).catch((err) => setError(err.message || 'Could not load changes'));
  }, []);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const authors = useMemo(
    () => Array.from(new Set((entries || []).map((e) => e.author).filter(Boolean))).sort(),
    [entries]
  );
  const fields = useMemo(
    () => Array.from(new Set((entries || []).map((e) => e.field).filter(Boolean)))
      .sort((a, b) => (LOG_FIELD_LABEL[a] || a).localeCompare(LOG_FIELD_LABEL[b] || b)),
    [entries]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (entries || []).filter((e) =>
      (!author || e.author === author)
      && (!field || e.field === field)
      && (!action || e.action === action)
      && (!needle
        || [e.fullName, e.author, e.oldValue, e.newValue, LOG_FIELD_LABEL[e.field] || e.field]
          .some((v) => String(v || '').toLowerCase().includes(needle)))
    );
  }, [entries, q, author, field, action]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const safePage = Math.min(page, pages - 1);
  const slice = filtered.slice(safePage * PAGE, (safePage + 1) * PAGE);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-forest-500/15 w-full max-w-4xl max-h-[88vh] flex flex-col">
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-forest-500/10">
          <div>
            <p className="font-heading text-xl text-forest-700">Tracking Changes</p>
            <p className="text-xs text-ink-muted mt-0.5">
              Every edit to the outreach grid — who changed what, and when. Most recent first.
            </p>
          </div>
          <button onClick={onClose} className="text-ink-muted hover:text-ink text-xl leading-none px-1" aria-label="Close">×</button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 px-5 py-3 border-b border-forest-500/10 bg-cream-100/60">
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(0); }}
            placeholder="Search name, author, value…"
            className="flex-1 min-w-[180px] bg-white border border-forest-500/15 rounded-xl px-3 py-1.5 text-sm"
          />
          <select value={author} onChange={(e) => { setAuthor(e.target.value); setPage(0); }} className="bg-white border border-forest-500/15 rounded-xl px-2.5 py-1.5 text-sm">
            <option value="">All authors</option>
            {authors.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={field} onChange={(e) => { setField(e.target.value); setPage(0); }} className="bg-white border border-forest-500/15 rounded-xl px-2.5 py-1.5 text-sm">
            <option value="">All fields</option>
            {fields.map((f) => <option key={f} value={f}>{LOG_FIELD_LABEL[f] || f}</option>)}
          </select>
          <select value={action} onChange={(e) => { setAction(e.target.value); setPage(0); }} className="bg-white border border-forest-500/15 rounded-xl px-2.5 py-1.5 text-sm">
            <option value="">All actions</option>
            <option value="updated">Updated</option>
            <option value="added">Added</option>
            <option value="deleted">Deleted</option>
          </select>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto">
          {error ? (
            <p className="text-sm text-red-700 px-5 py-6">{error}</p>
          ) : entries === null ? (
            <p className="text-sm text-ink-muted px-5 py-6">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-ink-muted px-5 py-6">
              {entries.length === 0
                ? 'No changes recorded yet — history starts with the first edit after this feature went live.'
                : 'Nothing matches these filters.'}
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white shadow-[0_1px_0_rgba(63,98,56,0.12)]">
                <tr className="text-left text-[10px] uppercase tracking-wider text-ink-muted">
                  <th className="px-5 py-2 whitespace-nowrap">When</th>
                  <th className="px-2 py-2">Author</th>
                  <th className="px-2 py-2">Batchmate</th>
                  <th className="px-2 py-2">Change</th>
                </tr>
              </thead>
              <tbody>
                {slice.map((e) => (
                  <tr key={e.id} className="border-t border-forest-500/10 align-top">
                    <td className="px-5 py-2 whitespace-nowrap text-xs text-ink-muted tabular-nums">{fmtWhen(e.at)}</td>
                    <td className="px-2 py-2 text-xs text-ink-soft max-w-[160px] truncate" title={e.authorEmail || e.author || ''}>{e.author || '—'}</td>
                    <td className="px-2 py-2 font-medium text-ink max-w-[180px] truncate" title={e.fullName || ''}>{e.fullName || '—'}</td>
                    <td className="px-2 py-2">
                      <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full mr-1.5 ${LOG_ACTION_CHIP[e.action] || 'text-ink-soft bg-cream-200'}`}>
                        {e.action}
                      </span>
                      {e.action === 'updated' ? (
                        <span className="text-xs">
                          <span className="font-semibold text-forest-700">{LOG_FIELD_LABEL[e.field] || e.field}</span>
                          {': '}
                          <span className="text-ink-muted line-through decoration-ink-muted/50">{logVal(e, e.oldValue)}</span>
                          {' → '}
                          <span className="text-ink font-medium">{logVal(e, e.newValue)}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-ink-muted">{e.action === 'added' ? (e.newValue || 'new row') : (e.oldValue || 'row removed')}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer / pagination */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-forest-500/10 text-xs text-ink-muted">
          <span>{filtered.length} change{filtered.length === 1 ? '' : 's'}</span>
          {pages > 1 && (
            <span className="flex items-center gap-2">
              <button disabled={safePage === 0} onClick={() => setPage(safePage - 1)} className="px-2 py-1 rounded-lg border border-forest-500/15 bg-white disabled:opacity-40">← Prev</button>
              Page {safePage + 1} of {pages}
              <button disabled={safePage >= pages - 1} onClick={() => setPage(safePage + 1)} className="px-2 py-1 rounded-lg border border-forest-500/15 bg-white disabled:opacity-40">Next →</button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
