// "General Comms" and branch WhatsApp links captured from Volunteer chats.txt.
// Branch-specific links that exist but whose invite URL we haven't surfaced yet
// are flagged with `whatsAppRequestContact` so alumni know who to ping.
//
// Branch group sizes reflect what volunteers reported in the chat log. We do
// not fabricate member counts for groups we have no reading on.
export const GENERAL_COMMS_WHATSAPP = 'https://chat.whatsapp.com/JXcd7Dh4qKtJbrV6x3yw1Z';
export const PRODUCTION_WHATSAPP = 'https://chat.whatsapp.com/GcX4lvGJjmW8oBV4Qjpt4j';

export const groups = [
  { id: 'grp-general', name: 'General Comms - REConverge 2001', category: 'branch', description: 'Batch-wide announcements channel. Start here if you are just joining the reunion comms.', memberCount: null, coverImage: 'https://placehold.co/800x400/d4a843/0b1a2c?text=General+Comms', whatsAppInvite: GENERAL_COMMS_WHATSAPP, announcements: [], polls: [], members: [] },
  { id: 'grp-cs', name: 'Computer Science - Class of 2001', category: 'branch', description: 'CS branch group — created Jan 23. Roughly 40% of the branch is in the group as of Feb.', memberCount: null, coverImage: 'https://placehold.co/800x400/1e3a5f/d4a843?text=CS+Dept', whatsAppInvite: null, whatsAppRequestContact: 'Ask in General Comms', announcements: [], polls: [], members: [] },
  { id: 'grp-ece', name: 'Electronics & Communication - 2001', category: 'branch', description: 'ECE branch group. ~23 members as of Jan.', memberCount: 23, coverImage: 'https://placehold.co/800x400/2d5a8e/e8c468?text=ECE+Dept', whatsAppInvite: null, whatsAppRequestContact: 'Ask in General Comms', announcements: [], polls: [], members: [] },
  { id: 'grp-eee', name: 'Electrical & Electronics - 2001', category: 'branch', description: 'EEE branch group — already existed pre-reunion. ~50 members as of Jan.', memberCount: 50, coverImage: 'https://placehold.co/800x400/8e2d5a/f8fafc?text=EEE+Dept', whatsAppInvite: null, whatsAppRequestContact: 'Ask in General Comms', announcements: [], polls: [], members: [] },
  { id: 'grp-mech', name: 'Mechanical Engineering - 2001', category: 'branch', description: 'Mech branch group — existed pre-reunion; volunteers are still adding members. ~17 as of Jan.', memberCount: 17, coverImage: 'https://placehold.co/800x400/374151/f8fafc?text=Mech+Dept', whatsAppInvite: null, whatsAppRequestContact: 'Ask in General Comms', announcements: [], polls: [], members: [] },
  { id: 'grp-prod', name: 'Production Engineering - 2001', category: 'branch', description: 'Prod branch group — created Jan 23. 13 members as of Jan.', memberCount: 13, coverImage: 'https://placehold.co/800x400/6f42c1/ffffff?text=Prod+Dept', whatsAppInvite: PRODUCTION_WHATSAPP, announcements: [], polls: [], members: [] },
  { id: 'grp-civil', name: 'Civil Engineering - 2001', category: 'branch', description: 'Civil branch group — already existed pre-reunion.', memberCount: null, coverImage: 'https://placehold.co/800x400/5a8e2d/f8fafc?text=Civil+Dept', whatsAppInvite: null, whatsAppRequestContact: 'Ask in General Comms', announcements: [], polls: [], members: [] },
  { id: 'grp-arch', name: 'Architecture - 2001', category: 'branch', description: 'Architecture branch group — still being set up.', memberCount: null, coverImage: 'https://placehold.co/800x400/8e5a2d/f8fafc?text=Arch+Dept', whatsAppInvite: null, whatsAppRequestContact: 'Ask in General Comms', announcements: [], polls: [], members: [] },
];

export const groupCategories = [
  { id: 'all', label: 'All Groups', icon: '👥' },
  { id: 'branch', label: 'Branch', icon: '🏛️' },
  { id: 'custom', label: 'Alumni-created', icon: '✨' },
];

// Theme palette — matches the colour vocabulary used by the static branch
// groups so custom groups sit visually alongside them.
export const CUSTOM_GROUP_THEMES = [
  { id: 'indigo',  bg: '1e3a5f', fg: 'd4a843', emoji: '🎯' },
  { id: 'emerald', bg: '0b3d2e', fg: 'e8f5e9', emoji: '🌿' },
  { id: 'rose',    bg: '8e2d5a', fg: 'f8bbd0', emoji: '🎨' },
  { id: 'slate',   bg: '374151', fg: 'f8fafc', emoji: '🧠' },
  { id: 'gold',    bg: 'd4a843', fg: '0b1a2c', emoji: '⭐' },
  { id: 'fuchsia', bg: '4a148c', fg: 'f3e5f5', emoji: '🎸' },
  { id: 'ocean',   bg: '006064', fg: 'e0f7fa', emoji: '🌊' },
  { id: 'sand',    bg: '8e5a2d', fg: 'fff3e0', emoji: '🏕️' },
  { id: 'crimson', bg: '7a1818', fg: 'ffe0e0', emoji: '🍷' },
  { id: 'lime',    bg: '2d5a8e', fg: 'f8fafc', emoji: '🏆' },
];

// Keyword → theme mapping. First match wins. Keep the keyword list short and
// obvious; unknown names fall back to a stable hash.
const KEYWORD_THEME_RULES = [
  { re: /music|band|jam|song|concert|guitar|drum/i,           themeId: 'fuchsia', emoji: '🎸' },
  { re: /cricket|football|hockey|sport|tournament|athlet/i,   themeId: 'lime',    emoji: '🏆' },
  { re: /trek|hike|hill|mountain|wayanad|munnar|climb/i,      themeId: 'emerald', emoji: '🥾' },
  { re: /photo|shutter|camera|lens/i,                         themeId: 'sand',    emoji: '📸' },
  { re: /food|mess|canteen|cook|chef|eat|sadya|feast/i,       themeId: 'gold',    emoji: '🍽️' },
  { re: /code|tech|hack|dev|program|startup|entre/i,          themeId: 'indigo',  emoji: '💻' },
  { re: /travel|trip|journey|tour|backpack/i,                 themeId: 'ocean',   emoji: '✈️' },
  { re: /book|read|literat|poet/i,                            themeId: 'slate',   emoji: '📚' },
  { re: /art|paint|draw|sketch|craft/i,                       themeId: 'rose',    emoji: '🎨' },
  { re: /wine|whisk|beer|drink|pub|bar/i,                     themeId: 'crimson', emoji: '🍷' },
  { re: /film|movie|cinema|bollywood|ott/i,                   themeId: 'fuchsia', emoji: '🎬' },
  { re: /bike|car|ride|auto|road/i,                           themeId: 'slate',   emoji: '🏍️' },
  { re: /game|play|chess|poker|ludo/i,                        themeId: 'indigo',  emoji: '🎲' },
  { re: /yoga|meditat|health|wellness|fitness|gym/i,          themeId: 'emerald', emoji: '🧘' },
  { re: /kid|parent|family|child/i,                           themeId: 'ocean',   emoji: '👨‍👩‍👧' },
  { re: /home|house|real estate|invest|stock|finance/i,       themeId: 'gold',    emoji: '💼' },
];

function hashPick(str, len) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h) % len;
}

// Auto-pick a theme (and display emoji) based on the group name. Falls back
// to a stable hash so the same name always lands on the same look.
export function pickThemeForName(name) {
  const s = String(name || '').trim();
  if (!s) return { ...CUSTOM_GROUP_THEMES[0], emoji: CUSTOM_GROUP_THEMES[0].emoji };
  for (const rule of KEYWORD_THEME_RULES) {
    if (rule.re.test(s)) {
      const base = CUSTOM_GROUP_THEMES.find((t) => t.id === rule.themeId) || CUSTOM_GROUP_THEMES[0];
      return { ...base, emoji: rule.emoji };
    }
  }
  const base = CUSTOM_GROUP_THEMES[hashPick(s.toLowerCase(), CUSTOM_GROUP_THEMES.length)];
  return { ...base };
}

export function customGroupCover({ bg, fg, label }) {
  const safe = encodeURIComponent((label || 'Group').slice(0, 24));
  return `https://placehold.co/800x400/${bg}/${fg}?text=${safe}`;
}
