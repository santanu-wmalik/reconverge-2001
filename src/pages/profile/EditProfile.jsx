import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { pageTransition } from '../../utils/animationVariants';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function EditProfile() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentCity: user?.currentCity || '', company: user?.company || '', designation: user?.designation || '', phone: user?.phone || '' });

  const handleSave = async () => {
    await updateProfile(form);
    showToast('Profile updated successfully!', 'success');
    navigate('/profile');
  };

  return (
    <motion.div {...pageTransition} className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-heading font-bold text-white mb-8">Edit Profile</h1>
      <GlassCard hover={false}>
        <div className="space-y-4">
          <Input label="Current City" value={form.currentCity} onChange={(e) => setForm({ ...form, currentCity: e.target.value })} />
          <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <Input label="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="flex gap-3 mt-6">
          <Button onClick={handleSave}>Save Changes</Button>
          <Button variant="ghost" onClick={() => navigate('/profile')}>Cancel</Button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
