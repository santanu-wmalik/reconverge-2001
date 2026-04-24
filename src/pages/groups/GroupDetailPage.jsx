import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { groups as staticGroups } from '../../data/groups';
import {
  alumniApi,
  customGroupApi,
  groupMembershipApi,
  groupAnnouncementApi,
  groupPollApi,
} from '../../services/api';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import { timeAgo } from '../../utils/formatters';
import GlassCard from '../../components/ui/GlassCard';
import Tabs from '../../components/ui/Tabs';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const tabs = [
  { id: 'announcements', label: 'Announcements', icon: '📢' },
  { id: 'members', label: 'Members', icon: '👥' },
  { id: 'polls', label: 'Polls', icon: '📊' },
];

/* ===================== Announcements tab ===================== */
function AnnouncementsPanel({ groupId, user, isMember, alumniIndex }) {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    groupAnnouncementApi.getByGroup(groupId).then((res) => {
      setItems(res || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [groupId]);

  const post = async () => {
    if (!title.trim() || !content.trim()) { showToast('Title and content required', 'error'); return; }
    setBusy(true);
    try {
      const created = await groupAnnouncementApi.create({
        groupId,
        authorId: user.id,
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
      });
      setItems((prev) => [created, ...prev]);
      setTitle(''); setContent(''); setComposerOpen(false);
      showToast('Announcement posted', 'success');
    } catch (e) {
      showToast('Could not post — is json-server running?', 'error');
    } finally { setBusy(false); }
  };

  const remove = async (id) => {
    try {
      await groupAnnouncementApi.remove(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      showToast('Removed', 'info');
    } catch (e) { showToast('Delete failed', 'error'); }
  };

  return (
    <div>
      {isMember && (
        <div className="mb-5">
          {!composerOpen ? (
            <Button size="sm" onClick={() => setComposerOpen(true)}>+ New announcement</Button>
          ) : (
            <GlassCard hover={false} className="border-gold-500/30">
              <h4 className="text-white font-heading font-semibold mb-3">Post announcement</h4>
              <div className="space-y-3">
                <Input label="Title" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Short headline" />
                <label className="block">
                  <span className="text-sm text-slate-300 mb-1 block">Content</span>
                  <textarea
                    value={content}
                    onChange={(e)=>setContent(e.target.value)}
                    rows={4}
                    placeholder="Details…"
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-400/40 resize-y"
                  />
                </label>
              </div>
              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-white/10">
                <Button variant="ghost" size="sm" onClick={()=>{setComposerOpen(false); setTitle(''); setContent('');}}>Cancel</Button>
                <Button size="sm" loading={busy} onClick={post}>Post</Button>
              </div>
            </GlassCard>
          )}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : items.length === 0 ? (
        <GlassCard className="text-center">
          <div className="text-3xl mb-2">📢</div>
          <p className="text-slate-400 text-sm">No announcements yet{isMember ? ' — be the first to post' : ''}.</p>
        </GlassCard>
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
          {items.map((a) => {
            const authorName = alumniIndex[a.authorId] || 'A batchmate';
            const isOwn = a.authorId === user?.id;
            return (
              <motion.div key={a.id} variants={staggerItem}>
                <GlassCard>
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="text-white font-heading font-semibold">{a.title}</h3>
                    {isOwn && (
                      <button onClick={() => remove(a.id)} className="text-xs text-red-400 hover:text-red-300 flex-shrink-0">Delete</button>
                    )}
                  </div>
                  <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed mb-3">{a.content}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-white/5">
                    <span>By {authorName}</span>
                    <span>{timeAgo(a.createdAt)}</span>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

/* ===================== Members tab ===================== */
function MembersPanel({ memberships, alumniIndex }) {
  if (memberships.length === 0) {
    return (
      <GlassCard className="text-center">
        <div className="text-3xl mb-2">👥</div>
        <p className="text-slate-400 text-sm">No members yet. Click <b>Join</b> above to be the first.</p>
      </GlassCard>
    );
  }
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {memberships.map((m) => {
        const name = alumniIndex[m.alumniId] || 'Batchmate';
        const initials = name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase();
        return (
          <motion.div key={m.id} variants={staggerItem}>
            <GlassCard className="text-center" padding="p-4">
              <Avatar name={name} size="lg" className="mx-auto mb-2" />
              <p className="text-white text-sm font-medium truncate">{name}</p>
              <p className="text-slate-500 text-xs mt-0.5">Joined {timeAgo(m.joinedAt)}</p>
            </GlassCard>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

/* ===================== Polls tab ===================== */
function PollComposer({ groupId, user, onCreated, onCancel }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [busy, setBusy] = useState(false);
  const { showToast } = useToast();

  const updateOption = (i, v) => setOptions((prev) => prev.map((o, idx) => idx === i ? v : o));
  const addOption = () => setOptions((prev) => prev.length < 6 ? [...prev, ''] : prev);
  const removeOption = (i) => setOptions((prev) => prev.length > 2 ? prev.filter((_, idx) => idx !== i) : prev);

  const submit = async () => {
    const cleaned = options.map((o) => o.trim()).filter(Boolean);
    if (!question.trim()) { showToast('Question required', 'error'); return; }
    if (cleaned.length < 2) { showToast('Need at least 2 options', 'error'); return; }
    setBusy(true);
    try {
      const created = await groupPollApi.create({
        groupId,
        authorId: user.id,
        question: question.trim(),
        options: cleaned.map((text, i) => ({ id: `o${i + 1}`, text })),
        votes: {},
        createdAt: new Date().toISOString(),
      });
      onCreated(created);
      showToast('Poll created', 'success');
    } catch (e) {
      showToast('Could not create poll', 'error');
    } finally { setBusy(false); }
  };

  return (
    <GlassCard hover={false} className="border-gold-500/30">
      <h4 className="text-white font-heading font-semibold mb-3">New poll</h4>
      <Input label="Question" value={question} onChange={(e)=>setQuestion(e.target.value)} placeholder="e.g. Which night for branch dinner?" />
      <div className="mt-4 space-y-2">
        <span className="text-sm text-slate-300">Options (min 2, max 6)</span>
        {options.map((opt, i) => (
          <div key={i} className="flex gap-2">
            <Input value={opt} onChange={(e)=>updateOption(i, e.target.value)} placeholder={`Option ${i + 1}`} />
            {options.length > 2 && (
              <button onClick={()=>removeOption(i)} className="text-red-400 text-xs hover:text-red-300 flex-shrink-0">Remove</button>
            )}
          </div>
        ))}
        {options.length < 6 && (
          <button onClick={addOption} className="text-xs text-gold-400 hover:text-gold-300">+ Add option</button>
        )}
      </div>
      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-white/10">
        <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" loading={busy} onClick={submit}>Create poll</Button>
      </div>
    </GlassCard>
  );
}

function PollCard({ poll, user, onVote, onDelete }) {
  const myVote = poll.votes?.[user?.id];
  const totals = {};
  Object.values(poll.votes || {}).forEach((optId) => {
    totals[optId] = (totals[optId] || 0) + 1;
  });
  const totalVotes = Object.values(totals).reduce((s, n) => s + n, 0);
  const isAuthor = poll.authorId === user?.id;

  return (
    <GlassCard>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-white font-heading font-semibold">{poll.question}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{totalVotes} vote{totalVotes === 1 ? '' : 's'} · {timeAgo(poll.createdAt)}</p>
        </div>
        {isAuthor && (
          <button onClick={onDelete} className="text-xs text-red-400 hover:text-red-300 flex-shrink-0">Delete</button>
        )}
      </div>
      <div className="space-y-2">
        {poll.options.map((opt) => {
          const count = totals[opt.id] || 0;
          const pct = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);
          const isMine = myVote === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onVote(opt.id)}
              className={`relative w-full text-left rounded-xl border px-3 py-2 overflow-hidden transition ${
                isMine ? 'border-gold-400/60 bg-gold-500/10' : 'border-white/10 bg-white/3 hover:bg-white/5'
              }`}
            >
              <div className="absolute inset-y-0 left-0 bg-gold-500/10" style={{ width: `${pct}%` }} />
              <div className="relative flex items-center justify-between text-sm">
                <span className="text-white">
                  {isMine && <span className="text-gold-400 mr-2">✓</span>}
                  {opt.text}
                </span>
                <span className="text-xs text-slate-400 font-mono">{pct}% · {count}</span>
              </div>
            </button>
          );
        })}
      </div>
      {myVote && (
        <p className="text-xs text-slate-500 italic mt-2">Click another option to change your vote.</p>
      )}
    </GlassCard>
  );
}

function PollsPanel({ groupId, user, isMember }) {
  const { showToast } = useToast();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);

  useEffect(() => {
    groupPollApi.getByGroup(groupId).then((res) => {
      setPolls(res || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [groupId]);

  const handleVote = async (pollId, optionId) => {
    const poll = polls.find((p) => p.id === pollId);
    if (!poll) return;
    const nextVotes = { ...(poll.votes || {}) };
    if (nextVotes[user.id] === optionId) {
      delete nextVotes[user.id];
    } else {
      nextVotes[user.id] = optionId;
    }
    try {
      const updated = await groupPollApi.update(pollId, { votes: nextVotes });
      setPolls((prev) => prev.map((p) => (p.id === pollId ? updated : p)));
    } catch (e) { showToast('Vote failed', 'error'); }
  };

  const handleDelete = async (pollId) => {
    try {
      await groupPollApi.remove(pollId);
      setPolls((prev) => prev.filter((p) => p.id !== pollId));
      showToast('Poll removed', 'info');
    } catch (e) { showToast('Delete failed', 'error'); }
  };

  return (
    <div>
      {isMember && (
        <div className="mb-5">
          {!composerOpen ? (
            <Button size="sm" onClick={() => setComposerOpen(true)}>+ Create poll</Button>
          ) : (
            <PollComposer
              groupId={groupId}
              user={user}
              onCreated={(p) => { setPolls((prev) => [p, ...prev]); setComposerOpen(false); }}
              onCancel={() => setComposerOpen(false)}
            />
          )}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : polls.length === 0 ? (
        <GlassCard className="text-center">
          <div className="text-3xl mb-2">📊</div>
          <p className="text-slate-400 text-sm">No polls yet{isMember ? ' — start one to see what the group thinks' : ''}.</p>
        </GlassCard>
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
          {polls.map((p) => (
            <motion.div key={p.id} variants={staggerItem}>
              <PollCard
                poll={p}
                user={user}
                onVote={(optId) => isMember ? handleVote(p.id, optId) : showToast('Join the group to vote', 'info')}
                onDelete={() => handleDelete(p.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

/* ===================== Main page ===================== */
export default function GroupDetailPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('announcements');
  const [memberships, setMemberships] = useState([]);
  const [alumniIndex, setAlumniIndex] = useState({});
  const [customGroup, setCustomGroup] = useState(null);
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [busyJoin, setBusyJoin] = useState(false);
  const [busyDelete, setBusyDelete] = useState(false);

  const staticGroup = staticGroups.find((g) => g.id === groupId);

  useEffect(() => {
    setLoadingGroup(true);
    // Resolve the group (static first, then custom) + memberships + alumni.
    Promise.all([
      staticGroup ? Promise.resolve(staticGroup) : customGroupApi.getAll().then((all) => all.find((g) => g.id === groupId) || null).catch(() => null),
      groupMembershipApi.getByGroup(groupId).catch(() => []),
      alumniApi.getAll().catch(() => []),
    ]).then(([resolved, m, a]) => {
      if (!staticGroup) setCustomGroup(resolved);
      setMemberships(m || []);
      const map = {};
      a.forEach((al) => { map[al.id] = al.name; });
      setAlumniIndex(map);
      setLoadingGroup(false);
    });
  }, [groupId, staticGroup]);

  const group = staticGroup || customGroup;
  const isCustom = !staticGroup && !!customGroup;

  const myMembership = useMemo(
    () => memberships.find((m) => m.alumniId === user?.id),
    [memberships, user]
  );
  const isMember = !!myMembership;

  // Delete-gate rules for custom groups:
  //  - Admins can always delete
  //  - Creator can delete only if they are the sole member (no one else joined)
  const otherMembersCount = useMemo(
    () => (isCustom ? memberships.filter((m) => m.alumniId !== group?.creatorId).length : 0),
    [memberships, group, isCustom]
  );
  const isCreator = isCustom && user?.id === group?.creatorId;
  const canDelete = isCustom && (isAdmin || (isCreator && otherMembersCount === 0));

  if (loadingGroup && !group) return <div className="text-center py-20 text-slate-400">Loading…</div>;
  if (!group) return <div className="text-center py-20 text-slate-400">Group not found</div>;

  const join = async () => {
    setBusyJoin(true);
    try {
      const created = await groupMembershipApi.create({
        groupId,
        alumniId: user.id,
        joinedAt: new Date().toISOString(),
      });
      setMemberships((prev) => [...prev, created]);
      showToast(`Joined ${group.name}`, 'success');
    } catch (e) { showToast('Join failed', 'error'); }
    finally { setBusyJoin(false); }
  };

  const leave = async () => {
    if (!myMembership) return;
    setBusyJoin(true);
    try {
      await groupMembershipApi.remove(myMembership.id);
      setMemberships((prev) => prev.filter((m) => m.id !== myMembership.id));
      showToast('Left the group', 'info');
    } catch (e) { showToast('Leave failed', 'error'); }
    finally { setBusyJoin(false); }
  };

  const deleteGroup = async () => {
    if (!canDelete) return;
    const confirmMsg = isAdmin && !isCreator
      ? `Delete "${group.name}"? This also removes all memberships, announcements and polls in the group. Irreversible.`
      : `Delete "${group.name}"? Irreversible.`;
    if (!window.confirm(confirmMsg)) return;
    setBusyDelete(true);
    try {
      // Clean up dependent data: memberships, announcements, polls, then the group itself.
      const [anns, polls, mems] = await Promise.all([
        groupAnnouncementApi.getByGroup(groupId).catch(() => []),
        groupPollApi.getByGroup(groupId).catch(() => []),
        groupMembershipApi.getByGroup(groupId).catch(() => []),
      ]);
      await Promise.all([
        ...anns.map((a) => groupAnnouncementApi.remove(a.id).catch(() => null)),
        ...polls.map((p) => groupPollApi.remove(p.id).catch(() => null)),
        ...mems.map((m) => groupMembershipApi.remove(m.id).catch(() => null)),
      ]);
      await customGroupApi.remove(groupId);
      showToast('Group deleted', 'info');
      navigate('/groups');
    } catch (e) {
      console.error(e);
      showToast('Delete failed', 'error');
      setBusyDelete(false);
    }
  };

  const creatorName = isCustom ? (alumniIndex[group.creatorId] || 'A batchmate') : null;

  return (
    <motion.div {...pageTransition}>
      <Link to="/groups" className="text-gold-400 hover:text-gold-300 text-sm mb-4 inline-block">&larr; All Groups</Link>

      <div className="h-28 rounded-2xl overflow-hidden mb-6">
        <img src={group.coverImage} alt={group.name} className="w-full h-full object-cover" />
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-heading font-bold text-white">{group.emoji ? `${group.emoji} ` : ''}{group.name}</h1>
          <p className="text-slate-400 text-sm mt-1">{group.description}</p>
          <div className="flex gap-3 mt-2 text-xs text-slate-500 items-center flex-wrap">
            <span>👥 {memberships.length} joined on site</span>
            {isCustom ? (
              <Badge variant="gold" size="sm">✨ Custom</Badge>
            ) : (
              <Badge size="sm">{group.category}</Badge>
            )}
            {isCustom && (
              <span>Created by {creatorName}{isCreator && ' (you)'}</span>
            )}
            {group.whatsAppInvite && (
              <a href={group.whatsAppInvite} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 text-xs">
                💬 WhatsApp group
              </a>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 flex gap-2">
          {isMember ? (
            <Button size="sm" variant="outline" loading={busyJoin} onClick={leave}>Leave group</Button>
          ) : (
            <Button size="sm" loading={busyJoin} onClick={join}>Join group</Button>
          )}
          {isCustom && (
            canDelete ? (
              <Button size="sm" variant="danger" loading={busyDelete} onClick={deleteGroup}>
                {isAdmin && !isCreator ? 'Admin delete' : 'Delete'}
              </Button>
            ) : isCreator ? (
              <Button size="sm" variant="outline" disabled title={`${otherMembersCount} other member${otherMembersCount === 1 ? '' : 's'} joined — only an admin can delete now`}>
                Locked 🔒
              </Button>
            ) : null
          )}
        </div>
      </div>

      {isCustom && isCreator && otherMembersCount > 0 && (
        <GlassCard className="border-amber-500/20 bg-amber-500/5 mb-5 py-3">
          <p className="text-xs text-amber-300">
            🔒 Other members have joined — this group is now community-owned. If you need it removed, contact an admin.
          </p>
        </GlassCard>
      )}

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          {activeTab === 'announcements' && (
            <AnnouncementsPanel groupId={groupId} user={user} isMember={isMember} alumniIndex={alumniIndex} />
          )}
          {activeTab === 'members' && (
            <MembersPanel memberships={memberships} alumniIndex={alumniIndex} />
          )}
          {activeTab === 'polls' && (
            <PollsPanel groupId={groupId} user={user} isMember={isMember} />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
