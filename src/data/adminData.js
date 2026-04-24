// Admin-only data, kept strictly aligned with verifiable sources:
//   - chats      : Backup/Volunteer chats.txt (line references in comments)
//   - xlsx       : Backup/REConverge '26.xlsx (sheet names in comments)
//   - give-back  : Backup/Give-Back/* (docx + posters)
// Any field that has no source is either omitted or set to null so the UI can
// render a placeholder instead of a made-up value.

export const planningLog = [
  {
    id: 'pl-001',
    date: '2026-01-19',
    title: 'Senior Batch (Class of 2000) Shared Planning Learnings',
    summary: 'Detailed write-up received from a Class of 2000 finance-committee member covering the full arc of reunion planning.',
    internalNotes: 'Key takeaways: pick the most enthusiastic AND committed people to lead; co-ordination is the hardest part; involve batchmates still associated with REC.',
    actionItems: ['Circulate the learnings document to all volunteers', 'Identify batchmates still connected to REC'],
    status: 'completed',
  },
  {
    id: 'pl-002',
    date: '2026-01-20',
    title: 'Branch WhatsApp Group Creation Drive',
    summary: 'Initiated creation of WhatsApp groups for all 7 branches. Master contact sheet created.',
    internalNotes: 'Civil and Mech groups already existed; new ones created for CS, ECE, EEE, Prod and Arch. Missing alumni flagged during outreach: Sen Fernandez (Mech) and Sujeet Kumar Sinha (Mech).',
    actionItems: ['Create the remaining branch groups', 'Add an "initial contact" column to the master sheet', 'Cross-check class photos from the final-year magazine'],
    status: 'completed',
  },
  {
    id: 'pl-003',
    date: '2026-01-23',
    title: 'All 7 Branch Groups Confirmed Active',
    summary: 'Architecture (still being set up), Civil (existed), CS (~40% added), ECE (~23 members), EEE (~50 members), Mech (17+), Prod (13).',
    internalNotes: 'ECE: Rajeev Bhaskar reached out via Krishnaraj. EEE: existing group already had ~50 members.',
    actionItems: ['Find an Architecture volunteer', 'Continue adding members to every branch group'],
    status: 'completed',
  },
  {
    id: 'pl-004',
    date: '2026-01-24',
    title: 'Event Naming & Committee Structure Formalised',
    summary: 'Multiple names brainstormed. 9-committee structure established with written descriptions.',
    internalNotes: 'Names considered: REC…REATE, REC…ONFLUENCE, REC…ALL, REC…INDLE, REC…ONVERGE, Bandhan, Milan, Punarmilan. "REConnect" was already used by the senior batch. Committee descriptions published for OCC, RC, FC, MCC, AFC, EC, SC, GBC and Branch Reps.',
    actionItems: ['Run the event-name voting poll', 'Get 5+ volunteers per committee'],
    status: 'completed',
  },
  {
    id: 'pl-005',
    date: '2026-01-26',
    title: 'Event Name Selected: REConverge',
    summary: 'WhatsApp poll conducted across the wider group. REConverge emerged as the chosen name.',
    internalNotes: 'Final name: REConverge 2001 — "2001" is the batch/class identifier, not the event year.',
    actionItems: ['Update branding across all channels'],
    status: 'completed',
  },
  {
    id: 'pl-006',
    date: '2026-01-25',
    title: 'Committee Descriptions Published',
    summary: 'Detailed descriptions of all 9 committee roles shared. Target: minimum 5 members per committee.',
    internalNotes: 'Volunteer requirements captured by the senior batch: 2 per branch (1M, 1F preferred), 2-3 from the Calicut area for bank / college runs, at least one currently at REC, plus women reps.',
    actionItems: ['Each volunteer to recruit from their branch', 'Fill branch-rep positions'],
    status: 'completed',
  },
  {
    id: 'pl-007',
    date: '2026-01-30',
    title: 'Meeting #2 Prep — Agenda Set',
    summary: 'Agenda: finalise volunteers, tentative budget, detailed programme for the 2 days.',
    internalNotes: 'Calendar invite sent via Google Meet (code: ksg-bhhq-qyw), Saturday 9:30pm IST.',
    actionItems: ['Send calendar invites', 'Prepare budget estimates'],
    status: 'completed',
  },
  {
    id: 'pl-008',
    date: '2026-01-31',
    title: 'Meeting #2 Outcomes — Financial & Governance Decisions',
    summary: 'Key decisions: use the existing Silver Jubilee Endowment Fund at NITC (saves paperwork); remove sensitive data from shared sheets; set a rotating global meeting schedule.',
    internalNotes: 'Endowment info shared by Ajay Gopalakrishnan (nitc.ac.in/alumni-relations). Rotating schedule — Seattle 7am / CET 4pm / India 8:30pm / Perth 11pm. Shared sheets now read-only for non-volunteers.',
    actionItems: ['Shift the default meeting one hour earlier', 'Stand up the sub-committees', 'Push through the bank-account setup'],
    status: 'completed',
  },
  {
    id: 'pl-009',
    date: '2026-02-01',
    title: 'Branch Representatives Assigned',
    summary: 'Reps finalised for 5 branches. ECE and Architecture still open.',
    internalNotes: 'Civil: Sinu & Suhailah; CS: Prithwi & Rajasimha; EEE: Richen, Anu & Sundar; Prod: Nitish & Hari; Mech: Mathew & Robin. Yagya Dutt (junior, trip organiser) recommended for post-event Kerala tour planning.',
    actionItems: ['Fill ECE and Architecture rep positions', 'Reach out to Yagya Dutt for Kerala tour options'],
    status: 'in_progress',
  },
  {
    id: 'pl-010',
    date: '2026-02-16',
    title: 'Giving Back — Plaza Idea Introduced',
    summary: 'Firoz (currently at NIT Calicut) suggested a dedicated plaza / common space as the batch\u2019s visible legacy rather than a lab.',
    internalNotes: 'Firoz = Mohammed Firoz Challappurath. Precedent referenced: 97th Avenue at NITC built by previous batches. Shyam proposed naming the space as a memorial for departed batchmates. Senior batch also recommended a programme for the supporting staff.',
    actionItems: ['Follow up with Firoz on concept + costing', 'Compile the list of departed batchmates for the memorial segment'],
    status: 'in_progress',
  },
  {
    id: 'pl-011',
    date: '2026-02-26',
    title: 'Banking & Website Progress',
    summary: 'Bank-account work advanced. Website launch announced.',
    internalNotes: 'Banks visited: Axis (responded), ICICI (no response), HDFC (no response). Mahroof (Civil, Calicut-based) working with SBI on the NITC campus. Account will open as an Association of Persons (unregistered committee) — needs seal and letterhead. Vinu Joseph (EEE, DGM at SBI) offered to lead the Finance Committee.',
    actionItems: ['Close bank-account setup at SBI CREC', 'Launch the website at the next volunteers meeting', 'Onboard Vinu Joseph to the Finance Committee'],
    status: 'in_progress',
  },
  {
    id: 'pl-012',
    date: '2026-02-28',
    title: 'Website Draft Review & Strategic Pivot',
    summary: 'Website (reconverge-2001.in) shared for review. Shift proposed from "wait for volunteers on calls" to direct task-assignment.',
    internalNotes: 'Rajasimha and Shrinath paired up on the website build. Low meeting attendance prompted the shift — a core group will follow up on assigned tasks. Critical path: bank account → registration → everything else.',
    actionItems: ['Collect website feedback from volunteers', 'Assign open tasks to specific individuals', 'Follow up on bank account'],
    status: 'in_progress',
  },
  {
    id: 'pl-013',
    date: '2026-03-06',
    title: 'Accessibility Raised',
    summary: 'Batchmate on a wheelchair flagged the need for wheelchair-friendly access at the campus venue.',
    internalNotes: 'Volunteer group committed to keeping accessibility on top of mind across venue, stage and transport planning.',
    actionItems: ['Check campus accessibility with NITCAA', 'Plan temporary ramps / marshal support if needed'],
    status: 'in_progress',
  },
  {
    id: 'pl-014',
    date: '2026-03-08',
    title: 'NITCAA Routing Mandate Clarified',
    summary: 'College mandates that every Give Back contribution flows through the NITCAA account. NITCAA chooses the target project from its active pipeline.',
    internalNotes: 'The senior batch transferred contributions directly to NITCAA and tracked them on a shared spreadsheet. International donors can use the Benevity portal for tax benefits.',
    actionItems: ['Schedule a meeting with the NITCAA coordinator', 'Align the batch behind NITCAA\u2019s selected project'],
    status: 'completed',
  },
  {
    id: 'pl-015',
    date: '2026-03-11',
    title: 'Gokulam Grand Formal Quote Received',
    summary: 'Gokulam Grand Calicut shared room + banquet rates for the REConverge block.',
    internalNotes: 'Anchor quote: 52-room block across 4 categories (Deluxe, Superior, Suite, Grand Suite) + Manachira rooftop for the Gala.',
    actionItems: ['Finalise room-block confirmation', 'Lock Gala menu tier'],
    status: 'in_progress',
  },
  {
    id: 'pl-016',
    date: '2026-03-14',
    title: 'Mid-March Bi-Weekly — Red Callout',
    summary: 'Low attendance triggered a formal red callout: need at least 4 more volunteers to take ownership of slipping tasks.',
    internalNotes: 'Decision: assign tasks directly to named individuals going forward rather than waiting for people to step up on calls.',
    actionItems: ['Assign at least 4 owners for slipping tasks', 'Increase bi-weekly attendance'],
    status: 'in_progress',
  },
  {
    id: 'pl-017',
    date: '2026-03-16',
    title: 'Taj Calicut Ruled Out',
    summary: 'Taj Calicut confirmed it is going into a year-plus renovation starting April 2026 and won\u2019t be operational during our window.',
    internalNotes: 'Alternate hotels being evaluated alongside Gokulam Grand; Dimora (alcohol-free) also in the mix.',
    actionItems: ['Close the hotel shortlist with AFC'],
    status: 'completed',
  },
  {
    id: 'pl-018',
    date: '2026-03-22',
    title: 'NITC ICAR Office Engaged',
    summary: 'Dean, International, Alumni & Corporate Relations (ICAR) office confirmed happy to host the Silver Jubilee. NITCAA and Alumni Relations Office looped in.',
    internalNotes: 'A Teams meeting requested; pre-meeting Q&A drafted in the "Agenda for ICAR meeting" tab of the planning sheet.',
    actionItems: ['Lock a Teams-meeting slot', 'Finalise the list of questions for the institute'],
    status: 'in_progress',
  },
  {
    id: 'pl-019',
    date: '2026-03-28',
    title: 'Productive Bi-Weekly — Order of Events Finalised',
    summary: 'Well-attended sync that locked the proposed order of events. Group booking rates received from 3 Calicut hotels.',
    internalNotes: 'Feedback consolidated on the shared sheet. AFC continues to chase more quotes.',
    actionItems: ['Close hotel comparison', 'Publish the finalised programme'],
    status: 'in_progress',
  },
  {
    id: 'pl-020',
    date: '2026-03-29',
    title: 'First Townhall Date Set — T-minus 250',
    summary: 'ICAR meeting moved from 3 Apr (Good Friday) to 2 Apr. First batch-wide townhall set for Sunday 26 Apr 2026 — T-250 days.',
    internalNotes: 'Townhall will be split across two time-friendly sessions to cover every region.',
    actionItems: ['Announce the townhall', 'Prepare townhall agenda & speakers'],
    status: 'in_progress',
  },
  {
    id: 'pl-021',
    date: '2026-04-01',
    title: 'Gokulam 52-Room Block Secured + Save-the-Date',
    summary: 'Gokulam\u2019s ₹50k block advance was substituted by 4 volunteers taking individual rooms totalling the same amount. Save-the-Date announcement went out on the WhatsApp announcements channel.',
    internalNotes: 'Workaround needed because the bank account was still a few weeks out. Booking.com "Genius" rates were being compared — AFC confirmed group rates guarantee inventory at the agreed price.',
    actionItems: ['Continue collecting individual room bookings until all 52 rooms are held'],
    status: 'in_progress',
  },
  {
    id: 'pl-022',
    date: '2026-04-02',
    title: 'NITCAA Meeting — Positive Alignment on Giving Back',
    summary: 'The long-awaited NITCAA meeting happened at 10 AM IST. Volunteers reported it as "full of energy" and "lot of positives". Alignment on using NITCAA\u2019s flagship project as the Give Back target.',
    internalNotes: 'The flagship is the new Health Centre on campus — Susrutha Swastya Kendram. 80G for Indian donors, FCRA route for international donors, Wall of Honor for individual contributions of ₹1 lakh+.',
    actionItems: ['Roll out the Give Back comms on the website', 'Publish UPI + bank + FCRA channels'],
    status: 'completed',
  },
  {
    id: 'pl-023',
    date: '2026-04-18',
    title: 'Website Scope Locked (Admin + User Persona)',
    summary: 'Robin articulated what the website should own as the source of truth: running order of events, registration flow, and the accommodation page.',
    internalNotes: 'Admin view: events description/venue/date/time/POC, registration journey tracker, hotel listings with discount codes. User view: personal itineraries, Payment UID / Give Back UID / guest registration / memorabilia.',
    actionItems: ['Close the website scope for the townhall'],
    status: 'in_progress',
  },
  {
    id: 'pl-024',
    date: '2026-04-19',
    title: 'Batch-Wide Townhalls Formally Scheduled',
    summary: 'Two sessions announced: Sat 25 Apr 8-9pm IST and Sun 26 Apr 10-11am IST. Auto-record enabled; no approval needed to join.',
    internalNotes: 'Draft agenda: title & logo reveal · intro video · website walkthrough · two-day run order · Giveback-NITCAA (Santanu) · budget & registration costs · open Q&A.',
    actionItems: ['Lock townhall agenda with speakers', 'Record minutes and follow-ups'],
    status: 'in_progress',
  },
  {
    id: 'pl-025',
    date: '2026-04-23',
    title: 'Logo Commissioned to a Batchmate',
    summary: 'Vipin Chandran (from the batch) will design the event logo and T-shirt. Reveal will be after the townhall — it won\u2019t be rushed for this weekend.',
    internalNotes: 'Decision: announce only the title at the townhall and reveal the logo a week later once finalised.',
    actionItems: ['Freeze logo brief with Vipin', 'Plan the logo reveal comms'],
    status: 'in_progress',
  },
];

// Budget v1 from the xlsx "Budget v1 Template" sheet — under review by the
// Finance Committee (Shyamnandan T). Numbers are planning estimates for 350
// attendees (200 alumni + ~150 family). The registration fee (₹12,500) is
// locked; line-item amounts are working estimates pending FC sign-off.
export const budgetSummary = {
  assumedAlumniCount: 200,
  assumedFamilyPerAlumni: 0.75,
  totalEstimate: 3105000,       // ₹31.05 L
  perAlumniEstimate: 13650,     // ₹13,650 per alumni
  contingencyAmount: 500000,     // 5-10% buffer
  registrationFee: 12500,
  familyMemberFee: 2500,
  status: 'v1 draft — pending Finance Committee sign-off',
};

export const budgetItems = [
  { category: 'Registration', item: 'Per person registration', amount: 12500, notes: 'Covers Gala dinner, Sadhya lunch on campus, souvenir kit, campus day activities. Locked.' },
  { category: 'Registration', item: 'Additional family member', amount: 2500, notes: 'Per partner / child / parent. Locked.' },

  { category: 'Food & Beverage', item: 'Day 1 dinner buffet', amount: 280000, notes: '₹800/pax × 350 — includes hall reservation.' },
  { category: 'Food & Beverage', item: 'Day 2 Gala dinner (Gokulam)', amount: 420000, notes: '₹1,200/pax × 350 — multi-cuisine, live counters; drinks built into cost (senior advice to avoid separate bar).' },
  { category: 'Food & Beverage', item: 'High-tea, snacks, water (all days)', amount: 105000, notes: '₹300/pax × 350.' },
  { category: 'Food & Beverage', item: 'Day 2 campus lunch (Sadhya)', amount: 0, notes: 'Provided by NITCAA — confirmed (xlsx Sheet 6). No batch spend.' },
  { category: 'Food & Beverage', item: 'Day 3 breakfast/brunch', amount: 0, notes: 'Included in hotel room package.' },

  { category: 'Event Management', item: 'Event company (OVIO / Ishas) — full service', amount: 850000, notes: 'Décor, stage, sound, lights, batch-photo rig, Day-1 band, Day-2 DJ, campus procession, photography/video — all rolled in.' },

  { category: 'Merchandise & Souvenirs', item: 'T-shirts (alumni + families)', amount: 140000, notes: '₹400 × 350. Souvenir kit: T-shirt, REC-lingo tote, ID card, hangover kit, Mallu snacks, playlist QR.' },
  { category: 'Merchandise & Souvenirs', item: 'Badges, lanyards, kits', amount: 70000, notes: '₹200 × 350 — simple name tags to start.' },
  { category: 'Merchandise & Souvenirs', item: 'Program booklets, signage', amount: 75000, notes: 'Printed programme + venue signage.' },

  { category: 'Transport', item: 'Airport / rail pickups and drop-offs', amount: 140000, notes: '₹1,500 × 93 trips — staggered Dec 27 arrivals and Dec 29 departures.' },
  { category: 'Transport', item: 'Campus shuttle buses (Day 2)', amount: 150000, notes: '5 × 44-seater buses × ₹15,000 — confirmed in the EM quote.' },

  { category: 'NITC Campus', item: 'Auditorium usage, campus permissions', amount: 100000, notes: 'Through NITCAA / ICAR office.' },
  { category: 'NITC Campus', item: 'Support-staff gratitude', amount: 100000, notes: 'Planned upfront per senior-batch recommendation; final figure being checked with seniors.' },

  { category: 'Miscellaneous', item: 'Contingency and buffer (~10%)', amount: 500000, notes: 'Unforeseen expenses.' },

  { category: 'Audit & Admin', item: 'CA audit fees', amount: 50000, notes: 'Identified from day zero.' },
  { category: 'Audit & Admin', item: 'Bank charges, admin', amount: 25000, notes: 'Reunion bank account operating costs.' },

  { category: 'Accommodation', item: 'Gokulam Grand room block (52 rooms)', amount: null, notes: 'Paid directly to the hotel — outside the reunion budget. Deluxe ₹6-7k / Superior ₹9-10k / Suite ₹12k / Grand Suite ₹13k + GST per night.' },
  { category: 'Accommodation', item: 'Gala banquet — Manachira rooftop', amount: null, notes: 'Menu tiers: ₹1,150 / ₹1,300 / ₹1,400 per person + 18% GST. Included in the Day-2 Gala line above as catering-inclusive; banquet hall itself blocked via hotel advance.' },

  { category: 'Giving Back', item: 'NITCAA Health Centre (Susrutha Swastya Kendram)', amount: null, notes: 'Flagship Give Back target. SEPARATE from the reunion budget — contributions flow through the NITCAA account.' },
];

// Sources: chat log 2/16 (Axis/ICICI/HDFC outreach), 2/26 (Mahroof/SBI, account
// holders, Vinu Joseph), xlsx MoM tab (Association-of-Persons structure).
export const bankingStatus = {
  status: 'in_progress',
  type: 'Association of Persons (Unregistered Committee)',
  attempts: [
    { bank: 'Axis Bank', status: 'responded', notes: 'Provided the required documents' },
    { bank: 'ICICI Bank', status: 'no_response', notes: 'Visited — no response' },
    { bank: 'HDFC Bank', status: 'no_response', notes: 'Visited — no response' },
    { bank: 'SBI (NITC Campus)', status: 'in_progress', notes: 'Mahroof working with the branch. Needs seal + letterhead.' },
  ],
  accountHolders: ['Shyam', 'Mahroof'],
  financeHead: 'Vinu Joseph (EEE) — DGM at SBI (proposed)',
};

// Branch outreach — totalEstimate / percentage were fabricated earlier.
// Removed. Only the WhatsApp group size numbers that volunteers reported in the
// chat log are kept. Reps align with the xlsx Committee Roster sheet + chat 2/1.
export const outreachStats = [
  { branch: 'Architecture', inGroup: null, status: 'No data', reps: [], notes: 'Group still being set up; Architecture rep needed.' },
  { branch: 'Civil Engineering', inGroup: null, status: 'Active', reps: ['Sinu Philip', 'Suhailah'], notes: 'Group already existed before the reunion drive.' },
  { branch: 'Computer Science & Engineering', inGroup: '~40% of branch', status: 'Growing', reps: ['Prithwi', 'Rajasimha'], notes: 'Group created 23 Jan 2026.' },
  { branch: 'Electronics & Communication', inGroup: '~23 members', status: 'Needs Reps', reps: [], notes: 'Group active; named branch reps needed.' },
  { branch: 'Electrical & Electronics', inGroup: '~50 members', status: 'Strong', reps: ['Rinchen', 'Anu', 'Sundar'], notes: 'Group already existed.' },
  { branch: 'Mechanical Engineering', inGroup: '17+ members', status: 'Growing', reps: ['Mathew Thomas', 'Arun V'], notes: 'Group existed; adding more members.', missingKnown: ['Sen Fernandez', 'Sujeet Kumar Sinha'] },
  { branch: 'Production Engineering', inGroup: '13 members', status: 'Active', reps: ['Nitish', 'Hari'], notes: 'Group created 23 Jan 2026.' },
];

// Minutes of Meeting — sourced verbatim from the xlsx "MoM" sheet.
// Each entry captures the date, attendees, discussion points and follow-up
// actions. New meetings should be appended at the bottom of the array.
export const meetingMinutes = [
  {
    id: 'mom-2026-03-01',
    date: '2026-03-01',
    attendees: ['Robin', 'Santanu', 'Sharmishta'],
    status: 'logged',
    items: [
      { text: 'Open question for Shyam — can we have two different bank accounts: one for the event and a second for Give Back?' },
      { text: 'Decided to use SWIFT / direct bank-to-bank payment methods; the website will not take payments.' },
      { text: 'Per the senior batch\u2019s feedback, the Gala Dinner moves to Day 2. Day 1 will be a dinner with smaller groups — a more informal opportunity to reconnect.' },
      { text: 'Monthly communication cadence locked for the broader group.' },
      { text: 'Walked through the Excel sheet (Gantt chart, v0 budget, Day-wise Run Sheet, …) — sent to Shyam to add to the Drive as a Google sheet.' },
      { text: 'Renewed call for individuals to take ownership of action items. The Gantt chart carries the action items and due dates.' },
    ],
  },
  {
    id: 'mom-2026-03-14',
    date: '2026-03-14',
    attendees: ['Robin', 'Santanu', 'Sharmishta'],
    status: 'logged',
    items: [
      {
        text: 'Reviewed the response from Gokulam for room rates and banquet rates. 52 rooms across 4 categories. Banquet options at 2 / 3 / 4 Non-Veg + 2 Veg + Dal — decided to go with the 2 Non-Veg buffet at ₹1,150 + 18% tax. Key item: the room block can be held with a ₹50,000 advance.',
      },
      {
        text: 'Response received from Dimora Hotels and Resorts. Engagement not finalised. Alcohol-free hotel — not suitable for Gala or group events, but a good overflow option given proximity to Gokulam.',
      },
      {
        text: 'Extend reach-out to Taj for room + banquet rates given the nostalgia quotient.',
        owner: 'Robin Thomas Vetrady',
        followUp: 'Robin will engage and provide an update in the next bi-weekly meeting.',
      },
      {
        text: 'Strong feedback on low engagement among alumni volunteers — we are close to the danger line. Ownership still needed for: Finance, Event Management, Food & Accommodation, Sponsorship.',
      },
      {
        text: 'Hiring an event-management company. Robin is speaking with one firm; quote pending. Sharmishta asked for social-media details so we can look at their past events.',
        owner: 'Sharmishta',
        followUp: 'Sharmishta to reach out to Simi (from Archi) to gather competitor quotes. Please share any other contacts.',
      },
      {
        text: 'RED ITEM — we haven\u2019t begun official engagement with campus officials regarding our reunion schedule.',
        owner: 'sharmishta.er@gmail.com',
        followUp: 'Sharmishta to own and provide an update at the next meeting and in the volunteer group.',
      },
      {
        text: 'Giving Back — no new updates.',
        owner: 'santanu.kumar.malik@gmail.com',
        followUp: 'Santanu to connect with Shyamnandan T and provide recommendations on next steps at our next connect.',
      },
      {
        text: 'Budget — reviewed v0 on the Google sheet and created v1 (removed a few line items we felt weren\u2019t required). Need to formalise ASAP so sub-committees have a framework.',
        owner: 'Shyamnandan T',
        followUp: 'Shyamnandan to review and help finalise the v1 budget.',
      },
    ],
  },
  {
    id: 'mom-2026-03-28',
    date: '2026-03-28',
    attendees: [],
    status: 'draft',
    items: [
      { text: 'Will we have a common email for sending official communications?' },
      { text: 'Should we send out the initial email comms with the details we have — and ask recipients to forward to people not on socials?' },
    ],
  },
];

// ICAR Agenda — pre-meeting Q&A with NIT Calicut\u2019s International, Alumni
// and Corporate Relations (ICAR) office, sourced verbatim from the xlsx
// "Agenda for ICAR meeting" sheet. Used by the ICAR SPOC to capture the
// institute\u2019s answers alongside each question.
export const icarAgenda = [
  {
    id: 'icar-1',
    title: 'Campus Access & Permissions',
    questions: [
      'What is the formal approval process for hosting a reunion on campus?',
      'Typical timelines we should plan for approvals',
      'Key points of contact for coordination across departments',
      'Any restrictions we should be aware of (security, timings, movement across campus)',
    ],
  },
  {
    id: 'icar-2',
    title: 'Facilities & Logistics',
    questions: [
      'What venues are available for our group size (seminar halls, auditoriums, open spaces)?',
      'Capacity limits and booking process for each',
      'Availability of AV equipment and technical support',
      'Catering options, in-house or external, and any guidelines',
      'Access to washrooms, parking, and basic amenities for guests',
      'Process for arranging campus access on a Sunday',
    ],
  },
  {
    id: 'icar-3',
    title: 'Photoshoot & Campus Use',
    questions: [
      'Suggested locations for batch photos (iconic spots, new developments)',
      'Whether separate permissions are needed for photography',
      'Any restrictions on drones, professional equipment, or timing',
    ],
  },
  {
    id: 'icar-4',
    title: 'Event Format & Flow',
    questions: [
      'Any suggested structure based on past reunions',
      'What has worked well for other batches vs things to avoid',
      'Support available on the day (staff, coordination help)',
    ],
  },
  {
    id: 'icar-5',
    title: 'Faculty & Dignitary Engagement',
    questions: [
      'Protocol for inviting the Director, Deans, HODs, and former professors',
      'How invitations should be routed and timelines to follow',
      'Expected format if dignitaries attend (formal address, informal interaction)',
      'How do we get the contact of professors from our batch? Some of them have passed away — is there any way we can do a remembrance for them?',
    ],
  },
  {
    id: 'icar-6',
    title: 'Alumni Association & Contributions',
    questions: [
      'Current alumni initiatives or projects we could align with',
      'Typical contribution models from reunion batches',
      'How contributions are managed and acknowledged',
      'Whether we can propose something specific as a batch',
    ],
  },
  {
    id: 'icar-7',
    title: 'Budget & Payments',
    questions: [
      'Costs associated with venue hire, facilities, and services',
      'Payment process and timelines',
      'Any deposits or advance bookings required',
    ],
  },
  {
    id: 'icar-8',
    title: 'Communication & Coordination',
    questions: [
      'Best way to stay coordinated with the institute team leading up to the event',
      'How far in advance we should lock key details',
      'Any documentation or information they\u2019ll need from us next',
    ],
  },
];

// Action items derived from chat log + MoM. Due dates were fabricated earlier
// so they have been removed; only where a real date is captured (e.g. set as a
// committee deliverable) is `dueDate` kept.
export const actionItems = [
  { id: 'ai-01', task: 'Complete bank account setup at SBI CREC (NITC campus)', assignee: 'Shyam & Mahroof', priority: 'critical', status: 'in_progress' },
  { id: 'ai-02', task: 'Launch registration process once bank account is live', assignee: 'Registration Committee', priority: 'critical', status: 'blocked', blockedBy: 'Bank account' },
  { id: 'ai-03', task: 'Fill ECE branch representative positions', assignee: 'All volunteers', priority: 'high', status: 'open' },
  { id: 'ai-04', task: 'Fill Architecture branch representative positions', assignee: 'All volunteers', priority: 'high', status: 'open' },
  { id: 'ai-05', task: 'Roll out Give Back comms — Health Centre flagship', assignee: 'Giving Back Committee', priority: 'high', status: 'in_progress' },
  { id: 'ai-06', task: 'Finalise hotel partnerships (Gokulam Grand anchor + backups)', assignee: 'AFC Committee', priority: 'medium', status: 'in_progress' },
  { id: 'ai-07', task: 'Collect website feedback from volunteers', assignee: 'Rajasimha / Shrinath', priority: 'medium', status: 'in_progress' },
  { id: 'ai-08', task: 'Contact Yagya Dutt for post-event Kerala tour options', assignee: 'Prithwi', priority: 'low', status: 'open' },
  { id: 'ai-09', task: 'Compile list of departed batchmates for the remembrance segment', assignee: 'Branch Reps', priority: 'medium', status: 'in_progress', notes: '5 confirmed in xlsx Remembrance sheet.' },
  { id: 'ai-10', task: 'Onboard Vinu Joseph to the Finance Committee', assignee: 'Shyam', priority: 'high', status: 'open' },
  { id: 'ai-11', task: 'Lock Townhall agenda and speakers for 25/26 Apr sessions', assignee: 'Robin / Sharmishta', priority: 'high', status: 'in_progress' },
  { id: 'ai-12', task: 'Freeze logo brief with Vipin Chandran', assignee: 'Sharmishta', priority: 'medium', status: 'in_progress' },
];
