import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animationVariants';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { pledgeApi } from '../../services/api';
import { BRANCHES, BRANCH_SHORT } from '../../data/constants';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

// Project Cornerstone — Alumni Guest House pledge form (portal Give Back tab).
// Ported from the fundraising committee's standalone pledge-form HTML; the
// pledge is saved against the signed-in alumnus (one per person, editable).

const TIERS = [
  { id: 'Cornerstone Circle', amount: 2500000, desc: 'Common Area Naming (2 available seats), foundation stone laying' },
  { id: 'Keystone Circle',    amount: 1000000, desc: 'Room Naming rights (20 seats available), stage felicitation' },
  { id: 'Pillar Circle',      amount: 500000,  desc: 'Donor Wall, stage felicitation' },
  { id: 'Foundation Circle',  amount: 200000,  desc: 'Donor Wall' },
  { id: 'Custom',             amount: null,    desc: 'Every gift counts toward the ₹2 Cr goal' },
];

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
const shortBranchOf = (full) => BRANCH_SHORT[BRANCHES.indexOf(full)] || full || '';

function GoalStrip() {
  return (
    <div className="flex flex-wrap justify-center gap-8 sm:gap-12 mt-6">
      {[
        { num: '₹2 Cr', label: 'Campaign goal' },
        { num: '20', label: 'Rooms funded' },
        { num: 'Dec 1', label: 'Pledges due by' },
      ].map((g) => (
        <div key={g.label} className="text-center">
          <p className="font-heading text-2xl md:text-3xl text-gold-600">{g.num}</p>
          <p className="nav-caps text-ink-muted mt-1">{g.label}</p>
        </div>
      ))}
    </div>
  );
}

export default function GiveBackPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [existing, setExisting] = useState(null);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', location: '', linkedin: '', branch: '',
    tier: '', amount: '', companyMatch: false, companyName: '',
    taxInterest: false, anonymous: false, volunteerInterest: false, message: '',
  });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // Prefill from the signed-in profile; overlay the saved pledge if present.
  useEffect(() => {
    setForm((p) => ({
      ...p,
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: [user?.currentCity, user?.state].filter(Boolean).join(', '),
      branch: shortBranchOf(user?.branch),
    }));
    pledgeApi.mine()
      .then(({ pledge, availability: avail }) => {
        if (avail) setAvailability(avail);
        if (pledge) {
          setExisting(pledge);
          setForm((p) => ({
            ...p,
            ...Object.fromEntries(Object.entries({
              name: pledge.name, email: pledge.email, phone: pledge.phone,
              location: pledge.location, linkedin: pledge.linkedin, branch: pledge.branch,
              tier: pledge.tier, amount: pledge.tier === 'Custom' ? String(pledge.amount ?? '') : '',
              companyMatch: pledge.companyMatch, companyName: pledge.companyName,
              taxInterest: pledge.taxInterest, anonymous: pledge.anonymous,
              volunteerInterest: pledge.volunteerInterest, message: pledge.message,
            }).filter(([, v]) => v !== null && v !== undefined)),
          }));
        }
      })
      .catch(() => { /* form still usable; server validates on submit */ })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const chosenTier = useMemo(() => TIERS.find((t) => t.id === form.tier), [form.tier]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tier) { showToast('Please choose a pledge tier', 'error'); return; }
    if (form.tier === 'Custom' && !(Number(form.amount) > 0)) {
      showToast('Please enter your pledge amount', 'error'); return;
    }
    setSaving(true);
    try {
      const { pledge } = await pledgeApi.submit({
        ...form,
        amount: form.tier === 'Custom' ? Number(form.amount) : undefined,
      });
      setExisting(pledge);
      setSubmitted(true);
      setEditing(false);
    } catch (err) {
      showToast(err.message || 'Could not save your pledge — please try again', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showForm = !loading && (!existing || editing) && !submitted;

  return (
    <motion.div {...pageTransition} className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="eyebrow">Project Cornerstone · REConverge 2001</span>
        <h1 className="mt-3 text-4xl md:text-5xl font-heading font-medium italic text-forest-600">
          Make your pledge to the Alumni Guest House
        </h1>
        <p className="mt-3 font-serif text-ink-muted max-w-lg mx-auto">
          Twenty-five years since we walked in as strangers. Let's give the Class of 2001 a place
          to walk back into.
        </p>
        <GoalStrip />
      </div>

      {loading ? (
        <p className="text-center text-ink-soft py-10">Loading…</p>
      ) : submitted || (existing && !editing) ? (
        /* ── Existing / just-submitted pledge summary ── */
        <GlassCard hover={false} className="text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-forest-700 text-white flex items-center justify-center text-2xl">✓</div>
          <h2 className="text-2xl font-heading font-bold text-ink mb-2">
            {submitted ? 'Pledge received' : 'Your pledge is on file'}
          </h2>
          <p className="text-ink-soft text-sm max-w-md mx-auto">
            {existing?.tier === 'Custom' ? inr(existing?.amount) : `${existing?.tier} — ${inr(existing?.amount)}`}
            {existing?.anonymous ? ' · anonymous' : ''}
          </p>
          <p className="text-ink-muted text-sm max-w-md mx-auto mt-3">
            Thank you — someone from the fundraising committee will reach out by email with payment
            details. All pledges are due by December 1, 2026.
          </p>
          <Button variant="outline" size="sm" className="mt-6" onClick={() => { setEditing(true); setSubmitted(false); }}>
            Edit my pledge
          </Button>
        </GlassCard>
      ) : showForm && (
        <form onSubmit={handleSubmit}>
          {/* Your details */}
          <GlassCard hover={false} className="mb-6">
            <h3 className="text-lg font-heading font-semibold text-ink mb-1">Your details</h3>
            <p className="text-sm text-ink-muted mb-4">
              Pre-filled from your profile — we'll use this to confirm your pledge and follow up on payment.
            </p>
            <div className="space-y-4">
              <Input label="Full name" value={form.name} onChange={(e) => set('name', e.target.value)} required />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
                <Input label="Phone (optional)" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Current location (optional)" placeholder="City, Country" value={form.location} onChange={(e) => set('location', e.target.value)} />
                <Input label="LinkedIn (optional)" placeholder="linkedin.com/in/yourname" value={form.linkedin} onChange={(e) => set('linkedin', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-soft mb-1.5">Branch (optional)</label>
                <select
                  value={form.branch}
                  onChange={(e) => set('branch', e.target.value)}
                  className="w-full bg-white border border-forest-500/15 rounded-xl px-3 py-2.5 text-sm text-ink outline-none focus:border-forest-500/40"
                >
                  <option value="">Select your branch</option>
                  {BRANCH_SHORT.map((b) => <option key={b} value={b}>{b.replace('.', '')}</option>)}
                </select>
              </div>
            </div>
          </GlassCard>

          {/* Tier */}
          <GlassCard hover={false} className="mb-6">
            <h3 className="text-lg font-heading font-semibold text-ink mb-1">Choose your tier</h3>
            <p className="text-sm text-ink-muted mb-4">Every contribution, of any size, helps build this together.</p>
            <div className="space-y-2" role="radiogroup" aria-label="Pledge tier">
              {TIERS.map((t) => {
                const avail = availability[t.id];
                const isMine = existing?.tier === t.id;
                const full = Boolean(avail && avail.left <= 0 && !isMine);
                return (
                <label
                  key={t.id}
                  className={`flex items-center justify-between gap-4 px-4 py-3 border rounded-xl transition ${
                    full
                      ? 'bg-cream-200/60 border-forest-500/10 opacity-60 cursor-not-allowed'
                      : form.tier === t.id
                        ? 'bg-[#fbf7ea] border-gold-500/70 cursor-pointer'
                        : 'bg-cream-100 border-forest-500/15 hover:border-gold-500/50 cursor-pointer'
                  }`}
                >
                  <input
                    type="radio"
                    name="tier"
                    className="sr-only"
                    checked={form.tier === t.id}
                    disabled={full}
                    onChange={() => set('tier', t.id)}
                  />
                  <span className="min-w-0">
                    <span className={`block font-semibold ${form.tier === t.id ? 'text-forest-700' : 'text-ink'}`}>
                      {t.id === 'Custom' ? 'Choose my own amount' : t.id}
                    </span>
                    <span className="block text-xs text-ink-muted mt-0.5">{t.desc}</span>
                    {avail && (
                      <span className={`block text-[11px] font-semibold mt-1 ${full ? 'text-red-700' : 'text-gold-700'}`}>
                        {full ? 'Fully subscribed' : `${avail.left} of ${avail.cap} seats left`} · first come, first served
                      </span>
                    )}
                  </span>
                  <span className={`font-heading font-bold whitespace-nowrap ${form.tier === t.id ? 'text-forest-700' : 'text-ink'}`}>
                    {t.amount ? inr(t.amount) : 'Any ₹'}
                  </span>
                </label>
                );
              })}
            </div>
            {chosenTier?.id === 'Custom' && (
              <div className="mt-4">
                <Input
                  label="Pledge amount (₹)"
                  type="number"
                  min="1"
                  placeholder="e.g. 50000"
                  value={form.amount}
                  onChange={(e) => set('amount', e.target.value)}
                  required
                />
              </div>
            )}
          </GlassCard>

          {/* Extras */}
          <GlassCard hover={false} className="mb-6">
            <h3 className="text-lg font-heading font-semibold text-ink mb-4">A couple more things <span className="text-sm font-normal text-ink-muted">(optional)</span></h3>
            <div className="space-y-4 text-sm">
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer text-ink font-medium">
                  <input type="checkbox" className="mt-0.5 accent-[#b8922a]" checked={form.companyMatch} onChange={(e) => set('companyMatch', e.target.checked)} />
                  My employer offers a matching gift program
                </label>
                {form.companyMatch && (
                  <div className="mt-2 ml-6">
                    <Input label="Company name" placeholder="e.g. Palo Alto Networks" value={form.companyName} onChange={(e) => set('companyName', e.target.value)} />
                  </div>
                )}
              </div>
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer text-ink font-medium">
                  <input type="checkbox" className="mt-0.5 accent-[#b8922a]" checked={form.taxInterest} onChange={(e) => set('taxInterest', e.target.checked)} />
                  I'd like to hear more about possible tax savings on this pledge
                </label>
                <p className="text-xs text-ink-muted mt-1 ml-6">General information only — please confirm what applies to you with your own tax advisor.</p>
              </div>
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer text-ink font-medium">
                  <input type="checkbox" className="mt-0.5 accent-[#b8922a]" checked={form.anonymous} onChange={(e) => set('anonymous', e.target.checked)} />
                  I'd like this pledge to remain anonymous
                </label>
                <p className="text-xs text-ink-muted mt-1 ml-6">Your name won't appear on the donor wall or any public list — the committee will still have your details for payment follow-up.</p>
              </div>
              <label className="flex items-start gap-2.5 cursor-pointer text-ink font-medium">
                <input type="checkbox" className="mt-0.5 accent-[#b8922a]" checked={form.volunteerInterest} onChange={(e) => set('volunteerInterest', e.target.checked)} />
                Interested in volunteering on the fundraising committee?
              </label>
            </div>
          </GlassCard>

          {/* Note */}
          <GlassCard hover={false} className="mb-6">
            <h3 className="text-lg font-heading font-semibold text-ink mb-1">A note <span className="text-sm font-normal text-ink-muted">(optional)</span></h3>
            <p className="text-sm text-ink-muted mb-3">In memory of someone, or just a line for the committee — your call.</p>
            <textarea
              value={form.message}
              onChange={(e) => set('message', e.target.value)}
              placeholder="Type here…"
              rows={4}
              className="w-full bg-cream-100 border border-forest-500/15 rounded-xl px-3 py-2.5 text-sm text-ink placeholder-ink-muted outline-none focus:border-forest-500/40 resize-y"
            />
          </GlassCard>

          <Button type="submit" size="lg" fullWidth loading={saving}>
            {existing ? 'Update my pledge' : 'Submit my pledge'}
          </Button>
          <p className="text-xs text-ink-muted text-center mt-3 leading-relaxed">
            A committee member will follow up by email with payment details.<br />
            All pledges are due by December 1, 2026.
          </p>
        </form>
      )}
    </motion.div>
  );
}
