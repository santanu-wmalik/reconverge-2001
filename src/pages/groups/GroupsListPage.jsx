import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { groups as staticGroups, groupCategories, pickThemeForName, customGroupCover } from '../../data/groups';
import {
  customGroupApi,
  groupMembershipApi,
} from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import SearchInput from '../../components/ui/SearchInput';
import Tabs from '../../components/ui/Tabs';
import SectionHeading from '../../components/shared/SectionHeading';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const MAX_CUSTOM_PER_USER = 3;

function CreateGroupForm({ user, onCreated, onCancel }) {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);

  // Auto-pick the theme from the name as the user types.
  const theme = pickThemeForName(name);

  const submit = async () => {
    if (!name.trim()) { showToast('Name is required', 'error'); return; }
    setBusy(true);
    try {
      const id = `custom-${Date.now()}`;
      const created = await customGroupApi.create({
        id,
        name: name.trim(),
        description: description.trim(),
        category: 'custom',
        creatorId: user.id,
        themeId: theme.id,
        emoji: theme.emoji,
        coverImage: customGroupCover({ bg: theme.bg, fg: theme.fg, label: name.trim() }),
        createdAt: new Date().toISOString(),
      });
      await groupMembershipApi.create({
        groupId: created.id,
        alumniId: user.id,
        joinedAt: new Date().toISOString(),
      });
      onCreated(created);
      showToast('Group created — you\u2019ve auto-joined as the first member', 'success');
    } catch (e) {
      console.error(e);
      showToast('Could not create group', 'error');
    } finally { setBusy(false); }
  };

  return (
    <GlassCard hover={false} className="border-gold-500/30 mb-6">
      <h3 className="text-ink font-heading font-semibold mb-4">Create a custom group</h3>
      <div className="space-y-3">
        <Input
          label="Group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Cricket Crew · Wayanad Trek · Music Nights"
        />
        <p className="text-[11px] text-ink-muted -mt-2">
          Cover art auto-picks from keywords in the name — try words like <i>music</i>, <i>trek</i>, <i>cricket</i>, <i>food</i>, <i>tech</i>, <i>photo</i>, <i>wine</i>…
        </p>
        <label className="block">
          <span className="text-sm text-ink-soft mb-1 block">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="A line or two on what the group is about"
            className="w-full rounded-xl bg-white border border-forest-500/15 px-4 py-2.5 text-sm text-ink placeholder-ink-muted focus:outline-none focus:border-gold-400/40 resize-y"
          />
        </label>
        {/* Live preview */}
        <div>
          <span className="text-xs uppercase tracking-wider text-gold-700 font-semibold">Preview</span>
          <div className="mt-2 rounded-xl overflow-hidden border border-forest-500/15 flex items-center gap-3 p-2 bg-white">
            <div className="h-16 w-24 flex-shrink-0 rounded-lg overflow-hidden">
              <img src={customGroupCover({ bg: theme.bg, fg: theme.fg, label: name || 'Preview' })} alt="preview" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-ink text-sm font-medium truncate">{theme.emoji} {name || 'Your group name'}</p>
              <p className="text-xs text-ink-muted truncate">{description || 'Description…'}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-forest-500/15">
        <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" loading={busy} onClick={submit}>Create group</Button>
      </div>
    </GlassCard>
  );
}

export default function GroupsListPage() {
  const { user, isAuthenticated } = useAuth();
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [memberships, setMemberships] = useState([]);
  const [customGroups, setCustomGroups] = useState([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    Promise.all([
      groupMembershipApi.getAll().catch(() => []),
      customGroupApi.getAll().catch(() => []),
    ]).then(([m, c]) => {
      setMemberships(m || []);
      setCustomGroups(c || []);
    });
  }, []);

  const joinedByGroup = useMemo(() => {
    const counts = {};
    memberships.forEach((m) => { counts[m.groupId] = (counts[m.groupId] || 0) + 1; });
    return counts;
  }, [memberships]);

  // Normalise custom groups to the shape the card expects.
  const normalisedCustom = useMemo(() => customGroups.map((g) => ({
    id: g.id,
    name: g.name,
    category: g.category || 'custom',
    description: g.description,
    coverImage: g.coverImage,
    memberCount: null,
    whatsAppInvite: null,
    whatsAppRequestContact: null,
    isCustom: true,
    creatorId: g.creatorId,
  })), [customGroups]);

  const allGroups = useMemo(() => [...staticGroups, ...normalisedCustom], [normalisedCustom]);

  const filtered = allGroups.filter((g) => {
    if (category !== 'all' && g.category !== category) return false;
    if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const myCustomCount = useMemo(
    () => customGroups.filter((g) => g.creatorId === user?.id).length,
    [customGroups, user]
  );
  const canCreateMore = isAuthenticated && myCustomCount < MAX_CUSTOM_PER_USER;

  const handleCreated = (created) => {
    setCustomGroups((prev) => [...prev, created]);
    setMemberships((prev) => [
      ...prev,
      { id: `temp-${created.id}`, groupId: created.id, alumniId: user.id, joinedAt: new Date().toISOString() },
    ]);
    setCreating(false);
  };

  return (
    <motion.div {...pageTransition}>
      <SectionHeading
        title="Groups & Communities"
        subtitle="Branch groups live alongside alumni-created circles for your favourite interests. On-site announcements, polls and member lists here; deeper chat stays on WhatsApp."
      />

      {isAuthenticated && (
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <p className="text-xs text-ink-soft">
            You&apos;ve created <span className="text-ink font-medium">{myCustomCount}</span> of {MAX_CUSTOM_PER_USER} custom groups.
          </p>
          {!creating && (
            canCreateMore ? (
              <Button size="sm" onClick={() => setCreating(true)}>+ Create custom group</Button>
            ) : (
              <Button size="sm" variant="outline" disabled title={`Limit of ${MAX_CUSTOM_PER_USER} per alumnus`}>
                + Create custom group (limit reached)
              </Button>
            )
          )}
        </div>
      )}

      <AnimatePresence>
        {creating && user && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <CreateGroupForm user={user} onCreated={handleCreated} onCancel={() => setCreating(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs tabs={groupCategories.map((c) => ({ id: c.id, label: c.label, icon: c.icon }))} activeTab={category} onChange={setCategory} className="mb-6" />
      <SearchInput value={search} onChange={setSearch} placeholder="Search groups..." className="mb-8 max-w-md" />

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((group) => {
          const joinedHere = joinedByGroup[group.id] || 0;
          return (
            <motion.div key={group.id} variants={staggerItem}>
              <Link to={`/groups/${group.id}`}>
                <GlassCard className="h-full">
                  <div className="h-20 rounded-xl overflow-hidden mb-3 -mx-2 -mt-2">
                    <img src={group.coverImage} alt={group.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <h3 className="text-ink font-semibold text-sm truncate">{group.name}</h3>
                    {group.isCustom ? (
                      <Badge variant="gold" size="sm">✨ Custom</Badge>
                    ) : (
                      <Badge size="sm">{group.category}</Badge>
                    )}
                  </div>
                  <p className="text-ink-soft text-xs line-clamp-2 mb-3">{group.description}</p>
                  <div className="flex items-center gap-3 text-xs text-ink-muted flex-wrap">
                    {joinedHere > 0 && <span>🙋 {joinedHere} joined on site</span>}
                    {group.memberCount != null && <span>💬 WhatsApp: {group.memberCount} members</span>}
                  </div>
                  {group.whatsAppInvite ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(group.whatsAppInvite, '_blank', 'noopener,noreferrer');
                      }}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300"
                    >
                      💬 Join WhatsApp group →
                    </button>
                  ) : group.whatsAppRequestContact ? (
                    <p className="mt-3 text-[11px] text-ink-muted italic">
                      WhatsApp invite via: {group.whatsAppRequestContact}
                    </p>
                  ) : null}
                </GlassCard>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
