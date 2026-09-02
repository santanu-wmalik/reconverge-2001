import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { alumniApi, travelItemApi } from '../../services/api';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import { TRAVEL_CATEGORIES, VISIBILITY_LEVELS, getCategory } from '../../data/travelCategories';
import GlassCard from '../../components/ui/GlassCard';
import Tabs from '../../components/ui/Tabs';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import SectionHeading from '../../components/shared/SectionHeading';

const TABS = [
  { id: 'my-plan', label: 'My Itinerary', icon: '📝' },
  { id: 'board', label: "Who's Coming", icon: '🌏' },
];

const visibilityBadge = {
  private: { variant: 'default', label: '🔒 Private' },
  alumni: { variant: 'gold', label: '🎟️ Alumni only' },
  specific: { variant: 'default', label: '👥 Specific people' },
};

function emptyFieldsFor(cat) {
  const out = {};
  cat.fields.forEach((f) => {
    if (f.default !== undefined) out[f.name] = f.default;
    else if (f.type === 'number') out[f.name] = f.min ?? 0;
    else out[f.name] = '';
  });
  return out;
}

function ItemForm({ initial, onSave, onCancel, alumniList = [], currentUserId }) {
  const [catId, setCatId] = useState(initial?.categoryId || TRAVEL_CATEGORIES[0].id);
  const cat = getCategory(catId);
  const [fields, setFields] = useState(initial?.fields || emptyFieldsFor(cat));
  const [visibility, setVisibility] = useState(initial?.visibility || 'private');
  const [title, setTitle] = useState(initial?.title || '');
  const [allowedAlumniIds, setAllowedAlumniIds] = useState(initial?.allowedAlumniIds || []);
  const [pickerQuery, setPickerQuery] = useState('');

  // Exclude the current user from the picker (no point "sharing with yourself")
  // and anyone with a blank name (incomplete registrations). Sorted for easy scanning.
  const pickerCandidates = useMemo(() => {
    const q = pickerQuery.trim().toLowerCase();
    return alumniList
      .filter((a) => a.id && a.id !== currentUserId && (a.name || '').trim())
      .filter((a) => {
        if (!q) return true;
        return (
          (a.name || '').toLowerCase().includes(q) ||
          (a.email || '').toLowerCase().includes(q) ||
          (a.branch || '').toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [alumniList, pickerQuery, currentUserId]);

  const toggleAlumnus = (id) => {
    setAllowedAlumniIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCategoryChange = (newId) => {
    setCatId(newId);
    const nextCat = getCategory(newId);
    setFields(emptyFieldsFor(nextCat));
  };

  const updateField = (name, value) => setFields((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = () => {
    onSave({
      categoryId: catId,
      title: title.trim() || cat.label,
      fields,
      visibility,
      // Only persist the allow-list when relevant; clear it otherwise so
      // we don't carry stale IDs if the author flips visibility later.
      allowedAlumniIds: visibility === 'specific' ? allowedAlumniIds : [],
    });
  };

  return (
    <GlassCard hover={false} className="border-gold-500/30">
      <h3 className="text-ink font-heading font-semibold mb-4">{initial ? 'Edit item' : 'Add a travel item'}</h3>

      {/* Category picker */}
      <div className="mb-4">
        <p className="text-xs uppercase tracking-wider text-gold-700 font-semibold mb-2">What kind of item?</p>
        <div className="flex flex-wrap gap-2">
          {TRAVEL_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleCategoryChange(c.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                c.id === catId
                  ? 'bg-gold-500 text-navy-950 border-gold-400'
                  : 'bg-white text-ink-soft border-forest-500/15 hover:bg-forest-600/8'
              }`}
            >
              <span>{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title (optional) */}
      <div className="mb-4">
        <Input
          label="Custom title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={`Defaults to "${cat.label}"`}
        />
      </div>

      {/* Category-specific fields */}
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {cat.fields.map((f) => {
          if (f.type === 'select') {
            return (
              <Select
                key={f.name}
                label={f.label}
                value={fields[f.name] || ''}
                onChange={(e) => updateField(f.name, e.target.value)}
                options={f.options}
                placeholder="Select…"
              />
            );
          }
          return (
            <Input
              key={f.name}
              label={f.label}
              type={f.type || 'text'}
              value={fields[f.name] ?? ''}
              onChange={(e) => updateField(f.name, e.target.value)}
              placeholder={f.placeholder}
              min={f.min}
              max={f.max}
            />
          );
        })}
      </div>

      {/* Visibility */}
      <div className="mb-4 pt-4 border-t border-forest-500/15">
        <p className="text-xs uppercase tracking-wider text-gold-700 font-semibold mb-2">Who can see this?</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {VISIBILITY_LEVELS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVisibility(v.id)}
              className={`text-left flex items-start gap-3 px-3 py-2 rounded-xl border transition ${
                v.id === visibility
                  ? 'border-gold-400/60 bg-gold-500/10'
                  : 'border-forest-500/15 bg-white hover:bg-forest-600/8'
              }`}
            >
              <span className="text-lg flex-shrink-0">{v.icon}</span>
              <div>
                <p className="text-sm text-ink font-medium">{v.label}</p>
                <p className="text-xs text-ink-muted">{v.blurb}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Specific-people picker — only shown when that visibility is selected */}
        {visibility === 'specific' && (
          <div className="mt-4 rounded-xl border border-gold-500/30 bg-gold-500/5 p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wider text-gold-700 font-semibold">
                Pick batchmates
              </p>
              <p className="text-xs text-ink-soft">
                {allowedAlumniIds.length} selected
              </p>
            </div>

            {/* Selected-chip row (quick remove) */}
            {allowedAlumniIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {allowedAlumniIds.map((id) => {
                  const a = alumniList.find((x) => x.id === id);
                  if (!a) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleAlumnus(id)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gold-500/20 text-gold-700 border border-gold-400/40 hover:bg-gold-500/30"
                      title="Click to remove"
                    >
                      {a.name}
                      <span aria-hidden>×</span>
                    </button>
                  );
                })}
              </div>
            )}

            <Input
              value={pickerQuery}
              onChange={(e) => setPickerQuery(e.target.value)}
              placeholder="Search by name, email, or branch…"
            />

            <div className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-forest-500/15 bg-black/20 divide-y divide-white/5">
              {pickerCandidates.length === 0 ? (
                <p className="text-xs text-ink-muted p-3 text-center">
                  {alumniList.length === 0
                    ? 'No batchmates registered yet — check back once registrations pick up.'
                    : 'No matches for this search.'}
                </p>
              ) : (
                pickerCandidates.map((a) => {
                  const checked = allowedAlumniIds.includes(a.id);
                  return (
                    <label
                      key={a.id}
                      className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition ${
                        checked ? 'bg-gold-500/10 text-ink' : 'text-ink-soft hover:bg-forest-600/8'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAlumnus(a.id)}
                        className="accent-gold-400"
                      />
                      <span className="flex-1 min-w-0">
                        <span className="text-ink">{a.name}</span>
                        {a.branch && (
                          <span className="text-xs text-ink-muted"> · {a.branch}</span>
                        )}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
            <p className="text-xs text-ink-muted mt-2">
              Only the people you tick will see this item on the Who's Coming board.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-forest-500/15">
        <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" onClick={handleSubmit}>{initial ? 'Save changes' : 'Add item'}</Button>
      </div>
    </GlassCard>
  );
}

function ItemCard({ item, alumniName, onEdit, onDelete }) {
  const cat = getCategory(item.categoryId);
  const vis = visibilityBadge[item.visibility] || visibilityBadge.private;
  if (!cat) return null;
  const filled = cat.fields.filter((f) => item.fields?.[f.name] !== undefined && String(item.fields[f.name]).trim() !== '');

  return (
    <GlassCard className={`bg-gradient-to-br ${cat.accent}`}>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="text-2xl flex-shrink-0">{cat.icon}</div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">{cat.label}</p>
            <h4 className="text-ink font-heading font-semibold text-sm">{item.title || cat.label}</h4>
            {alumniName && <p className="text-xs text-ink-soft mt-0.5">by {alumniName}</p>}
          </div>
        </div>
        <Badge variant={vis.variant} size="sm">{vis.label}</Badge>
      </div>

      {filled.length > 0 && (
        <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
          {filled.map((f) => (
            <div key={f.name} className="flex gap-2">
              <dt className="text-ink-muted flex-shrink-0">{f.label}:</dt>
              <dd className="text-ink truncate">{String(item.fields[f.name])}</dd>
            </div>
          ))}
        </dl>
      )}

      {(onEdit || onDelete) && (
        <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-forest-500/15">
          {onEdit && <button type="button" className="text-xs text-ink-soft hover:text-ink" onClick={onEdit}>Edit</button>}
          {onDelete && <button type="button" className="text-xs text-red-400 hover:text-red-300" onClick={onDelete}>Delete</button>}
        </div>
      )}
    </GlassCard>
  );
}

export default function TravelPlannerPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState('my-plan');
  const [items, setItems] = useState([]);
  const [alumniList, setAlumniList] = useState([]);
  const [alumniIndex, setAlumniIndex] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | itemId
  const [boardFilter, setBoardFilter] = useState('all');

  useEffect(() => {
    Promise.all([travelItemApi.getAll().catch(() => []), alumniApi.getAll().catch(() => [])])
      .then(([tItems, alumni]) => {
        setItems(tItems);
        setAlumniList(alumni);
        const map = {};
        alumni.forEach((a) => { map[a.id] = a.name; });
        setAlumniIndex(map);
        setLoading(false);
      });
  }, []);

  const myItems = useMemo(
    () => items.filter((i) => i.alumniId === user?.id),
    [items, user]
  );

  // Items that show up on the "Who's Coming" board for the current user:
  //   - visibility 'alumni' → any logged-in batchmate
  //   - visibility 'specific' → the owner + anyone named in allowedAlumniIds
  //   - visibility 'private' → never shown here (only the owner + Travel
  //     committee, which has its own view)
  const publicItems = useMemo(() => {
    const uid = user?.id;
    return items.filter((i) => {
      if (i.visibility === 'alumni') return true;
      if (i.visibility === 'specific') {
        if (i.alumniId === uid) return true;
        return Array.isArray(i.allowedAlumniIds) && i.allowedAlumniIds.includes(uid);
      }
      return false;
    });
  }, [items, user]);

  const filteredBoardItems = useMemo(() => {
    if (boardFilter === 'all') return publicItems;
    return publicItems.filter((i) => i.categoryId === boardFilter);
  }, [publicItems, boardFilter]);

  const handleSave = async (payload) => {
    try {
      if (editing && editing !== 'new') {
        const updated = await travelItemApi.update(editing, { ...payload, updatedAt: new Date().toISOString() });
        setItems((prev) => prev.map((i) => (i.id === editing ? updated : i)));
        showToast('Item updated', 'success');
      } else {
        const created = await travelItemApi.create({
          ...payload,
          alumniId: user?.id,
          createdAt: new Date().toISOString(),
        });
        setItems((prev) => [...prev, created]);
        showToast('Travel item added', 'success');
      }
      setEditing(null);
    } catch (err) {
      console.error(err);
      showToast('Could not save the item — is json-server running?', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await travelItemApi.remove(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      showToast('Item removed', 'info');
    } catch (err) {
      console.error(err);
      showToast('Could not delete', 'error');
    }
  };

  const editingItem = editing && editing !== 'new' ? items.find((i) => i.id === editing) : null;

  return (
    <motion.div {...pageTransition}>
      <SectionHeading
        title="Travel Planner"
        subtitle="A free-form place to log everything about your trip — flights, trains, carpools, pickups, pre- or post-event plans. Share only what you want to share."
      />

      <Tabs tabs={TABS} activeTab={tab} onChange={setTab} className="mb-6" />

      {/* === MY PLAN === */}
      {tab === 'my-plan' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-ink-soft">
              {loading
                ? 'Loading…'
                : myItems.length === 0
                ? 'Nothing yet. Start by adding what you know — you can update any time.'
                : `${myItems.length} item${myItems.length === 1 ? '' : 's'} on your travel itinerary.`}
            </p>
            {editing !== 'new' && (
              <Button size="sm" onClick={() => setEditing('new')}>+ Add item</Button>
            )}
          </div>

          <AnimatePresence>
            {editing === 'new' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-6"
              >
                <ItemForm
                  onSave={handleSave}
                  onCancel={() => setEditing(null)}
                  alumniList={alumniList}
                  currentUserId={user?.id}
                />
              </motion.div>
            )}
            {editingItem && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-6"
              >
                <ItemForm
                  initial={editingItem}
                  onSave={handleSave}
                  onCancel={() => setEditing(null)}
                  alumniList={alumniList}
                  currentUserId={user?.id}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid md:grid-cols-2 gap-4">
            {myItems.map((item) => (
              <motion.div key={item.id} variants={staggerItem}>
                <ItemCard
                  item={item}
                  onEdit={() => setEditing(item.id)}
                  onDelete={() => handleDelete(item.id)}
                />
              </motion.div>
            ))}
          </motion.div>

          {!loading && myItems.length === 0 && editing !== 'new' && (
            <GlassCard className="text-center border-gold-500/20">
              <div className="text-4xl mb-3">🧳</div>
              <h4 className="text-ink font-heading font-semibold mb-1">Start your itinerary</h4>
              <p className="text-sm text-ink-soft mb-4">Add your flight, train, carpool or anything else. Everything you add is <span className="text-ink">Private by default</span> — change visibility per-item when you want others to see it.</p>
              <Button size="sm" onClick={() => setEditing('new')}>+ Add your first item</Button>
            </GlassCard>
          )}
        </div>
      )}

      {/* === WHO'S COMING === */}
      {tab === 'board' && (
        <div>
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setBoardFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${boardFilter === 'all' ? 'bg-gold-500 text-navy-950 border-gold-400' : 'bg-white text-ink-soft border-forest-500/15 hover:bg-forest-600/8'}`}
            >
              All
            </button>
            {TRAVEL_CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setBoardFilter(c.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${boardFilter === c.id ? 'bg-gold-500 text-navy-950 border-gold-400' : 'bg-white text-ink-soft border-forest-500/15 hover:bg-forest-600/8'}`}
              >
                <span>{c.icon}</span>{c.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-sm text-ink-soft">Loading…</p>
          ) : filteredBoardItems.length === 0 ? (
            <GlassCard className="text-center border-forest-500/20">
              <div className="text-4xl mb-3">🌏</div>
              <h4 className="text-ink font-heading font-semibold mb-1">Nothing shared here yet</h4>
              <p className="text-sm text-ink-soft">
                {boardFilter === 'all'
                  ? 'When batchmates mark their travel items as "Registered alumni", they\u2019ll show up here.'
                  : 'No items in this category yet. Try All or a different category.'}
              </p>
            </GlassCard>
          ) : (
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid md:grid-cols-2 gap-4">
              {filteredBoardItems.map((item) => (
                <motion.div key={item.id} variants={staggerItem}>
                  <ItemCard item={item} alumniName={alumniIndex[item.alumniId] || 'A batchmate'} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      )}

      {/* Info footer */}
      <GlassCard className="mt-10 border-forest-500/20 bg-gradient-to-br from-primary-900/20 to-transparent">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <p className="text-sm text-ink font-medium mb-1">How sharing works</p>
            <p className="text-xs text-ink-soft leading-relaxed">
              Every item is <b>Private by default</b>. Switch to <b>Registered alumni</b> to make it visible on the Who's Coming board for any logged-in batchmate, or pick <b>Specific people</b> to share with individual batchmates only — they'll see it on their board, nobody else will. Travel details never appear on the public website.
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
