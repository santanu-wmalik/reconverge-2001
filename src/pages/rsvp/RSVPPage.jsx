import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EVENT_CONFIG, BRANCHES, BRANCH_SHORT, FAMILY_OPTIONS, DIETARY_OPTIONS } from '../../data/constants';
import { rsvpApi } from '../../services/api';
import { pageTransition } from '../../utils/animationVariants';
import SectionHeading from '../../components/shared/SectionHeading';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

// The three engagement tiers, used to show visitors where this form actually
// gets them (the bottom rung) — and to push toward Sign Up + payment.
function TierLadder() {
  const tiers = [
    { label: 'Shown Interest', note: 'this form — no seat held', here: true },
    { label: 'Signed Up', note: 'account created' },
    { label: 'Paid & Attending', note: 'seat secured 🎉' },
  ];
  return (
    <div className="mb-6">
      <ol className="flex items-stretch gap-2">
        {tiers.map((t, i) => (
          <li key={t.label} className={`flex-1 rounded-xl border px-3 py-2.5 text-center ${
            t.here ? 'border-amber-400 bg-amber-50' : 'border-forest-500/15 bg-white'
          }`}>
            <p className={`text-[11px] sm:text-xs font-semibold uppercase tracking-wider ${t.here ? 'text-amber-800' : 'text-forest-700'}`}>
              {i + 1}. {t.label}
            </p>
            <p className="text-[10px] sm:text-[11px] text-ink-muted mt-0.5">{t.note}</p>
          </li>
        ))}
      </ol>
      <p className="text-center text-xs text-amber-800 mt-2">
        ▲ You are here with this form — only <b>Sign Up + payment</b> secures your seat.
      </p>
    </div>
  );
}

// RSVP branch is stored as the short code; registration uses the full name.
const fullBranchOf = (shortCode) => BRANCHES[BRANCH_SHORT.indexOf(shortCode)] || '';

export default function RSVPPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    branch: '',
    familyJoining: '',
    foodPreference: 'Veg',
    volunteer: false,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await rsvpApi.create({
        ...form,
        submittedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('RSVP submission failed:', error);
      // Still show success for offline resilience
    }
    setLoading(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm({
      fullName: '',
      email: '',
      branch: '',
      familyJoining: '',
      foodPreference: 'Veg',
      volunteer: false,
    });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <motion.div {...pageTransition} className="max-w-3xl mx-auto px-4 py-12">
      <SectionHeading title="Show Interest" subtitle="Join the grand homecoming" />

      <TierLadder />

      {/* Primary path: full sign-up */}
      <div className="mb-6 rounded-2xl border-2 border-gold-500/60 bg-[#fbf7ea] px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-ink font-semibold">Ready to commit? Sign up now.</p>
          <p className="text-sm text-ink-soft">
            Early bird <span className="line-through text-ink-muted">₹{EVENT_CONFIG.standardFee.toLocaleString('en-IN')}</span>{' '}
            <b>₹{EVENT_CONFIG.registrationFee.toLocaleString('en-IN')}</b> — ends 30 September.
          </p>
        </div>
        <Link to="/register" className="nav-caps shrink-0 px-5 py-3 bg-gradient-to-b from-gold-400 to-gold-600 text-forest-900 shadow hover:from-gold-300 hover:to-gold-500">
          Sign Up →
        </Link>
      </div>

      <div>
        <div>
          <GlassCard hover={false}>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-lg font-semibold text-ink dark:text-white mb-2">
                  Not sure yet? Leave your interest
                </h3>
                <p className="text-ink-muted dark:text-slate-400 text-sm mb-6">
                  We'll keep you in the loop about{' '}
                  <span className="text-gold-700 dark:text-gold-400 font-medium">{EVENT_CONFIG.eventName}</span> —
                  but note this does <b>not</b> hold a seat or the early-bird price.
                </p>

                {/* Full Name */}
                <Input
                  label="Full Name"
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  error={errors.fullName}
                  required
                />

                {/* Email Address */}
                <Input
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="your@email.com"
                  error={errors.email}
                  required
                />

                {/* Branch and Family - side by side on wider screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Branch"
                    value={form.branch}
                    onChange={(e) => update('branch', e.target.value)}
                    options={BRANCH_SHORT}
                    placeholder="Select your branch"
                  />
                  <Select
                    label="Family Joining"
                    value={form.familyJoining}
                    onChange={(e) => update('familyJoining', e.target.value)}
                    options={FAMILY_OPTIONS}
                    placeholder="Select family option"
                  />
                </div>

                {/* Food Preference - Button Group */}
                <div>
                  <label className="block text-sm font-medium text-ink-soft dark:text-slate-300 mb-2">
                    Food Preference
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {DIETARY_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => update('foodPreference', option)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                          form.foodPreference === option
                            ? 'bg-gold-500 text-primary-900 border-gold-500 shadow-lg shadow-gold-500/20'
                            : 'bg-white dark:bg-white/5 text-ink-soft dark:text-slate-300 border-forest-500/15 dark:border-white/10 hover:bg-forest-600/8 dark:hover:bg-white/10 hover:border-forest-500/40 dark:hover:border-white/20'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Volunteer Checkbox */}
                <label className="flex items-start gap-3 text-sm text-ink-soft dark:text-slate-300 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.volunteer}
                    onChange={(e) => update('volunteer', e.target.checked)}
                    className="mt-0.5 rounded bg-white dark:bg-white/10 border-forest-500/15 dark:border-white/20 text-gold-500 focus:ring-gold-400/30"
                  />
                  <span className="group-hover:text-ink dark:group-hover:text-white transition-colors">
                    I&apos;m willing to volunteer for organizing sessions!
                  </span>
                </label>

                {/* Submit Button */}
                <div className="pt-4 border-t border-forest-500/15 dark:border-white/10">
                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    loading={loading}
                  >
                    Confirm Attendance
                  </Button>
                </div>
              </form>
            ) : (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="text-center py-8"
              >
                <div className="text-6xl mb-6">🙌</div>
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-ink dark:text-white mb-4">
                  Interest noted — now secure your seat
                </h3>
                <p className="text-ink-soft dark:text-slate-300 text-base leading-relaxed max-w-md mx-auto mb-5">
                  Thanks, <span className="text-gold-700 dark:text-gold-400 font-medium">{form.fullName.trim() || 'batchmate'}</span>!
                  Showing interest doesn&apos;t hold a seat — only <b>Sign Up + payment</b> makes you{' '}
                  <i>Paid &amp; Attending</i>.
                </p>
                <div className="max-w-md mx-auto rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 mb-6 text-sm text-amber-900 text-left">
                  ⏰ Early bird{' '}
                  <span className="line-through opacity-60">₹{EVENT_CONFIG.standardFee.toLocaleString('en-IN')}</span>{' '}
                  <b>₹{EVENT_CONFIG.registrationFee.toLocaleString('en-IN')}</b> ends <b>30 September</b> — after that
                  it&apos;s ₹{EVENT_CONFIG.standardFee.toLocaleString('en-IN')} for everyone.
                </div>
                <Button
                  size="lg"
                  onClick={() =>
                    navigate('/register', {
                      state: {
                        prefill: {
                          name: form.fullName.trim(),
                          email: form.email.trim(),
                          branch: fullBranchOf(form.branch),
                        },
                      },
                    })
                  }
                >
                  Sign Up now — ₹{EVENT_CONFIG.registrationFee.toLocaleString('en-IN')} →
                </Button>
                <p className="text-xs text-ink-muted mt-3 mb-6">Your name, email and branch carry over — no retyping.</p>
                <button
                  onClick={handleReset}
                  className="text-gold-700 dark:text-gold-400 hover:text-gold-800 dark:hover:text-gold-300 font-medium text-sm underline underline-offset-4 transition-colors"
                >
                  Show interest for another batchmate
                </button>
              </motion.div>
            )}
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
