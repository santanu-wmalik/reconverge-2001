import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { pageTransition } from '../../utils/animationVariants';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';

export default function ProfileDashboard() {
  const { user } = useAuth();

  return (
    <motion.div {...pageTransition}>
      <h1 className="text-3xl font-heading font-bold text-ink mb-8">My Profile</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <GlassCard className="md:col-span-1 text-center" hover={false}>
          <Avatar src={user?.avatar} name={user?.name} size="xl" className="mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-ink">{user?.name}</h2>
          <p className="text-gold-700 text-sm">Batch of {user?.batch}</p>
          <p className="text-ink-soft text-sm mt-1">{user?.designation}</p>
          <p className="text-ink-soft text-sm">{user?.company}</p>
          <Badge variant="gold" className="mt-3">Registered</Badge>
          <div className="mt-6 space-y-2">
            <Link to="/profile/edit"><Button variant="outline" size="sm" fullWidth>Edit Profile</Button></Link>
          </div>
        </GlassCard>

        <div className="md:col-span-2 space-y-6">
          <GlassCard hover={false}>
            <h3 className="text-lg font-semibold text-ink mb-4">Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Branch', user?.branch], ['Roll No', user?.rollNumber], ['Hostel', user?.hostel],
                ['City', user?.currentCity], ['Email', user?.email], ['Phone', user?.phone],
                ['T-Shirt', user?.tshirtSize], ['Diet', user?.dietaryPref],
                ['Travel', user?.travelMode], ['Arrival', `${user?.arrivalDate} ${user?.arrivalTime}`],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-ink-muted text-xs">{label}</p>
                  <p className="text-ink">{value || '-'}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard hover={false}>
            <h3 className="text-lg font-semibold text-ink mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'My Events', path: '/events/my-plan', icon: '📅' },
                { label: 'My Groups', path: '/groups', icon: '👥' },
                { label: 'Store', path: '/store', icon: '🛍️' },
                { label: 'Travel', path: '/travel', icon: '✈️' },
              ].map((link) => (
                <Link key={link.path} to={link.path} className="glass p-4 text-center hover:bg-forest-600/8 transition-colors rounded-xl">
                  <div className="text-2xl mb-1">{link.icon}</div>
                  <p className="text-xs text-ink-soft">{link.label}</p>
                </Link>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
