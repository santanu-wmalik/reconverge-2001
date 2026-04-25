// Townhall sessions. Sourced from the Google Meet invites posted in the
// volunteers WhatsApp group on 19 Apr 2026 by Rajasimha Karanam.
//
// Add a `recordingUrl` (plus `recordingNotes`) to each session once the
// recording is published. Future townhalls should be appended to the array.

export const townhalls = [
  {
    id: 'townhall-apr25-s1',
    title: 'REConverge \u201926 — Townhall Session 1',
    session: 'Session 1 of 2',
    tagline: 'T-250 — first batch-wide sync across time zones',
    date: '2026-04-25',
    startTime: '20:00',
    endTime: '21:00',
    timezone: 'Asia/Kolkata (IST)',
    regionHint: 'India / APAC friendly · Saturday evening',
    organiser: 'Rajasimha Karanam',
    meet: {
      url: 'https://meet.google.com/ttm-wcrv-biv',
      dialInCountry: 'US',
      dialIn: '+1 304-568-3185',
      pin: '379 585 853',
      morePhones: 'https://tel.meet/ttm-wcrv-biv?pin=3909111764135',
    },
    agenda: [
      'Title & logo reveal (title only at this session)',
      'Intro video of memory pictures',
      'Website walkthrough',
      'Run order of the two reunion days',
      'Giveback — NITCAA (Santanu)',
      'Budget and registration costs',
      'Open floor Q&A',
    ],
    recordingUrl: 'https://drive.google.com/file/d/1lQ1X7XQDvkx9c_du151UGke2nU9GHwZW/view',
    recordingEmbedUrl: 'https://drive.google.com/file/d/1lQ1X7XQDvkx9c_du151UGke2nU9GHwZW/preview',
    transcriptUrl: null,
    recordingNotes: 'Full session recording — plays inline below.',
  },
  {
    id: 'townhall-apr26-s2',
    title: 'REConverge \u201926 — Townhall Session 2',
    session: 'Session 2 of 2',
    tagline: 'US / Europe friendly slot — same agenda, different time',
    date: '2026-04-26',
    startTime: '10:00',
    endTime: '11:00',
    timezone: 'Asia/Kolkata (IST)',
    regionHint: 'US / Europe friendly · Sunday morning IST',
    organiser: 'Rajasimha Karanam',
    meet: {
      url: 'https://meet.google.com/ngz-gfeu-ctx',
      dialInCountry: 'US',
      dialIn: '+1 216-930-8789',
      pin: '354 359 490',
      morePhones: 'https://tel.meet/ngz-gfeu-ctx?pin=2675379885571',
    },
    agenda: [
      'Title & logo reveal (title only at this session)',
      'Intro video of memory pictures',
      'Website walkthrough',
      'Run order of the two reunion days',
      'Giveback — NITCAA (Santanu)',
      'Budget and registration costs',
      'Open floor Q&A',
    ],
    recordingUrl: null,
    recordingNotes: 'Auto-record enabled on the Meet invite; recording will be posted here after the session.',
  },
];
