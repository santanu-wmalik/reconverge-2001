import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { groups } from '../../data/groups';
import { alumniProfiles } from '../../data/alumni';
import { pageTransition } from '../../utils/animationVariants';
import { timeAgo } from '../../utils/formatters';
import GlassCard from '../../components/ui/GlassCard';
import Tabs from '../../components/ui/Tabs';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import PollWidget from '../../components/shared/PollWidget';
import Button from '../../components/ui/Button';

const tabs = [
  { id: 'announcements', label: 'Announcements' },
  { id: 'members', label: 'Members' },
  { id: 'polls', label: 'Polls' },
];

export default function GroupDetailPage() {
  const { groupId } = useParams();
  const [activeTab, setActiveTab] = useState('announcements');
  const group = groups.find((g) => g.id === groupId);

  if (!group) return <div className="text-center py-20 text-slate-400">Group not found</div>;

  const members = alumniProfiles.filter((a) => group.members.includes(a.id));

  return (
    <motion.div {...pageTransition}>
      <Link to="/groups" className="text-gold-400 hover:text-gold-300 text-sm mb-4 inline-block">&larr; All Groups</Link>

      <div className="h-48 rounded-2xl overflow-hidden mb-6">
        <img src={group.coverImage} alt={group.name} className="w-full h-full object-cover" />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">{group.name}</h1>
          <p className="text-slate-400 text-sm mt-1">{group.description}</p>
          <div className="flex gap-3 mt-2 text-sm text-slate-500">
            <span>👥 {group.memberCount} members</span>
            <Badge size="sm">{group.category}</Badge>
          </div>
        </div>
        <Button size="sm">Join Group</Button>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {activeTab === 'announcements' && (
        <div className="space-y-4">
          {group.announcements.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No announcements yet</p>
          ) : (
            group.announcements.map((ann) => (
              <GlassCard key={ann.id}>
                <h3 className="text-white font-semibold mb-1">{ann.title}</h3>
                <p className="text-slate-400 text-sm mb-3">{ann.content}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>By {ann.author}</span>
                  <span>❤️ {ann.likes} • {timeAgo(ann.date)}</span>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      )}

      {activeTab === 'members' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {members.map((m) => (
            <GlassCard key={m.id} className="text-center" padding="p-4">
              <Avatar src={m.avatar} name={m.name} size="lg" className="mx-auto mb-2" />
              <p className="text-white text-sm font-medium">{m.name}</p>
              <p className="text-slate-400 text-xs">{m.currentCity}</p>
            </GlassCard>
          ))}
          <GlassCard className="text-center flex items-center justify-center" padding="p-4">
            <p className="text-slate-500 text-sm">+{group.memberCount - members.length} more</p>
          </GlassCard>
        </div>
      )}

      {activeTab === 'polls' && (
        <div className="space-y-4">
          {group.polls.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No active polls</p>
          ) : (
            group.polls.map((poll) => <PollWidget key={poll.id} poll={poll} />)
          )}
        </div>
      )}
    </motion.div>
  );
}
