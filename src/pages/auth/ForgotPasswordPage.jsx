import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { pageTransition } from '../../utils/animationVariants';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import GlassCard from '../../components/ui/GlassCard';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      showToast('Please enter your email address', 'error');
      return;
    }
    setLoading(true);
    try {
      await authApi.forgotPassword(trimmed);
      setSent(true);
    } catch (err) {
      showToast(err.message || 'Something went wrong. Please try again.', 'error');
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
          <h1 className="text-2xl font-heading font-bold text-white">Forgot Password</h1>
          <p className="text-slate-400 text-sm mt-1">
            We'll email you a link to set a new password.
          </p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              If an account exists for <span className="font-semibold">{email.trim()}</span>,
              we've sent a reset link. Check your inbox (and spam folder). The link expires in
              30 minutes.
            </div>
            <p className="text-slate-400 text-sm text-center">
              Didn't get anything after a few minutes? Double-check the email address and try
              again.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="ghost"
                fullWidth
                className="whitespace-nowrap"
                onClick={() => { setSent(false); setEmail(''); }}
              >
                Try another email
              </Button>
              <Link to="/login" className="sm:flex-1">
                <Button fullWidth className="whitespace-nowrap">Back to sign in</Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              autoComplete="email"
              autoFocus
            />
            <Button fullWidth loading={loading} type="submit">
              Send reset link
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
