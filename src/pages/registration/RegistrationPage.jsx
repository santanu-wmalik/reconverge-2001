import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { pageTransition } from '../../utils/animationVariants';
import { BRANCHES, HOSTELS, TSHIRT_SIZES, DIETARY_OPTIONS, TRAVEL_MODES } from '../../data/constants';
import { alumniApi } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import GlassCard from '../../components/ui/GlassCard';
import Stepper from '../../components/ui/Stepper';

const steps = ['Personal Info', 'Academic', 'Travel', 'Preferences', 'Review'];

export default function RegistrationPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', currentCity: '', company: '', designation: '',
    branch: '', hostel: '', rollNumber: '',
    travelMode: '', arrivalDate: '', arrivalTime: '', needsAccommodation: false,
    tshirtSize: '', dietaryPref: '', familyMembers: 0,
  });
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const allAlumni = await alumniApi.getAll();
      const newAlumni = {
        ...form,
        batch: 2001,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(form.name)}`,
        registrationId: `SJ-2026-${String(allAlumni.length + 1).padStart(4, '0')}`,
        isRegistered: true,
        groups: [],
        role: 'alumni',
        createdAt: new Date().toISOString(),
      };
      const created = await alumniApi.create(newAlumni);
      await login(created.email, 'alumni');
      showToast('Registration successful! Welcome to the reunion!', 'success');
      navigate('/register/success');
    } catch (error) {
      console.error('Registration error:', error);
      showToast('Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div {...pageTransition} className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">Register for the Reunion</h1>
        <p className="text-slate-400">Join 340+ alumni for the Silver Jubilee meet</p>
      </div>

      <div className="mb-8">
        <Stepper steps={steps} currentStep={step} />
      </div>

      <GlassCard hover={false}>
        {step === 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
            <Input label="Full Name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Enter your full name" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="your@email.com" />
              <Input label="Phone" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91-XXXXXXXXXX" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Current City" value={form.currentCity} onChange={(e) => update('currentCity', e.target.value)} placeholder="e.g. Bangalore" />
              <Input label="Company" value={form.company} onChange={(e) => update('company', e.target.value)} placeholder="Where you work" />
            </div>
            <Input label="Designation" value={form.designation} onChange={(e) => update('designation', e.target.value)} placeholder="Your current role" />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Academic Details</h3>
            <Select label="Branch / Department" value={form.branch} onChange={(e) => update('branch', e.target.value)} options={BRANCHES} placeholder="Select your branch" />
            <Select label="Hostel" value={form.hostel} onChange={(e) => update('hostel', e.target.value)} options={HOSTELS} placeholder="Select your hostel" />
            <Input label="Roll Number" value={form.rollNumber} onChange={(e) => update('rollNumber', e.target.value)} placeholder="e.g. CS-2001-042" />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Travel Plans</h3>
            <Select label="Mode of Travel" value={form.travelMode} onChange={(e) => update('travelMode', e.target.value)} options={TRAVEL_MODES} placeholder="How will you travel?" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Arrival Date" type="date" value={form.arrivalDate} onChange={(e) => update('arrivalDate', e.target.value)} />
              <Input label="Arrival Time" type="time" value={form.arrivalTime} onChange={(e) => update('arrivalTime', e.target.value)} />
            </div>
            <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer">
              <input type="checkbox" checked={form.needsAccommodation} onChange={(e) => update('needsAccommodation', e.target.checked)} className="rounded bg-white/10 border-white/20" />
              I need accommodation on campus
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
            <Select label="T-Shirt Size" value={form.tshirtSize} onChange={(e) => update('tshirtSize', e.target.value)} options={TSHIRT_SIZES} placeholder="Select size" />
            <Select label="Dietary Preference" value={form.dietaryPref} onChange={(e) => update('dietaryPref', e.target.value)} options={DIETARY_OPTIONS} placeholder="Select preference" />
            <Input label="Number of Family Members" type="number" min="0" max="5" value={form.familyMembers} onChange={(e) => update('familyMembers', parseInt(e.target.value) || 0)} />
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Review Your Details</h3>
            <div className="space-y-3 text-sm">
              {[
                ['Name', form.name || '-'], ['Email', form.email || '-'], ['Phone', form.phone || '-'],
                ['City', form.currentCity || '-'], ['Company', form.company || '-'],
                ['Branch', form.branch || '-'], ['Hostel', form.hostel || '-'],
                ['Travel', form.travelMode || '-'], ['Arrival', `${form.arrivalDate || '-'} ${form.arrivalTime || ''}`],
                ['T-Shirt', form.tshirtSize || '-'], ['Diet', form.dietaryPref || '-'],
                ['Family', form.familyMembers.toString()],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">{label}</span>
                  <span className="text-white font-medium">{value}</span>
                </div>
              ))}
              <div className="flex justify-between py-3 border-t border-gold-500/20 mt-4">
                <span className="text-gold-400 font-semibold">Total Fee</span>
                <span className="text-gold-400 font-bold text-lg">₹{2500 + form.familyMembers * 1000}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-4 border-t border-white/10">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Back</Button>
          {step < 4 ? (
            <Button onClick={() => setStep((s) => Math.min(4, s + 1))}>Continue</Button>
          ) : (
            <Button loading={loading} onClick={handleSubmit}>Pay & Register</Button>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
