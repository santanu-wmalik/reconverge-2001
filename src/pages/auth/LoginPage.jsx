import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { pageTransition } from '../../utils/animationVariants';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import GlassCard from '../../components/ui/GlassCard';

export default function LoginPage() {
  const [email, setEmail] = useState('rajesh.kumar@email.com');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (role = 'alumni') => {
    if (!email.trim()) {
      showToast('Please enter your email address', 'error');
      return;
    }
    setLoading(true);
    const result = await login(email, role);
    if (result.success) {
      showToast('Welcome back! Logged in successfully.', 'success');
      navigate('/profile');
    } else {
      showToast(result.error || 'Login failed', 'error');
    }
    setLoading(false);
  };

  return (
    <motion.div {...pageTransition} className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <GlassCard className="w-full max-w-md" hover={false}>
        <div className="text-center mb-8">
          <img src="https://storage.googleapis.com/reconverge-2001-uat-bucket/landing_page_pictures/Reconverge_2001_Logo.png" alt="REConverge 2001" className="w-16 h-16 mx-auto mb-4 object-contain" />
          <h1 className="text-2xl font-heading font-bold text-white">Welcome Back</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your alumni account</p>
        </div>

        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          <Button fullWidth loading={loading} onClick={() => handleLogin('alumni')}>
            Sign In as Alumni
          </Button>

          <Button fullWidth variant="secondary" loading={loading} onClick={() => handleLogin('admin')}>
            Sign In as Admin
          </Button>
        </div>

        <div className="mt-6 text-center space-y-2">
          <p className="text-slate-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold-400 hover:text-gold-300 font-medium">
              Register Now
            </Link>
          </p>
          <p className="text-slate-500 text-xs">
            Demo: Pre-filled credentials, just click Sign In
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}
