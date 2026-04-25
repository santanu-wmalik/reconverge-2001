import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { pageTransition } from '../../utils/animationVariants';
import { BRANCHES, TSHIRT_SIZES, DIETARY_OPTIONS, TRAVEL_MODES, ROOM_PREFERENCES, ID_TYPES, EVENT_CONFIG } from '../../data/constants';
import { authApi } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import GlassCard from '../../components/ui/GlassCard';
import Stepper from '../../components/ui/Stepper';

const steps = ['Personal', 'Academic', 'Travel & Stay', 'Preferences', 'Payment', 'Review'];

function RequiredMark() {
  return <span className="text-red-400 ml-0.5" aria-hidden="true">*</span>;
}

export default function RegistrationPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    // Personal
    name: '', email: '', phone: '', password: '', currentCity: '', state: '', company: '', designation: '',
    // Academic
    branch: '', hostel: '', rollNumber: '',
    // Travel & Stay
    travelMode: '',
    arrivalDate: '2026-12-27', arrivalTime: '',
    departureDate: '2026-12-29', departureTime: '',
    roomPreference: '',
    preferredRoommate: '',
    // Preferences
    tshirtSize: '', dietaryPref: '',
    adults: 1,
    childrenUnder10: 0,
    children10Plus: 0,
    specialRequests: '',
    notes: '',
    // Payment
    paymentUid: '',
    idType: '', idNumber: '',
  });
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  // Registration fee: self (12500) + each additional family member (2500).
  // Family = extra adults + all children (both buckets).
  const familyCount = Math.max(0, (form.adults - 1) + form.childrenUnder10 + form.children10Plus);
  const registrationFee = EVENT_CONFIG.registrationFee + familyCount * EVENT_CONFIG.familyMemberFee;

  const handleSubmit = async () => {
    // Only email + password are required — every other field is optional per
    // the batch decision (use what people give us; follow up for specifics later).
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    if (!form.password || form.password.length < 6) {
      showToast('Please set a password (minimum 6 characters)', 'error');
      return;
    }
    setLoading(true);
    try {
      // Single-shot atomic registration. The server handles uniqueness, role
      // normalisation, registration-id allocation, and token issuance — so
      // the client never needs to read the alumni list or write a users row
      // directly. Credentials never travel back; we get a token + the new
      // user record.
      await authApi.register({
        ...form,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(form.name || form.email)}`,
        familyMembers: familyCount,
        registrationFee,
        paymentStatus: form.paymentUid ? 'pending-verification' : 'unpaid',
        groups: [],
      });
      // Re-use the standard login flow so AuthContext + token storage end up
      // in the same state as a normal sign-in. (Server is fine with this —
      // the previous registration token simply orphans and ages out on
      // restart.)
      await login(form.email, form.password);
      showToast('Registration successful! Welcome to the reunion!', 'success');
      navigate('/register/success');
    } catch (error) {
      console.error('Registration error:', error);
      const msg =
        error?.status === 409
          ? 'An account with this email already exists. Please sign in instead.'
          : error?.status === 400
          ? 'Please check the email and password and try again.'
          : 'Registration failed. Please try again.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div {...pageTransition} className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">Register for the Reunion</h1>
        <p className="text-slate-400">Join 340+ alumni for REConverge 2001 — Dec 27–29, 2026 at Calicut</p>
      </div>

      <p className="text-center text-xs text-slate-500 mb-8">
        Only <span className="text-white">Email</span> and <span className="text-white">Password</span> are required. Everything else is optional — fill what you can now and update later from your profile.
      </p>

      <div className="mb-8">
        <Stepper steps={steps} currentStep={step} />
      </div>

      <GlassCard hover={false}>
        {step === 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
            <Input label="Full Name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Enter your full name" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={<>Email<RequiredMark /></>}
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="your@email.com"
              />
              <Input label="Phone" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91-XXXXXXXXXX" />
            </div>
            <Input
              label={<>Password<RequiredMark /></>}
              type="password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              placeholder="Create a password (min 6 chars)"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Current City" value={form.currentCity} onChange={(e) => update('currentCity', e.target.value)} placeholder="e.g. Bangalore" />
              <Input label="State / Country" value={form.state} onChange={(e) => update('state', e.target.value)} placeholder="e.g. Karnataka · USA · Perth" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Company" value={form.company} onChange={(e) => update('company', e.target.value)} placeholder="Where you work" />
              <Input label="Designation" value={form.designation} onChange={(e) => update('designation', e.target.value)} placeholder="Your current role" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Academic Details</h3>
            <Select label="Branch / Department" value={form.branch} onChange={(e) => update('branch', e.target.value)} options={BRANCHES} placeholder="Select your branch" />
            <Input label="Hostel" value={form.hostel} onChange={(e) => update('hostel', e.target.value)} placeholder="e.g. D, E, F — or the block name you remember" />
            <Input label="Roll Number" value={form.rollNumber} onChange={(e) => update('rollNumber', e.target.value)} placeholder="e.g. CS-2001-042" />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Travel & Stay</h3>
            <Select label="Mode of Travel" value={form.travelMode} onChange={(e) => update('travelMode', e.target.value)} options={TRAVEL_MODES} placeholder="How will you travel?" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Arrival Date" type="date" value={form.arrivalDate} onChange={(e) => update('arrivalDate', e.target.value)} />
              <Input label="Arrival Time" type="time" value={form.arrivalTime} onChange={(e) => update('arrivalTime', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Departure Date" type="date" value={form.departureDate} onChange={(e) => update('departureDate', e.target.value)} />
              <Input label="Departure Time" type="time" value={form.departureTime} onChange={(e) => update('departureTime', e.target.value)} />
            </div>

            <div className="pt-4 border-t border-white/5">
              <p className="text-xs text-gold-400 uppercase tracking-wider font-semibold mb-3">Accommodation (Gokulam Grand)</p>
              <Select
                label="Room Preference"
                value={form.roomPreference}
                onChange={(e) => update('roomPreference', e.target.value)}
                options={ROOM_PREFERENCES}
                placeholder="Select room type / sharing"
              />
              <p className="text-xs text-slate-500 mt-1 mb-3">Accommodation is paid directly to the hotel, separate from the reunion fee.</p>
              <Input
                label="Preferred Roommate (optional)"
                value={form.preferredRoommate}
                onChange={(e) => update('preferredRoommate', e.target.value)}
                placeholder="Name of the batchmate you'd like to share with"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Family & Preferences</h3>
            <Select label="T-Shirt Size" value={form.tshirtSize} onChange={(e) => update('tshirtSize', e.target.value)} options={TSHIRT_SIZES} placeholder="Select size" />
            <Select label="Dietary Preference" value={form.dietaryPref} onChange={(e) => update('dietaryPref', e.target.value)} options={DIETARY_OPTIONS} placeholder="Select preference" />

            <div className="pt-4 border-t border-white/5">
              <p className="text-xs text-gold-400 uppercase tracking-wider font-semibold mb-3">Who's coming with you?</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Adults (incl. self)" type="number" min="1" max="6" value={form.adults} onFocus={(e) => e.target.select()} onChange={(e) => update('adults', Math.max(1, parseInt(e.target.value) || 1))} />
                <Input label="Children < 10" type="number" min="0" max="6" value={form.childrenUnder10} onFocus={(e) => e.target.select()} onChange={(e) => update('childrenUnder10', parseInt(e.target.value) || 0)} />
                <Input label="Children 10+" type="number" min="0" max="6" value={form.children10Plus} onFocus={(e) => e.target.select()} onChange={(e) => update('children10Plus', parseInt(e.target.value) || 0)} />
              </div>
              <p className="text-xs text-slate-500 mt-2">Per hotel policy, children 10+ count as extra persons in room billing.</p>
            </div>

            <div className="pt-4 border-t border-white/5">
              <p className="text-xs text-gold-400 uppercase tracking-wider font-semibold mb-3">Anything else we should know?</p>
              <label className="block mb-4">
                <span className="text-sm text-slate-300 mb-1 block">Special Requests</span>
                <textarea
                  value={form.specialRequests}
                  onChange={(e) => update('specialRequests', e.target.value)}
                  rows={3}
                  placeholder="Accessibility needs, allergies, a roommate ask, an ice-breaker memory you want us to keep handy…"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-400/40 resize-y"
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-300 mb-1 block">Notes (free text)</span>
                <textarea
                  value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  rows={2}
                  placeholder="Anything you want the organising team to note about your registration"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-400/40 resize-y"
                />
              </label>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Payment & ID</h3>

            <div className="bg-gold-500/5 border border-gold-500/20 rounded-xl p-4 mb-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-wider text-gold-400 font-semibold">Registration Fee</span>
                <span className="text-2xl font-bold text-gold-400">₹{registrationFee.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                ₹{EVENT_CONFIG.registrationFee.toLocaleString('en-IN')} self + ₹{EVENT_CONFIG.familyMemberFee.toLocaleString('en-IN')} × {familyCount} family member{familyCount === 1 ? '' : 's'}
              </p>
              <p className="text-xs text-slate-500 mt-1">Accommodation &amp; Giving Back are billed separately.</p>
            </div>

            <Input
              label="Payment UID (transaction / UPI ref)"
              value={form.paymentUid}
              onChange={(e) => update('paymentUid', e.target.value)}
              placeholder="Paste after bank / UPI transfer — or add later from your Profile"
            />
            <p className="text-xs text-slate-500 -mt-2">
              Payment goes direct to the reunion bank account (SWIFT / bank transfer — not through the website). You can register first and add the Payment UID later; status will stay "Unpaid" until the Finance Committee verifies.
            </p>

            <div className="pt-4 border-t border-white/5">
              <p className="text-xs text-gold-400 uppercase tracking-wider font-semibold mb-3">ID for hotel check-in (optional — collected nearer the event)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select label="ID Type" value={form.idType} onChange={(e) => update('idType', e.target.value)} options={ID_TYPES} placeholder="Select ID type" />
                <Input label="ID Number (last 4 digits)" value={form.idNumber} onChange={(e) => update('idNumber', e.target.value)} placeholder="Only the last 4 for our records" maxLength={4} />
              </div>
              <p className="text-xs text-slate-500 mt-2">Gokulam Grand requires ID proof from every guest at check-in. We only store the last 4 digits for rooming cross-reference.</p>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Review Your Details</h3>
            <div className="space-y-3 text-sm">
              {[
                ['Name', form.name || '-'],
                ['Email', form.email || '-'],
                ['Phone', form.phone || '-'],
                ['City', form.currentCity || '-'],
                ['State / Country', form.state || '-'],
                ['Branch', form.branch || '-'],
                ['Hostel', form.hostel || '-'],
                ['Travel', form.travelMode || '-'],
                ['Arrival', `${form.arrivalDate || '-'} ${form.arrivalTime || ''}`.trim()],
                ['Departure', `${form.departureDate || '-'} ${form.departureTime || ''}`.trim()],
                ['Room Preference', form.roomPreference || '-'],
                ['Preferred Roommate', form.preferredRoommate || '-'],
                ['T-Shirt', form.tshirtSize || '-'],
                ['Diet', form.dietaryPref || '-'],
                ['Party', `${form.adults} adult${form.adults === 1 ? '' : 's'}, ${form.childrenUnder10} child <10, ${form.children10Plus} child 10+`],
                ['Special Requests', form.specialRequests || '-'],
                ['Notes', form.notes || '-'],
                ['ID', form.idType ? `${form.idType} (…${form.idNumber || '----'})` : '-'],
                ['Payment UID', form.paymentUid || 'To be added later'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-white/5 gap-4">
                  <span className="text-slate-400 flex-shrink-0">{label}</span>
                  <span className="text-white font-medium text-right break-words">{value}</span>
                </div>
              ))}
              <div className="flex justify-between py-3 border-t border-gold-500/20 mt-4">
                <span className="text-gold-400 font-semibold">Registration Fee</span>
                <span className="text-gold-400 font-bold text-lg">₹{registrationFee.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-4 border-t border-white/10">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Back</Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}>Continue</Button>
          ) : (
            <Button loading={loading} onClick={handleSubmit}>Submit Registration</Button>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
