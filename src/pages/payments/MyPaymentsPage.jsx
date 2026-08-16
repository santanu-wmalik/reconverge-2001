import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { pageTransition } from '../../utils/animationVariants';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import SectionHeading from '../../components/shared/SectionHeading';
import { EVENT_CONFIG } from '../../data/constants';
import {
  batchBankAccount,
  healthCentreProject,
  eightyGEligibilityNote,
} from '../../data/donationCampaigns';

// ── copy helper ─────────────────────────────────────────────────────────
function CopyChip({ value, label }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignored */ }
  };
  return (
    <button
      type="button"
      onClick={copy}
      title={`Copy ${label}`}
      className="ml-2 text-[11px] px-2 py-0.5 rounded border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition"
    >
      {copied ? '✓ copied' : 'copy'}
    </button>
  );
}

function DetailRow({ label, value, mono = false, copyable = false }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-white/5 last:border-b-0">
      <span className="text-xs text-slate-400 uppercase tracking-wider">{label}</span>
      <span className={`text-sm text-white text-right break-all ${mono ? 'font-mono' : ''}`}>
        {value}
        {copyable && <CopyChip value={value} label={label} />}
      </span>
    </div>
  );
}

// ── page ────────────────────────────────────────────────────────────────
export default function MyPaymentsPage() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [uid, setUid] = useState(user?.paymentUid || '');
  const [saving, setSaving] = useState(false);

  // Family total drives the amount owed for registration.
  const familyCount = Math.max(
    0,
    (Number(user?.adults || 1) - 1) +
      Number(user?.childrenUnder10 || 0) +
      Number(user?.children10Plus || 0)
  );
  const selfFee = EVENT_CONFIG.registrationFee;
  const familyFee = familyCount * EVENT_CONFIG.familyMemberFee;
  const totalDue = selfFee + familyFee;

  // Current registration payment state — derived from the alumnus profile.
  const status = useMemo(() => {
    const paid = user?.paymentStatus === 'confirmed' || user?.paymentStatus === 'paid';
    if (paid) return { key: 'paid', label: 'Paid & Verified', tone: 'success', step: 5 };
    if (user?.paymentUid) return { key: 'pending', label: 'Under Verification', tone: 'gold', step: 4 };
    if (user?.isRegistered) return { key: 'awaiting', label: 'Awaiting Payment', tone: 'warning', step: 2 };
    return { key: 'not_started', label: 'Not Registered', tone: 'default', step: 1 };
  }, [user]);

  const handleSaveUid = async () => {
    const trimmed = uid.trim();
    if (!trimmed) {
      showToast('Please paste the transaction reference from your bank / UPI receipt', 'error');
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ paymentUid: trimmed });
      showToast('Payment UID saved. Finance Committee will verify shortly.', 'success');
    } catch (err) {
      console.error('Payment UID save failed:', err);
      showToast('Could not save. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div {...pageTransition} className="max-w-5xl mx-auto">
      <SectionHeading
        title="My Payments"
        subtitle="Everything you need to complete your reunion payment — and, if you wish, contribute to Give Back."
      />

      {/* ─── Status snapshot ─────────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <GlassCard>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Registration Fee</p>
              <p className="text-2xl font-heading font-bold text-gold-400">
                ₹{totalDue.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                ₹{selfFee.toLocaleString('en-IN')} self
                {familyCount > 0 && ` + ₹${EVENT_CONFIG.familyMemberFee.toLocaleString('en-IN')} × ${familyCount} family`}
              </p>
            </div>
            <Badge variant={status.tone} size="sm">{status.label}</Badge>
          </div>
          {status.key === 'not_started' && (
            <Link to="/register">
              <Button size="sm" fullWidth>Complete registration first</Button>
            </Link>
          )}
          {status.key === 'awaiting' && (
            <p className="text-xs text-slate-400">
              Registered ✅ — transfer the fee to the batch account below and paste the transaction
              reference in Step 4.
            </p>
          )}
          {status.key === 'pending' && (
            <p className="text-xs text-slate-400">
              Payment UID on file: <span className="text-gold-400 font-mono break-all">{user?.paymentUid}</span>. The
              Finance Committee is reconciling with the bank statement — status flips to Paid
              once matched.
            </p>
          )}
          {status.key === 'paid' && (
            <p className="text-xs text-emerald-300">
              ✓ Registration fee received and verified. You're all set.
            </p>
          )}
        </GlassCard>

        <GlassCard className="border-emerald-500/20">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Give Back (Optional)</p>
              <p className="text-lg font-heading font-bold text-white leading-tight">
                {healthCentreProject.name}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">New Health Centre at NIT Calicut</p>
            </div>
            <Badge size="sm">Voluntary</Badge>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Separate from your registration fee. Contributions route through the NITCAA project
            account. Wall of Honor recognition at ₹1 lakh+.
          </p>
          <Link to="/give-back">
            <Button size="sm" variant="ghost" fullWidth>Open Give Back page →</Button>
          </Link>
        </GlassCard>
      </div>

      {/* ─── Sequential registration checklist ───────────────────────── */}
      <h2 className="text-xl font-heading font-bold text-white mb-1">
        Step-by-step: pay your registration fee
      </h2>
      <p className="text-slate-400 text-sm mb-6">
        Do these in order. You can pause after any step and come back — nothing here is time-boxed
        beyond the reunion date.
      </p>

      <ol className="space-y-4 mb-12">
        <Step
          n={1}
          done={status.step > 1}
          active={status.step === 1}
          title="Complete your profile"
          body={
            status.step > 1 ? (
              <p className="text-sm text-slate-300">
                Registered as <span className="text-gold-400">{user?.registrationId || user?.email}</span>. ✓
              </p>
            ) : (
              <div className="text-sm text-slate-300 space-y-2">
                <p>Registration isn't complete yet. Finish that first so we know how many family
                  members you're bringing (it affects the amount).</p>
                <Link to="/register">
                  <Button size="sm">Go to Registration</Button>
                </Link>
              </div>
            )
          }
        />

        <Step
          n={2}
          done={status.step > 2}
          active={status.step === 2}
          title="Confirm the amount you owe"
          body={
            <div className="text-sm text-slate-300 space-y-2">
              <div className="rounded-lg border border-white/10 bg-white/3 p-3">
                <div className="flex items-center justify-between">
                  <span>Self ({user?.name || 'you'})</span>
                  <span className="font-mono">₹{selfFee.toLocaleString('en-IN')}</span>
                </div>
                {familyCount > 0 && (
                  <div className="flex items-center justify-between mt-1">
                    <span>Family × {familyCount} @ ₹{EVENT_CONFIG.familyMemberFee.toLocaleString('en-IN')}</span>
                    <span className="font-mono">₹{familyFee.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-white font-semibold">
                  <span>Total due</span>
                  <span className="font-mono text-gold-400">₹{totalDue.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                If your family count is wrong, fix it in{' '}
                <Link to="/profile/edit" className="text-gold-400 hover:text-gold-300 underline">
                  Edit Profile
                </Link>{' '}
                before paying — the Finance Committee reconciles against this number.
              </p>
            </div>
          }
        />

        <Step
          n={3}
          done={status.step > 3}
          active={status.step === 3}
          title="Transfer to the batch bank account"
          body={
            <div className="text-sm text-slate-300 space-y-3">
              <div className="rounded-lg border border-gold-500/30 bg-gold-500/5 p-4">
                <DetailRow label="Beneficiary" value={batchBankAccount.beneficiary} />
                <DetailRow label="Account No" value={batchBankAccount.accountNumber} mono copyable />
                <DetailRow label="IFSC" value={batchBankAccount.ifsc} mono copyable />
                <DetailRow label="Branch" value={`${batchBankAccount.bankBranch} (${batchBankAccount.branchCode})`} />
                <DetailRow label="Address" value={batchBankAccount.branchAddress} />
                <DetailRow label="Supports" value={batchBankAccount.supports.join(' · ')} />
              </div>
              <p className="text-xs text-slate-400">
                <span className="font-semibold text-gold-400">Important:</span>{' '}
                {batchBankAccount.paymentReferenceHint}
                {user?.registrationId && (
                  <>
                    {' '}Yours is <span className="font-mono text-white">{user.registrationId}</span>
                    <CopyChip value={user.registrationId} label="Registration ID" />.
                  </>
                )}
              </p>
              <p className="text-xs text-slate-500">
                NEFT / RTGS / IMPS credit within a few hours. UPI is instant but has a daily cap
                (usually ₹1 lakh) — plan accordingly if your family total exceeds that.
              </p>
            </div>
          }
        />

        <Step
          n={4}
          done={status.step > 4}
          active={status.step === 4}
          title="Paste your transaction reference here"
          body={
            <div className="text-sm text-slate-300 space-y-3">
              <p>
                After the transfer, your bank / UPI app will show a{' '}
                <span className="text-white">transaction reference</span> (also called UTR / RRN /
                Txn ID). Paste it below so the Finance Committee can match your payment.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  placeholder="e.g. UTR 5142236617XXXX or UPI ref 428935847293"
                  className="flex-1"
                />
                <Button
                  onClick={handleSaveUid}
                  loading={saving}
                  disabled={!uid.trim() || uid.trim() === (user?.paymentUid || '')}
                >
                  {user?.paymentUid ? 'Update' : 'Save'}
                </Button>
              </div>
              {user?.paymentUid && (
                <p className="text-xs text-slate-500">
                  Current on file: <span className="text-slate-300 font-mono">{user.paymentUid}</span>
                </p>
              )}
            </div>
          }
        />

        <Step
          n={5}
          done={status.step >= 5}
          active={status.step === 5}
          title="Finance Committee verifies → status flips to Paid"
          body={
            status.step >= 5 ? (
              <p className="text-sm text-emerald-300">
                ✓ Verified. Your Registration Fee is fully settled. Thank you!
              </p>
            ) : (
              <p className="text-sm text-slate-300">
                The Finance Committee reconciles bank statements periodically (usually within
                48 hours). You'll see the status card at the top flip to <span className="text-emerald-300">Paid &amp; Verified</span> once matched — no further action from your side.
              </p>
            )
          }
        />
      </ol>

      {/* ─── Give Back — condensed ───────────────────────────────────── */}
      <h2 className="text-xl font-heading font-bold text-white mb-1">
        Give Back — optional contribution
      </h2>
      <p className="text-slate-400 text-sm mb-6">
        Independent of your registration fee. Our batch is rallying behind NITCAA's flagship
        project — the new on-campus Health Centre.
      </p>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <MiniStep n={1} title="Transfer to NITCAA">
          Use the domestic (Indian) or FCRA (international) channel on the Give Back page. Quote
          the purpose <span className="text-gold-400">"REC 2001 Batch — Health Centre"</span>.
        </MiniStep>
        <MiniStep n={2} title="Submit your details">
          Fill the batch Google Form (circulated by the Finance Committee) OR email{' '}
          <span className="text-gold-400">{healthCentreProject.contactEmail}</span>. Include name,
          branch, phone, amount, txn ref, PAN (for 80G) or passport (NRI).
        </MiniStep>
        <MiniStep n={3} title="Receipt & recognition">
          NITCAA reconciles, issues 80G receipt on request (if eligible), sends a thank-you email.
          ₹1 lakh+ → Donor Wall at the new Health Centre.
        </MiniStep>
      </div>

      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-100/90 mb-10">
        <span className="font-semibold">80G eligibility:</span> {eightyGEligibilityNote}
      </div>

      <Link to="/give-back">
        <Button variant="ghost">Full Give Back details →</Button>
      </Link>

      {/* ─── Help ────────────────────────────────────────────────────── */}
      <GlassCard className="mt-12 border-white/10">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
            🙋
          </div>
          <div className="text-sm">
            <h4 className="text-white font-semibold mb-1">Need help with a payment?</h4>
            <p className="text-slate-400">
              If your payment doesn't get verified within 48 hours, or the amount / family count
              looks wrong, reach out to the Finance Committee on the volunteers WhatsApp group
              (Shyam / Mahroof) with your Registration ID and transaction reference. We'll sort
              it out.
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// ── local sub-components ────────────────────────────────────────────────
function Step({ n, done, active, title, body }) {
  return (
    <li>
      <GlassCard
        className={`transition ${
          done
            ? 'border-emerald-500/25 bg-emerald-500/[0.03]'
            : active
              ? 'border-gold-500/40 bg-gold-500/[0.04]'
              : 'border-white/5'
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
              done
                ? 'bg-emerald-500 text-navy-950'
                : active
                  ? 'bg-gold-500 text-navy-950'
                  : 'bg-white/10 text-slate-400'
            }`}
          >
            {done ? '✓' : n}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h3 className="text-white font-semibold">{title}</h3>
              {active && !done && <Badge variant="gold" size="sm">Current step</Badge>}
              {done && <Badge variant="success" size="sm">Done</Badge>}
            </div>
            {body}
          </div>
        </div>
      </GlassCard>
    </li>
  );
}

function MiniStep({ n, title, children }) {
  return (
    <GlassCard>
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-xs font-semibold text-gold-300 flex-shrink-0">
          {n}
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-1">{title}</h4>
          <p className="text-slate-400 text-sm leading-relaxed">{children}</p>
        </div>
      </div>
    </GlassCard>
  );
}
