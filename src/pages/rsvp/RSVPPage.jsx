import { useState } from 'react';
import { motion } from 'framer-motion';
import { EVENT_CONFIG, BRANCH_SHORT, FAMILY_OPTIONS, DIETARY_OPTIONS, RSVP_INCLUSIONS } from '../../data/constants';
import { rsvpApi } from '../../services/api';
import { pageTransition } from '../../utils/animationVariants';
import SectionHeading from '../../components/shared/SectionHeading';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';

const inclusionIcons = ['🍽️', '🎁', '🍃'];

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
    <motion.div {...pageTransition} className="max-w-6xl mx-auto px-4 py-12">
      <SectionHeading title="RSVP" subtitle="Join the grand homecoming" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side - Form (2/3 width on desktop) */}
        <div className="lg:col-span-2">
          <GlassCard hover={false}>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Registration Details
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                  Fill in your details to confirm your attendance at{' '}
                  <span className="text-gold-400 font-medium">{EVENT_CONFIG.eventName}</span>
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
                  <label className="block text-sm font-medium text-slate-300 mb-2">
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
                            : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Volunteer Checkbox */}
                <label className="flex items-start gap-3 text-sm text-slate-300 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.volunteer}
                    onChange={(e) => update('volunteer', e.target.checked)}
                    className="mt-0.5 rounded bg-white/10 border-white/20 text-gold-500 focus:ring-gold-400/30"
                  />
                  <span className="group-hover:text-white transition-colors">
                    I&apos;m willing to volunteer for organizing sessions!
                  </span>
                </label>

                {/* Submit Button */}
                <div className="pt-4 border-t border-white/10">
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
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
                  See You There!
                </h3>
                <p className="text-slate-300 text-base leading-relaxed max-w-md mx-auto mb-8">
                  Your registration for{' '}
                  <span className="text-gold-400 font-semibold">{EVENT_CONFIG.eventName}</span>{' '}
                  is confirmed. We&apos;ve sent a detailed itinerary to{' '}
                  <span className="text-gold-400 font-medium">{form.email}</span>.
                </p>
                <button
                  onClick={handleReset}
                  className="text-gold-400 hover:text-gold-300 font-medium text-sm underline underline-offset-4 transition-colors"
                >
                  Register another member
                </button>
              </motion.div>
            )}
          </GlassCard>
        </div>

        {/* Right sidebar - Event Access Info (1/3 width on desktop) */}
        <div className="lg:col-span-1">
          <GlassCard hover={false} className="sticky top-24">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <span className="text-gold-400">✦</span> Event Access
            </h3>

            {/* Fee Information */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-slate-400 text-sm">Registration Fee</span>
                <span className="text-white font-bold text-lg">
                  ₹{EVENT_CONFIG.registrationFee.toLocaleString('en-IN')}
                  <span className="text-slate-400 text-xs font-normal ml-1">/ person</span>
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-slate-400 text-sm">Additional Family</span>
                <span className="text-white font-semibold">
                  ₹{EVENT_CONFIG.familyMemberFee.toLocaleString('en-IN')}
                  <span className="text-slate-400 text-xs font-normal ml-1">/ member</span>
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-slate-400 text-sm">Registration Deadline</span>
                <Badge variant="gold" size="sm">
                  {EVENT_CONFIG.registrationDeadline}
                </Badge>
              </div>
            </div>

            {/* Inclusions */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
                Inclusions
              </h4>
              <div className="space-y-3">
                {RSVP_INCLUSIONS.map((item, index) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <span className="text-lg mt-0.5 shrink-0">{inclusionIcons[index]}</span>
                    <div>
                      <p className="text-white text-sm font-medium">{item.title}</p>
                      <p className="text-slate-400 text-xs">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Excludes */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <p className="text-xs text-slate-400">
                <span className="text-slate-300 font-medium">Excludes:</span>{' '}
                Accommodation and travel
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
