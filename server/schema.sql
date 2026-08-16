-- REConverge 2001 — relational schema.
--
-- Replaces the single-row JSONB `app_state` blob with proper tables. Stable,
-- queryable fields get typed columns; inherently variable / nested payloads
-- (poll options, order line items, itinerary event ids, travel-item fields)
-- stay as JSONB columns inside their owning table. That's the right
-- relational answer for variable structure, not a return to one-blob-fits-all.
--
-- All `id` columns are TEXT because the existing application generates IDs
-- like `alum-foo`, `custom-1714000000000`, etc. on the client. We don't fight
-- that here.
--
-- Idempotent: every CREATE uses IF NOT EXISTS so this can re-run on every boot.

-- ─── alumni ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alumni (
  id                 TEXT PRIMARY KEY,
  name               TEXT,
  email              TEXT NOT NULL,
  phone              TEXT,
  batch              INTEGER DEFAULT 2001,
  branch             TEXT,
  roll_number        TEXT,
  hostel             TEXT,
  current_city       TEXT,
  state              TEXT,
  company            TEXT,
  designation        TEXT,
  avatar             TEXT,
  registration_id    TEXT,
  is_registered      BOOLEAN DEFAULT FALSE,
  travel_mode        TEXT,
  arrival_date       TEXT,                         -- kept TEXT: client emits 'YYYY-MM-DD' or '' freely
  arrival_time       TEXT,
  departure_date     TEXT,
  departure_time     TEXT,
  room_preference    TEXT,
  preferred_roommate TEXT,
  tshirt_size        TEXT,
  dietary_pref       TEXT,
  adults             INTEGER DEFAULT 1,
  children_under_10  INTEGER DEFAULT 0,
  children_10_plus   INTEGER DEFAULT 0,
  family_members     INTEGER DEFAULT 0,
  special_requests   TEXT,
  notes              TEXT,
  payment_uid        TEXT,
  payment_status     TEXT,
  registration_fee   NUMERIC,
  id_type            TEXT,
  id_number          TEXT,
  groups             JSONB DEFAULT '[]'::jsonb,
  role               TEXT DEFAULT 'alumni',
  extra              JSONB DEFAULT '{}'::jsonb,    -- safety valve for unknown fields
  created_at         TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS alumni_email_lower_uk
  ON alumni (LOWER(email));
CREATE INDEX IF NOT EXISTS alumni_registered_idx
  ON alumni (is_registered);

-- ─── users (auth) ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         TEXT PRIMARY KEY,
  email      TEXT NOT NULL,
  password   TEXT NOT NULL,                        -- TODO: migrate to bcrypt
  alumni_id  TEXT REFERENCES alumni(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'alumni',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_uk
  ON users (LOWER(email));
CREATE INDEX IF NOT EXISTS users_alumni_id_idx ON users (alumni_id);

-- ─── announcements (public banner) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS announcements (
  id         TEXT PRIMARY KEY,
  title      TEXT,
  message    TEXT,
  level      TEXT,                                 -- info | warn | success
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── rsvps (public RSVP form) ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rsvps (
  id              TEXT PRIMARY KEY,
  full_name       TEXT,
  email           TEXT,
  branch          TEXT,
  family_joining  TEXT,
  food_preference TEXT,
  volunteer       BOOLEAN DEFAULT FALSE,
  submitted_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── orders (merch) ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id         TEXT PRIMARY KEY,
  user_id    TEXT,                                 -- alumni id; 'guest' allowed
  items      JSONB NOT NULL,                       -- line items: variable shape
  total      NUMERIC,
  status     TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders (user_id);

-- ─── itineraries (per-user picked event ids) ─────────────────────────────
CREATE TABLE IF NOT EXISTS itineraries (
  id                 TEXT PRIMARY KEY,
  user_id            TEXT,
  selected_event_ids JSONB DEFAULT '[]'::jsonb,
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS itineraries_user_id_idx ON itineraries (user_id);

-- ─── rooming ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rooming (
  id          TEXT PRIMARY KEY,
  alumni_id   TEXT REFERENCES alumni(id) ON DELETE SET NULL,
  room_number TEXT,
  hotel       TEXT,
  check_in    TEXT,
  check_out   TEXT,
  occupants   JSONB DEFAULT '[]'::jsonb,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS rooming_alumni_id_idx ON rooming (alumni_id);

-- ─── travel_items ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS travel_items (
  id                  TEXT PRIMARY KEY,
  alumni_id           TEXT REFERENCES alumni(id) ON DELETE CASCADE,
  category_id         TEXT,
  title               TEXT,
  fields              JSONB DEFAULT '{}'::jsonb,   -- form fields vary by category
  visibility          TEXT DEFAULT 'private',      -- private | alumni | specific
  allowed_alumni_ids  JSONB DEFAULT '[]'::jsonb,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS travel_items_alumni_id_idx ON travel_items (alumni_id);
CREATE INDEX IF NOT EXISTS travel_items_visibility_idx ON travel_items (visibility);

-- ─── custom_groups + group_* ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS custom_groups (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  description  TEXT,
  category     TEXT,
  creator_id   TEXT,                               -- soft-FK; some legacy ids predate alumni
  theme_id     TEXT,
  emoji        TEXT,
  cover_image  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS custom_groups_creator_idx ON custom_groups (creator_id);

-- group_memberships, group_announcements, group_polls: NO FK on group_id —
-- the app also exposes "built-in" branch / hostel groups (e.g. 'grp-mech')
-- that live in the client data files, not the DB. Storing memberships
-- against those ids is intentional, so we keep group_id as a soft reference.
CREATE TABLE IF NOT EXISTS group_memberships (
  id         TEXT PRIMARY KEY,
  group_id   TEXT,
  alumni_id  TEXT,
  joined_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS group_memberships_group_idx  ON group_memberships (group_id);
CREATE INDEX IF NOT EXISTS group_memberships_alumni_idx ON group_memberships (alumni_id);

CREATE TABLE IF NOT EXISTS group_announcements (
  id         TEXT PRIMARY KEY,
  group_id   TEXT,
  author_id  TEXT,
  title      TEXT,
  content    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS group_announcements_group_idx ON group_announcements (group_id);

CREATE TABLE IF NOT EXISTS group_polls (
  id         TEXT PRIMARY KEY,
  group_id   TEXT,
  author_id  TEXT,
  question   TEXT,
  options    JSONB NOT NULL,                       -- [{id, text}, ...]
  votes      JSONB DEFAULT '{}'::jsonb,            -- { voterId: optionId }
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS group_polls_group_idx ON group_polls (group_id);

-- ─── photos (alumni-uploaded gallery) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS photos (
  id            TEXT PRIMARY KEY,
  url           TEXT NOT NULL,                     -- data URL or hosted URL
  caption       TEXT,
  category      TEXT,
  uploader_id   TEXT,                              -- soft-FK
  uploader_name TEXT,
  width         INTEGER,
  height        INTEGER,
  bytes         INTEGER,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS photos_uploader_idx ON photos (uploader_id);
CREATE INDEX IF NOT EXISTS photos_created_at_idx ON photos (created_at DESC);

-- ─── password_resets (forgot-password flow) ──────────────────────────────
-- Only the SHA-256 hash of the reset token is stored, never the raw token.
-- A leak of this table cannot be turned into a working reset link.
CREATE TABLE IF NOT EXISTS password_resets (
  id          SERIAL PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address  TEXT,
  user_agent  TEXT
);
CREATE INDEX IF NOT EXISTS password_resets_user_idx ON password_resets (user_id);
CREATE INDEX IF NOT EXISTS password_resets_token_idx ON password_resets (token_hash);
