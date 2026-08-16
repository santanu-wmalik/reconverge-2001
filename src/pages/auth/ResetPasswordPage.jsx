import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { pageTransition } from '../../utils/animationVariants';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import GlassCard from '../../components/ui/GlassCard';

const MIN_LEN = 6;

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = useMemo(() => params.get('token') || '', [params]);
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!token) {
      showToast('Missing reset token. Use the link from your email.', 'error');
      return;
    }
    if (newPassword.length < MIN_LEN) {
      showToast(`Password must be at least ${MIN_LEN} characters`, 'error');
      return;
    }
    if (newPassword !== confirm) {
      showToast("Passwords don't match", 'error');
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword(token, newPassword);
      setDone(true);
      showToast('Password updated. Please sign in with your new password.', 'success');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      showToast(err.message || 'Could not reset password. The link may have expired.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div {...pageTransition} className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <GlassCard className="w-full max-w-md" hover={false}>
        <div className="text-center mb-8">
          <img
            src="https://storage.googleapis.com/reconverge-2001-uat-bucket/landing_page_pictures/Reconverge_2001_Logo.png"
            alt="REConverge 2001"
            className="w-16 h-16 mx-auto mb-4 object-contain"
          />
          <h1 className="text-2xl font-heading font-bold text-white">Set a new password</h1>
          <p className="text-slate-400 text-sm mt-1">
            Choose a strong password you don't use elsewhere.
          </p>
        </div>

        {!token ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              This reset link is missing its token. Please open the link from your email
              exactly, or request a new one.
            </div>
            <Link to="/forgot-password" className="block">
              <Button fullWidth>Request a new link</Button>
            </Link>
          </div>
        ) : done ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              Password updated. Redirecting you to sign in…
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={`At least ${MIN_LEN} characters`}
              autoComplete="new-password"
              autoFocus
            />
            <Input
              label="Confirm new password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter new password"
              autoComplete="new-password"
            />
            <Button fullWidth loading={loading} type="submit">
              Update password
            </Button>
            <div className="text-center">
              <Link to="/login" className="text-sm text-gold-400 hover:text-gold-300 font-medium">
                ← Back to sign in
              </Link>
            </div>
          </form>
        )}
      </GlassCard>
    </motion.div>
  );
}
