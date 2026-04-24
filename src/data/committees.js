// Committee data sourced verbatim from the xlsx "Committee Roster" sheet.
// Committees with no named lead in the sheet are shown as "Lead TBD —
// volunteer needed". Members lists reflect the sheet's columns exactly.

export const committees = [
  {
    id: 'occ',
    name: 'Overall Coordination Committee',
    shortName: 'OCC',
    emoji: '🎯',
    lead: 'Shyam Nandan',
    coLead: 'Rajasimha Karanam',
    members: ['Robin V'],
    description: 'Master planning, coordination across committees, final decisions.',
  },
  {
    id: 'rc',
    name: 'Registration Committee',
    shortName: 'RC',
    emoji: '📋',
    lead: 'Robin V',
    members: ['Prith Burman'],
    description: 'Alumni list, registration, rooming, travel coordination.',
  },
  {
    id: 'fc',
    name: 'Finance Committee',
    shortName: 'FC',
    emoji: '💰',
    lead: 'Shyam (tentative)',
    members: [],
    description: 'Budget, bank account, payments, audit, financial reporting.',
  },
  {
    id: 'mcc',
    name: 'Marketing & Communication Committee',
    shortName: 'MCC',
    emoji: '📢',
    lead: 'Sharmishta',
    coLead: 'Rajasimha Karanam',
    members: ['Sunder', 'Anuratha'],
    description: 'Communications, branding, AV content, social media, info packs.',
  },
  {
    id: 'afc',
    name: 'Stay & Food Committee',
    shortName: 'AFC',
    emoji: '🏨',
    lead: 'Lead TBD — volunteer needed',
    members: [],
    description: 'Hotels, F&B, transport, logistics.',
  },
  {
    id: 'ec',
    name: 'Entertainment Committee',
    shortName: 'EC',
    emoji: '🎭',
    lead: 'Lead TBD — volunteer needed',
    members: [],
    description: 'Program design, artists, event manager, campus coordination.',
  },
  {
    id: 'sc',
    name: 'Sponsorship Committee',
    shortName: 'SC',
    emoji: '🤝',
    lead: 'Lead TBD — volunteer needed',
    members: [],
    description: 'Corporate sponsorships, outreach, benefits management.',
  },
  {
    id: 'gbc',
    name: 'Giving Back Committee',
    shortName: 'GBC',
    emoji: '🎁',
    lead: 'Santanu Malik',
    members: [],
    description: 'NITC liaison, giving-back project selection and execution. Current focus: rallying the batch behind NITCAA\u2019s flagship Health Centre project (Susrutha Swastya Kendram).',
  },
  {
    id: 'br',
    name: 'Branch Representatives',
    shortName: 'BR',
    emoji: '🏛️',
    lead: null,
    members: [],
    description: 'Branch-wise outreach, state-wise champions.',
  },
];

// Branch representatives per the xlsx "Committee Roster" sheet.
// Architecture and Electronics slots are genuinely open in the source.
export const branchRepresentatives = [
  { branch: 'Architecture', reps: [], status: 'open', whatsAppSize: null, notes: 'Volunteers needed' },
  { branch: 'Civil Engineering', reps: ['Sinu Philip', 'Suhailah'], status: 'active', whatsAppSize: null, notes: 'Group already existed before the reunion drive' },
  { branch: 'Computer Science & Engineering', reps: ['Prithwi', 'Rajasimha'], status: 'active', whatsAppSize: '~40% added', notes: 'Group created Jan 23' },
  { branch: 'Electronics & Communication', reps: [], status: 'open', whatsAppSize: '~23 members', notes: 'Group active; named branch reps still needed' },
  { branch: 'Electrical & Electronics', reps: ['Rinchen', 'Anu', 'Sundar'], status: 'active', whatsAppSize: '~50 members', notes: 'Group already existed' },
  { branch: 'Mechanical Engineering', reps: ['Mathew Thomas', 'Arun V'], status: 'active', whatsAppSize: '17+ members', notes: 'Group existed; adding more members' },
  { branch: 'Production Engineering', reps: ['Nitish', 'Hari'], status: 'active', whatsAppSize: '13 members', notes: 'Group created Jan 23' },
];

// "State Champions" section exists in the xlsx but is still unpopulated.
// Leave empty rows so the UI shows open slots rather than fabricated names.
export const stateChampions = [
  { state: 'Karnataka (Bangalore)', champions: [], status: 'open', note: '' },
  { state: 'Kerala (in-state)', champions: [], status: 'open', note: 'Needed for campus runs, bank work, NITCAA liaison' },
  { state: 'Tamil Nadu (Chennai / Coimbatore)', champions: [], status: 'open', note: '' },
  { state: 'Maharashtra (Mumbai / Pune)', champions: [], status: 'open', note: '' },
  { state: 'Telangana (Hyderabad)', champions: [], status: 'open', note: '' },
  { state: 'Delhi NCR', champions: [], status: 'open', note: '' },
  { state: 'USA', champions: [], status: 'open', note: '' },
  { state: 'UK / Europe', champions: [], status: 'open', note: 'Timezone rotation for sync calls' },
  { state: 'Singapore / APAC', champions: [], status: 'open', note: '' },
];
