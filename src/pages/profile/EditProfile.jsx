import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { pageTransition } from '../../utils/animationVariants';
import {
  BRANCHES,
  TSHIRT_SIZES,
  DIETARY_OPTIONS,
  TRAVEL_MODES,
  ROOM_PREFERENCES,
  ID_TYPES,
} from '../../data/constants';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

// Every field the registration form collects, mirrored here so alumni can
// fill-in / correct anything after signing up. Email is intentionally
// read-only — it's the auth identity and changing it would desync the
// matching `users` row.

function dicebearUrl(seed) {
  const safeSeed = (seed || 'alumni').trim() || 'alumni';
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(safeSeed)}`;
}

export default function EditProfile() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    // Avatar & identity
    avatar: user?.avatar || '',
    name: user?.name || '',
    phone: user?.phone || '',
    currentCity: user?.currentCity || '',
    state: user?.state || '',
    company: user?.company || '',
    designation: user?.designation || '',
    // Academic
    branch: user?.branch || '',
    hostel: user?.hostel || '',
    rollNumber: user?.rollNumber || '',
    // Travel & Stay
    travelMode: user?.travelMode || '',
    arrivalDate: user?.arrivalDate || '',
    arrivalTime: user?.arrivalTime || '',
    departureDate: user?.departureDate || '',
    departureTime: user?.departureTime || '',
    roomPreference: user?.roomPreference || '',
    preferredRoommate: user?.preferredRoommate || '',
    // Preferences
    tshirtSize: user?.tshirtSize || '',
    dietaryPref: user?.dietaryPref || '',
    adults: user?.adults ?? 1,
    childrenUnder10: user?.childrenUnder10 ?? 0,
    children10Plus: user?.children10Plus ?? 0,
    specialRequests: user?.specialRequests || '',
    notes: user?.notes || '',
    // Payment & ID
    paymentUid: user?.paymentUid || '',
    idType: user?.idType || '',
    idNumber: user?.idNumber || '',
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleRandomAvatar = () => {
    // Regenerate against a fresh seed — lets users cycle until they like one.
    update('avatar', dicebearUrl(`${form.name || user?.email || 'alumni'}-${Date.now()}`));
  };

  const handleResetAvatar = () => {
    update('avatar', dicebearUrl(form.name || user?.email));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // familyMembers is derived from the adult/children counts — keep it
      // in sync so the rooming & billing calculations stay correct.
      const familyMembers = Math.max(
        0,
        (Number(form.adults) - 1) + Number(form.childrenUnder10) + Number(form.children10Plus)
      );
      await updateProfile({ ...form, familyMembers });
      showToast('Profile updated successfully!', 'success');
      navigate('/profile');
    } catch (err) {
      console.error('Profile update failed:', err);
      showToast('Could not save profile. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const Section = ({ title, children }) => (
    <div className="pt-6 mt-6 border-t border-white/5 first:pt-0 first:mt-0 first:border-0">
      <p className="text-xs text-gold-400 uppercase tracking-wider font-semibold mb-4">{title}</p>
      <div className="space-y-4">{children}</div>
    </div>
  );

  return (
    <motion.div {...pageTransition} className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold text-white mb-8">Edit Profile</h1>

      <GlassCard hover={false}>
        {/* Avatar */}
        <Section title="Avatar">
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            <img
              src={form.avatar || dicebearUrl(form.name || user?.email)}
              alt="avatar preview"
              className="w-24 h-24 rounded-full border border-white/10 bg-white/5 object-cover"
              onError={(e) => {
                e.currentTarget.src = dicebearUrl(form.name || user?.email);
              }}
            />
            <div className="flex-1 w-full">
              <Input
                label="Avatar URL"
                value={form.avatar}
                onChange={(e) => update('avatar', e.target.value)}
                placeholder="Paste any image URL, or use the buttons below"
              />
              <div className="flex gap-2 mt-3">
                <Button variant="ghost" onClick={handleRandomAvatar} type="button">
                  Randomise
                </Button>
                <Button variant="ghost" onClick={handleResetAvatar} type="button">
                  Reset to default
                </Button>
              </div>
            </div>
          </div>
        </Section>

        {/* Personal */}
        <Section title="Personal Information">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email (read-only)"
              value={user?.email || ''}
              readOnly
              disabled
            />
            <Input
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="+91-XXXXXXXXXX"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Current City"
              value={form.currentCity}
              onChange={(e) => update('currentCity', e.target.value)}
            />
            <Input
              label="State / Country"
              value={form.state}
              onChange={(e) => update('state', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company"
              value={form.company}
              onChange={(e) => update('company', e.target.value)}
            />
            <Input
              label="Designation"
              value={form.designation}
              onChange={(e) => update('designation', e.target.value)}
            />
          </div>
        </Section>

        {/* Academic */}
        <Section title="Academic Details">
          <Select
            label="Branch / Department"
            value={form.branch}
            onChange={(e) => update('branch', e.target.value)}
            options={BRANCHES}
            placeholder="Select your branch"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Hostel"
              value={form.hostel}
              onChange={(e) => update('hostel', e.target.value)}
              placeholder="e.g. D, E, F"
            />
            <Input
              label="Roll Number"
              value={form.rollNumber}
              onChange={(e) => update('rollNumber', e.target.value)}
              placeholder="e.g. CS-2001-042"
            />
          </div>
        </Section>

        {/* Travel & Stay */}
        <Section title="Travel & Stay">
          <Select
            label="Mode of Travel"
            value={form.travelMode}
            onChange={(e) => update('travelMode', e.target.value)}
            options={TRAVEL_MODES}
            placeholder="How will you travel?"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Arrival Date" type="date" value={form.arrivalDate} onChange={(e) => update('arrivalDate', e.target.value)} />
            <Input label="Arrival Time" type="time" value={form.arrivalTime} onChange={(e) => update('arrivalTime', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Departure Date" type="date" value={form.departureDate} onChange={(e) => update('departureDate', e.target.value)} />
            <Input label="Departure Time" type="time" value={form.departureTime} onChange={(e) => update('departureTime', e.target.value)} />
          </div>
          <Select
            label="Room Preference"
            value={form.roomPreference}
            onChange={(e) => update('roomPreference', e.target.value)}
            options={ROOM_PREFERENCES}
            placeholder="Select room type / sharing"
          />
          <Input
            label="Preferred Roommate"
            value={form.preferredRoommate}
            onChange={(e) => update('preferredRoommate', e.target.value)}
            placeholder="Name of the batchmate you'd like to share with"
          />
        </Section>

        {/* Preferences */}
        <Section title="Family & Preferences">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="T-Shirt Size"
              value={form.tshirtSize}
              onChange={(e) => update('tshirtSize', e.target.value)}
              options={TSHIRT_SIZES}
              placeholder="Select size"
            />
            <Select
              label="Dietary Preference"
              value={form.dietaryPref}
              onChange={(e) => update('dietaryPref', e.target.value)}
              options={DIETARY_OPTIONS}
              placeholder="Select preference"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Adults (incl. self)"
              type="number"
              min="1"
              max="6"
              value={form.adults}
              onChange={(e) => update('adults', Math.max(1, parseInt(e.target.value) || 1))}
            />
            <Input
              label="Children < 10"
              type="number"
              min="0"
              max="6"
              value={form.childrenUnder10}
              onChange={(e) => update('childrenUnder10', parseInt(e.target.value) || 0)}
            />
            <Input
              label="Children 10+"
              type="number"
              min="0"
              max="6"
              value={form.children10Plus}
              onChange={(e) => update('children10Plus', parseInt(e.target.value) || 0)}
            />
          </div>
          <label className="block">
            <span className="text-sm text-slate-300 mb-1 block">Special Requests</span>
            <textarea
              value={form.specialRequests}
              onChange={(e) => update('specialRequests', e.target.value)}
              rows={3}
              placeholder="Accessibility needs, allergies, a roommate ask…"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-400/40 resize-y"
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300 mb-1 block">Notes</span>
            <textarea
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              rows={2}
              placeholder="Anything you want the organising team to note"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-400/40 resize-y"
            />
          </label>
        </Section>

        {/* Payment & ID */}
        <Section title="Payment & ID">
          <Input
            label="Payment UID (transaction / UPI ref)"
            value={form.paymentUid}
            onChange={(e) => update('paymentUid', e.target.value)}
            placeholder="Paste after bank / UPI transfer"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="ID Type"
              value={form.idType}
              onChange={(e) => update('idType', e.target.value)}
              options={ID_TYPES}
              placeholder="Select ID type"
            />
            <Input
              label="ID Number (last 4 digits)"
              value={form.idNumber}
              onChange={(e) => update('idNumber', e.target.value)}
              placeholder="Only the last 4"
              maxLength={4}
            />
          </div>
        </Section>

        <div className="flex gap-3 mt-8 pt-4 border-t border-white/10">
          <Button onClick={handleSave} loading={saving}>Save Changes</Button>
          <Button variant="ghost" onClick={() => navigate('/profile')}>Cancel</Button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
