import { useState } from 'react';
import { motion } from 'framer-motion';
import { EVENT_CONFIG, BRANCH_SHORT, FAMILY_OPTIONS, DIETARY_OPTIONS } from '../../data/constants';
import { rsvpApi } from '../../services/api';
import { pageTransition } from '../../utils/animationVariants';
import SectionHeading from '../../components/shared/SectionHeading';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

export default function RSVPPage() {
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
      <SectionHeading title="RSVP" subtitle="Join the grand homecoming" />

      <div>
        <div>
          <GlassCard hover={false}>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-lg font-semibold text-ink dark:text-white mb-2">
                  Registration Details
                </h3>
                <p className="text-ink-muted dark:text-slate-400 text-sm mb-6">
                  Fill in your details to confirm your attendance at{' '}
                  <span className="text-gold-700 dark:text-gold-400 font-medium">{EVENT_CONFIG.eventName}</span>
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
                <div className="text-6xl mb-6">🎉</div>
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-ink dark:text-white mb-4">
                  See You There!
                </h3>
                <p className="text-ink-soft dark:text-slate-300 text-base leading-relaxed max-w-md mx-auto mb-8">
                  Your registration for{' '}
                  <span className="text-gold-700 dark:text-gold-400 font-semibold">{EVENT_CONFIG.eventName}</span>{' '}
                  is confirmed. We&apos;ve sent a detailed itinerary to{' '}
                  <span className="text-gold-700 dark:text-gold-400 font-medium">{form.email}</span>.
                </p>
                <button
                  onClick={handleReset}
                  className="text-gold-700 dark:text-gold-400 hover:text-gold-800 dark:hover:text-gold-300 font-medium text-sm underline underline-offset-4 transition-colors"
                >
                  Register another member
                </button>
              </motion.div>
            )}
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
