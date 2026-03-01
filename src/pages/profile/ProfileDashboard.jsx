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
      <h1 className="text-3xl font-heading font-bold text-white mb-8">My Profile</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <GlassCard className="md:col-span-1 text-center" hover={false}>
          <Avatar src={user?.avatar} name={user?.name} size="xl" className="mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
          <p className="text-gold-400 text-sm">Batch of {user?.batch}</p>
          <p className="text-slate-400 text-sm mt-1">{user?.designation}</p>
          <p className="text-slate-400 text-sm">{user?.company}</p>
          <Badge variant="gold" className="mt-3">Registered</Badge>
          <div className="mt-6 space-y-2">
            <Link to="/profile/edit"><Button variant="outline" size="sm" fullWidth>Edit Profile</Button></Link>
            <Link to="/profile/pass"><Button variant="ghost" size="sm" fullWidth>View Digital Pass</Button></Link>
          </div>
        </GlassCard>

        <div className="md:col-span-2 space-y-6">
          <GlassCard hover={false}>
            <h3 className="text-lg font-semibold text-white mb-4">Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Branch', user?.branch], ['Roll No', user?.rollNumber], ['Hostel', user?.hostel],
                ['City', user?.currentCity], ['Email', user?.email], ['Phone', user?.phone],
                ['T-Shirt', user?.tshirtSize], ['Diet', user?.dietaryPref],
                ['Travel', user?.travelMode], ['Arrival', `${user?.arrivalDate} ${user?.arrivalTime}`],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-slate-500 text-xs">{label}</p>
                  <p className="text-white">{value || '-'}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard hover={false}>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'My Itinerary', path: '/events/my-plan', icon: '📅' },
                { label: 'My Groups', path: '/groups', icon: '👥' },
                { label: 'Store', path: '/store', icon: '🛍️' },
                { label: 'Travel', path: '/travel', icon: '✈️' },
              ].map((link) => (
                <Link key={link.path} to={link.path} className="glass p-4 text-center hover:bg-white/10 transition-colors rounded-xl">
                  <div className="text-2xl mb-1">{link.icon}</div>
                  <p className="text-xs text-slate-300">{link.label}</p>
                </Link>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
