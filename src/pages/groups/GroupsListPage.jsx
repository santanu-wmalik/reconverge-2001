import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { groups, groupCategories } from '../../data/groups';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import SearchInput from '../../components/ui/SearchInput';
import Tabs from '../../components/ui/Tabs';
import SectionHeading from '../../components/shared/SectionHeading';

export default function GroupsListPage() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = groups.filter((g) => {
    if (category !== 'all' && g.category !== category) return false;
    if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <motion.div {...pageTransition}>
      <SectionHeading title="Groups & Communities" subtitle="Reconnect with your batch mates, hostel friends, and interest groups" />

      <Tabs tabs={groupCategories.map((c) => ({ id: c.id, label: c.label, icon: c.icon }))} activeTab={category} onChange={setCategory} className="mb-6" />
      <SearchInput value={search} onChange={setSearch} placeholder="Search groups..." className="mb-8 max-w-md" />

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((group) => (
          <motion.div key={group.id} variants={staggerItem}>
            <Link to={`/groups/${group.id}`}>
              <GlassCard className="h-full">
                <div className="h-32 rounded-xl overflow-hidden mb-4 -mx-2 -mt-2">
                  <img src={group.coverImage} alt={group.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold text-sm">{group.name}</h3>
                  <Badge size="sm">{group.category}</Badge>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 mb-3">{group.description}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>👥 {group.memberCount} members</span>
                  {group.announcements.length > 0 && <span>📢 {group.announcements.length} posts</span>}
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
