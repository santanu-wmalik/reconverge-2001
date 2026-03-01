export const giveBackInitiatives = [
  {
    id: 'init-001',
    title: 'Dedicated Plaza / Common Space',
    description: 'A tangible, lasting legacy on the NIT Calicut campus — a dedicated plaza or common space designed and funded exclusively by the Class of 2001. Unlike labs which tend to become "invisible" over time, this will be a visible, actively-used space that students and faculty will associate with our batch for generations.',
    status: 'planning',
    icon: '🏛️',
    details: [
      'Stone laying ceremony planned during reunion weekend',
      'Firoz (currently at NIT Calicut) is the key contact',
      'Precedent: 97th Avenue at NIT Calicut (built by previous batches)',
      'Design to include seating areas and interaction spaces',
    ],
  },
  {
    id: 'init-002',
    title: 'Memorial for Departed Batchmates',
    description: 'A dedicated memorial honoring batchmates who are no longer with us. This will be thoughtfully integrated into the plaza/common space project, ensuring their names and legacy live on permanently at our alma mater.',
    status: 'planning',
    icon: '🕯️',
    details: [
      'Integrated into the campus plaza design',
      'Named in memory of our departed batchmates',
      'A permanent tribute on campus grounds',
    ],
  },
  {
    id: 'init-003',
    title: 'Supporting Staff Assistance',
    description: 'A heartfelt program to support the non-teaching and supporting staff at NIT Calicut — the people who were part of our everyday campus life during 1997-2001. This idea was inspired by advice from our senior batch.',
    status: 'discussion',
    icon: '🤲',
    details: [
      'Recommended by the senior batch (Class of 2000)',
      'Focus on support staff who served during our batch years',
      'Details to be finalized by the Giving Back Committee',
    ],
  },
  {
    id: 'init-004',
    title: 'Silver Jubilee Endowment Fund',
    description: 'Contributions to the existing Silver Jubilee Endowment Fund at NITC. This is an established fund that saves the overhead of creating new financial instruments — our contributions go directly to campus development.',
    status: 'active',
    icon: '🏅',
    details: [
      'Existing fund — no additional paperwork needed',
      'Administered through NITC alumni relations',
      'Separate from the reunion registration fee',
    ],
    link: 'https://nitc.ac.in/alumni-relations',
  },
];

export const impactStories = [
  { id: 'story-001', title: '97th Avenue — A Precedent', excerpt: 'Previous batches at NIT Calicut have already built lasting campus spaces. The 97th Avenue stands as a testament to what alumni giving can achieve — a vibrant space actively used by students daily.', image: 'https://placehold.co/400x300/1e3a5f/d4a843?text=97th+Ave', date: '2026-02-16' },
  { id: 'story-002', title: 'Senior Batch Wisdom', excerpt: 'The Class of 2000 generously shared their reunion and giving-back experience, emphasizing tangible, visible contributions over infrastructure that fades from view.', image: 'https://placehold.co/400x300/28a745/ffffff?text=Seniors', date: '2026-01-19' },
];

export const volunteerOpportunities = [
  { id: 'vol-001', title: 'Giving Back Committee Member', description: 'Join the GBC to help plan and execute our campus legacy projects.', date: '2026-12-27', spotsTotal: 5, spotsFilled: 0, skills: ['Coordination'] },
  { id: 'vol-002', title: 'Campus Liaison', description: 'Help coordinate with NIT Calicut administration for the plaza project.', date: '2026-12-27', spotsTotal: 3, spotsFilled: 1, skills: ['Local Presence'] },
  { id: 'vol-003', title: 'Design & Planning', description: 'Help with the design and layout of the batch plaza/common space.', date: '2026-12-27', spotsTotal: 4, spotsFilled: 0, skills: ['Design', 'Architecture'] },
];

// Keep for backward compatibility
export const campaigns = giveBackInitiatives;
export const mentorshipAreas = ['Software Engineering', 'Data Science & AI', 'Product Management', 'Entrepreneurship', 'Finance', 'Research', 'Manufacturing', 'Design'];
