// Per-table column maps.
//
// Each entry maps a JSON (camelCase) field name to:
//   - col:  the snake_case column in Postgres
//   - type: 'text' | 'int' | 'numeric' | 'bool' | 'date' | 'timestamptz' | 'jsonb'
//   - readOnly?: true  → never accepted from client payloads (e.g. created_at)
//
// The first entry must be the primary key — `id`. The resource handler relies
// on this to build INSERT / WHERE clauses.

export const tables = {
  alumni: {
    id:                { col: 'id',                 type: 'text' },
    name:              { col: 'name',               type: 'text' },
    email:             { col: 'email',              type: 'text' },
    phone:             { col: 'phone',              type: 'text' },
    batch:             { col: 'batch',              type: 'int'  },
    branch:            { col: 'branch',             type: 'text' },
    rollNumber:        { col: 'roll_number',        type: 'text' },
    hostel:            { col: 'hostel',             type: 'text' },
    currentCity:       { col: 'current_city',       type: 'text' },
    state:             { col: 'state',              type: 'text' },
    company:           { col: 'company',            type: 'text' },
    designation:       { col: 'designation',        type: 'text' },
    avatar:            { col: 'avatar',             type: 'text' },
    registrationId:    { col: 'registration_id',    type: 'text' },
    isRegistered:      { col: 'is_registered',      type: 'bool' },
    travelMode:        { col: 'travel_mode',        type: 'text' },
    arrivalDate:       { col: 'arrival_date',       type: 'text' },
    arrivalTime:       { col: 'arrival_time',       type: 'text' },
    departureDate:     { col: 'departure_date',     type: 'text' },
    departureTime:     { col: 'departure_time',     type: 'text' },
    roomPreference:    { col: 'room_preference',    type: 'text' },
    preferredRoommate: { col: 'preferred_roommate', type: 'text' },
    tshirtSize:        { col: 'tshirt_size',        type: 'text' },
    dietaryPref:       { col: 'dietary_pref',       type: 'text' },
    adults:            { col: 'adults',             type: 'int'  },
    childrenUnder10:   { col: 'children_under_10',  type: 'int'  },
    children10Plus:    { col: 'children_10_plus',   type: 'int'  },
    familyMembers:     { col: 'family_members',     type: 'int'  },
    specialRequests:   { col: 'special_requests',   type: 'text' },
    notes:             { col: 'notes',              type: 'text' },
    paymentUid:        { col: 'payment_uid',        type: 'text' },
    paymentStatus:     { col: 'payment_status',     type: 'text' },
    paymentAmount:     { col: 'payment_amount',     type: 'numeric' },
    paymentNotes:      { col: 'payment_notes',      type: 'text' },
    paymentVerifiedAt: { col: 'payment_verified_at', type: 'timestamptz' },
    paymentVerifiedBy: { col: 'payment_verified_by', type: 'text' },
    registrationFee:   { col: 'registration_fee',   type: 'numeric' },
    idType:            { col: 'id_type',            type: 'text' },
    idNumber:          { col: 'id_number',          type: 'text' },
    groups:            { col: 'groups',             type: 'jsonb' },
    role:              { col: 'role',               type: 'text' },
    extra:             { col: 'extra',              type: 'jsonb' },
    createdAt:         { col: 'created_at',         type: 'timestamptz' },
  },

  users: {
    id:          { col: 'id',          type: 'text' },
    email:       { col: 'email',       type: 'text' },
    password:    { col: 'password',    type: 'text' },
    alumniId:    { col: 'alumni_id',   type: 'text' },
    role:        { col: 'role',        type: 'text' },
    permissions: { col: 'permissions', type: 'jsonb' },
    createdAt:   { col: 'created_at',  type: 'timestamptz' },
  },

  announcements: {
    id:        { col: 'id',         type: 'text' },
    title:     { col: 'title',      type: 'text' },
    message:   { col: 'message',    type: 'text' },
    level:     { col: 'level',      type: 'text' },
    createdAt: { col: 'created_at', type: 'timestamptz' },
  },

  rsvps: {
    id:             { col: 'id',              type: 'text' },
    fullName:       { col: 'full_name',       type: 'text' },
    email:          { col: 'email',           type: 'text' },
    branch:         { col: 'branch',          type: 'text' },
    familyJoining:  { col: 'family_joining',  type: 'text' },
    foodPreference: { col: 'food_preference', type: 'text' },
    volunteer:      { col: 'volunteer',       type: 'bool' },
    submittedAt:    { col: 'submitted_at',    type: 'timestamptz' },
  },

  orders: {
    id:        { col: 'id',         type: 'text' },
    userId:    { col: 'user_id',    type: 'text' },
    items:     { col: 'items',      type: 'jsonb' },
    total:     { col: 'total',      type: 'numeric' },
    status:    { col: 'status',     type: 'text' },
    createdAt: { col: 'created_at', type: 'timestamptz' },
  },

  itineraries: {
    id:               { col: 'id',                  type: 'text' },
    userId:           { col: 'user_id',             type: 'text' },
    selectedEventIds: { col: 'selected_event_ids',  type: 'jsonb' },
    updatedAt:        { col: 'updated_at',          type: 'timestamptz' },
  },

  rooming: {
    id:         { col: 'id',          type: 'text' },
    alumniId:   { col: 'alumni_id',   type: 'text' },
    roomNumber: { col: 'room_number', type: 'text' },
    hotel:      { col: 'hotel',       type: 'text' },
    checkIn:    { col: 'check_in',    type: 'text' },
    checkOut:   { col: 'check_out',   type: 'text' },
    occupants:  { col: 'occupants',   type: 'jsonb' },
    notes:      { col: 'notes',       type: 'text' },
    createdAt:  { col: 'created_at',  type: 'timestamptz' },
  },

  travelItems: {
    id:                { col: 'id',                  type: 'text' },
    alumniId:          { col: 'alumni_id',           type: 'text' },
    categoryId:        { col: 'category_id',         type: 'text' },
    title:             { col: 'title',               type: 'text' },
    fields:            { col: 'fields',              type: 'jsonb' },
    visibility:        { col: 'visibility',          type: 'text' },
    allowedAlumniIds:  { col: 'allowed_alumni_ids',  type: 'jsonb' },
    createdAt:         { col: 'created_at',          type: 'timestamptz' },
    updatedAt:         { col: 'updated_at',          type: 'timestamptz' },
  },

  customGroups: {
    id:          { col: 'id',          type: 'text' },
    name:        { col: 'name',        type: 'text' },
    description: { col: 'description', type: 'text' },
    category:    { col: 'category',    type: 'text' },
    creatorId:   { col: 'creator_id',  type: 'text' },
    themeId:     { col: 'theme_id',    type: 'text' },
    emoji:       { col: 'emoji',       type: 'text' },
    coverImage:  { col: 'cover_image', type: 'text' },
    createdAt:   { col: 'created_at',  type: 'timestamptz' },
  },

  groupMemberships: {
    id:        { col: 'id',         type: 'text' },
    groupId:   { col: 'group_id',   type: 'text' },
    alumniId:  { col: 'alumni_id',  type: 'text' },
    joinedAt:  { col: 'joined_at',  type: 'timestamptz' },
  },

  groupAnnouncements: {
    id:        { col: 'id',         type: 'text' },
    groupId:   { col: 'group_id',   type: 'text' },
    authorId:  { col: 'author_id',  type: 'text' },
    title:     { col: 'title',      type: 'text' },
    content:   { col: 'content',    type: 'text' },
    createdAt: { col: 'created_at', type: 'timestamptz' },
  },

  groupPolls: {
    id:        { col: 'id',         type: 'text' },
    groupId:   { col: 'group_id',   type: 'text' },
    authorId:  { col: 'author_id',  type: 'text' },
    question:  { col: 'question',   type: 'text' },
    options:   { col: 'options',    type: 'jsonb' },
    votes:     { col: 'votes',      type: 'jsonb' },
    createdAt: { col: 'created_at', type: 'timestamptz' },
  },

  photos: {
    id:           { col: 'id',            type: 'text' },
    url:          { col: 'url',           type: 'text' },
    caption:      { col: 'caption',       type: 'text' },
    category:     { col: 'category',      type: 'text' },
    uploaderId:   { col: 'uploader_id',   type: 'text' },
    uploaderName: { col: 'uploader_name', type: 'text' },
    width:        { col: 'width',         type: 'int' },
    height:       { col: 'height',        type: 'int' },
    bytes:        { col: 'bytes',         type: 'int' },
    createdAt:    { col: 'created_at',    type: 'timestamptz' },
  },
};

// resource URL → SQL table name (snake_case)
export const sqlTable = {
  alumni:             'alumni',
  users:              'users',
  announcements:      'announcements',
  rsvps:              'rsvps',
  orders:             'orders',
  itineraries:        'itineraries',
  rooming:            'rooming',
  travelItems:        'travel_items',
  customGroups:       'custom_groups',
  groupMemberships:   'group_memberships',
  groupAnnouncements: 'group_announcements',
  groupPolls:         'group_polls',
  photos:             'photos',
};

// Cast a JS value to the right type for a SQL column. Used by both the
// resource handler (writes) and the import script.
export function coerce(value, type) {
  if (value === null || value === undefined || value === '') {
    // Empty string → NULL for non-text columns. Text columns keep ''.
    return type === 'text' ? value ?? null : null;
  }
  switch (type) {
    case 'int':         return Number.parseInt(value, 10);
    case 'numeric':     return Number(value);
    case 'bool':        return Boolean(value) && value !== 'false' && value !== 0;
    case 'jsonb':       return typeof value === 'string' ? value : JSON.stringify(value);
    case 'date':
    case 'timestamptz': return value; // pg accepts ISO strings & Date directly
    case 'text':
    default:            return String(value);
  }
}

// Build the JS object returned to API clients from a SQL row, using the
// column map (snake_case → camelCase + JSONB unwrap).
export function rowToJson(table, row) {
  if (!row) return null;
  const map = tables[table];
  const out = {};
  for (const [field, def] of Object.entries(map)) {
    const v = row[def.col];
    if (v === undefined) continue;
    // node-pg returns JSONB columns already parsed when using its default
    // type parsers, so no JSON.parse needed here.
    out[field] = v;
  }
  return out;
}
