import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getSavedCredentials, saveCredentials, clearSavedCredentials } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { pageTransition } from '../../utils/animationVariants';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import GlassCard from '../../components/ui/GlassCard';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Load saved credentials from cookies on mount
  useEffect(() => {
    const saved = getSavedCredentials();
    if (saved) {
      setEmail(saved.email);
      setPassword(saved.password);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e?.preventDefault();

    if (!email.trim()) {
      showToast('Please enter your email address', 'error');
      return;
    }
    if (!password.trim()) {
      showToast('Please enter your password', 'error');
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);

    if (result.success) {
      // Save or clear cookies based on Remember Me
      if (rememberMe) {
        saveCredentials(email.trim(), password);
      } else {
        clearSavedCredentials();
      }
      showToast(`Welcome back, ${result.user.name}!`, 'success');
      navigate('/profile');
    } else {
      showToast(result.error || 'Login failed', 'error');
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <motion.div {...pageTransition} className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <GlassCard className="w-full max-w-md" hover={false}>
        <div className="text-center mb-8">
          <img src="https://storage.googleapis.com/reconverge-2001-uat-bucket/landing_page_pictures/Reconverge_2001_Logo.png" alt="REConverge 2001" className="w-16 h-16 mx-auto mb-4 object-contain" />
          <h1 className="text-2xl font-heading font-bold text-white">Welcome Back</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your alumni account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="your.email@example.com"
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your password"
            autoComplete="current-password"
          />

          {/* Remember Me */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-gold-400 focus:ring-gold-400/30 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-slate-400">Remember me</span>
          </label>

          <Button fullWidth loading={loading} type="submit">
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-slate-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold-400 hover:text-gold-300 font-medium">
              Register Now
            </Link>
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}
