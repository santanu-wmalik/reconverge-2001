// Early-bird registration deadline — public teaser on the landing page and
// full details on the protected /early-bird page count down against this.
// Change here and both surfaces update.
export const EARLY_BIRD_DEADLINE = new Date('2026-09-30T23:59:59+05:30');

// Best Buddy offer is live until its deadline passes (IST).
export const buddyOfferActive = () => new Date() <= new Date('2026-10-19T23:59:59+05:30');

// Base self-fee for an alumni profile/entry: Best Buddy opt-in gets the
// buddy rate while the offer window is open; everyone else pays standard.
export const baseFeeFor = (a) =>
  a && a.buddyOptIn && buddyOfferActive() ? 13500 : 15000;

export const EVENT_CONFIG = {
  collegeName: 'Regional Engineering College Calicut',
  collegeShort: 'REC',
  collegeNow: 'NIT Calicut',
  eventName: 'REConverge 2001',
  tagline: 'The Last RECians',
  heroQuote: 'Welcome home, Class of 2001! Let\u2019s celebrate 25 years of brilliance, camaraderie, and beautiful memories of Calicut REC.',
  eventDate: new Date('2026-12-27T14:00:00'),
  eventStartDate: new Date('2026-12-27T09:00:00'),
  eventEndDate: new Date('2026-12-29T12:00:00'),
  displayDates: 'December 27th - 28th, 2026',
  checkinDate: '27th Dec 2026 (Sunday)',
  checkoutDate: '29th Dec 2026 (Tuesday)',
  venue: {
    name: 'REC Calicut Campus (NIT Calicut)',
    address: 'Kozhikode-Mukkam Road, Kattangal',
    city: 'Kozhikode (Calicut)',
    state: 'Kerala',
    pincode: '673601',
    mapUrl: 'https://maps.google.com/?q=11.3214532,75.9238385',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.0!2d75.9238385!3d11.3214532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDE5JzE3LjIiTiA3NcKwNTUnMjYuMCJF!5e0!3m2!1sen!2sin!4v1',
  },
  stay: {
    description: 'Gokulam Grand Calicut (52-room batch block — fully booked; backup hotels on the Stay page)',
    bookingCode: 'REConverge 2001 - Silver Jubilee Block',
    primaryHotel: 'Gokulam Grand Calicut',
    nights: 2,
    checkinDate: '2026-12-27',
    checkoutDate: '2026-12-29',
  },
  registrationFee: 15000, // standard rate (early-bird ₹13,500 ended 30 Sept 2026)
  standardFee: 15000,      // rate after 30 Sept — shown struck through next to the early-bird price
  familyMemberFee: 2500,
  // Best Buddy Pricing — register WITH a buddy (2+ people, all unpaid as of
  // 30 Sept) and everyone in the group pays the old early-bird rate. All of
  // them must complete registration AND initiate payment by the deadline.
  buddyFee: 13500,
  buddyDeadline: '2026-10-19T23:59:59+05:30',
  buddyDeadlineLabel: '19 October 2026, 11:59 PM IST',
  registrationDeadline: 'Jun 30th, 2026',
  batchYear: 2001,
  yearsAgo: 25,
  contact: {
    email: 'crec2001reunion@gmail.com',
  },
  logoUrl: 'https://storage.googleapis.com/reconverge-2001-uat-bucket/landing_page_pictures/Reconverge_2001_Logo.png',
  storageBaseUrl: 'https://storage.googleapis.com/reconverge-2001-uat-bucket/landing_page_pictures/',
};

export const BRANCHES = [
  'Architecture',
  'Civil Engineering',
  'Computer Science & Engineering',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Production Engineering',
];

export const BRANCH_SHORT = ['Arch.', 'Civil', 'CSE', 'ECE', 'EEE', 'Mech.', 'Prod.'];

export const HOSTELS = ['Cauvery Hostel', 'Ganga Hostel', 'Narmada Hostel', 'Krishna Hostel', 'Yamuna Hostel', 'Godavari Hostel', 'Tapti Hostel', 'Sarayu Hostel'];

export const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
export const DIETARY_OPTIONS = ['Veg', 'Non-Veg', 'Vegan'];
export const TRAVEL_MODES = ['Flight', 'Train', 'Bus', 'Self-Drive', 'Other'];
export const ROOM_PREFERENCES = ['Single (Deluxe)', 'Twin-sharing (Deluxe)', 'Single (Superior)', 'Twin-sharing (Superior)', 'Suite', 'Grand Suite', 'No accommodation needed'];
export const ID_TYPES = ['Driving Licence', 'Passport', 'Voter ID', 'Aadhaar'];

export const FAMILY_OPTIONS = [
  { label: 'Coming Solo', value: 0 },
  { label: 'Self & Partner', value: 1 },
  { label: 'Self, Partner & Kid(s)', value: 2 },
  { label: 'Self, Partner, Kid(s) & Parent(s)', value: 3 },
];

// Public (always visible) — main header nav. Anyone can open these without
// signing in.
export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Event', path: '/event', flash: true }, // 2nd Town Hall poster
  { label: 'Our Journey', path: '/our-journey' },
  { label: 'Give Back', path: '/project-cornerstone' },
  { label: 'Committees', path: '/committees' },
  { label: 'FAQ', path: '/faq' },
];

// Login-required — rendered as the "My Portal" sub-bar inside PortalLayout
// (mirrors the Admin sub-bar). Completely hidden for unauthenticated users
// because PortalLayout is gated by ProtectedRoute. Store and News are kept
// out of this list until SC/MCC have real content — one-line change to add.
export const NAV_LINKS_PROTECTED = [
  { label: 'Agenda', path: '/agenda', icon: '📅' },
  { label: 'Early Bird', path: '/early-bird', icon: '🎟' },
  { label: 'My Payments', path: '/payments', icon: '💳' },
  { label: 'Give Back', path: '/give-back', icon: '💛' },
  { label: "Who's Registered", path: '/whos-coming', icon: '🙋' },
  { label: 'My Events', path: '/events/my-plan', icon: '📋' },
  { label: 'Stay', path: '/stay', icon: '🏨' },
  { label: 'Townhalls', path: '/townhalls', icon: '🎙️' },
  { label: 'Yearbook', path: '/yearbook', icon: '📖' },
  // Only shown to users holding the 'details' permission (PortalLayout filters).
  { label: 'Track Registration', path: '/track-registration', icon: '📊', permission: 'details' },
];

// Legacy alias kept for any external imports; equivalent to the merged list.
export const NAV_LINKS_PORTAL = [...NAV_LINKS, ...NAV_LINKS_PROTECTED];

export const STATS = [
  { label: 'Batch Strength', value: 350, suffix: '+' },
  { label: 'Glorious Years', value: 25, suffix: '' },
  { label: 'Branches', value: 7, suffix: '' },
  { label: 'Days of Reunion', value: 2, suffix: '' },
];

export const FAQ_DATA = [
  // === Registration ===
  { id: 'f-reg-1', question: 'When does registration open and close?', category: 'Registration', answer: 'Registration is OPEN now on this website at the standard rate of ₹15,000 (the early-bird rate of ₹13,500 ended 30 September 2026). The hard cut-off will be announced closer to the event (targeting mid-November 2026) so the Stay and Food committees can lock final counts. You can update your details any time until then from your profile.' },
  { id: 'f-reg-2', question: 'How do I register on the website?', category: 'Registration', answer: 'Hit Sign Up in the header and work through the six-step form: Personal → Academic → Travel & Stay → Preferences → Payment → Review. Only your Email and Password are required; everything else is optional and can be added later from your profile.' },
  { id: 'f-reg-3', question: 'What happens right after I register?', category: 'Registration', answer: 'Your profile goes live — but your sign-up is NOT complete until payment is received. Head to My Payments for your exact amount due and the batch bank account, transfer the fee, and paste your transaction reference there so the Finance Committee can verify it and mark you Paid & Attending.' },
  { id: 'f-reg-4', question: 'Can I attend only one of the days?', category: 'Registration', answer: 'Yes. If you can only make Day 1 (27 Dec — Check-in & Ice-Breaker) or Day 2 (28 Dec — Campus & Gala), please still register and note the specifics in the "Special Requests" field. The single registration fee stays the same regardless of day count — the batch common costs are the same either way. The 29th is checkout only, with no planned activities.' },

  // === Stay & Accommodation ===
  { id: 'f-stay-1', question: 'How do I book my hotel room?', category: 'Stay', answer: 'Update (Sept 2026): the Gokulam Grand batch block is FULLY BOOKED. Email crec2001reunion@gmail.com (subject: "REConverge 2001 — Stay") to join the waitlist for cancellations, or book a backup hotel — see the Stay page for the current options near Gokulam Grand. Gala dinner and all events are unaffected; the programme remains at Gokulam Grand and NITC campus.' },
  { id: 'f-stay-2', question: 'What are the room rates and what\u2019s included?', category: 'Stay', answer: 'At Gokulam Grand Calicut: Deluxe ₹6,000 single / ₹7,000 double · Superior ₹9,000 / ₹10,000 · Suite ₹12,000 · Grand Suite ₹13,000 — all + GST, per night. Every rate includes welcome drink, buffet breakfast, Wi-Fi, pool, gym, doctor on call and 24-hour room service. Note: the 52-room batch block is now fully booked — these rates apply to waitlist/cancellation rooms only; see the Stay page for backup hotels.' },
  { id: 'f-stay-3', question: 'What is the cancellation policy?', category: 'Stay', answer: 'Gokulam Grand allows free cancellation up to 2 days before arrival. Cancel later — or no-show — and 100% of the reservation amount is retained. For the Gala banquet itself: 30% deposit is non-refundable; 50% fee if cancelled within 30 days of the event; 100% fee within 7 days.' },
  { id: 'f-stay-4', question: 'Is accommodation included in the registration fee?', category: 'Stay', answer: 'No. Accommodation is paid directly to the hotel, separate from the reunion fund — a deliberate decision so alumni can pick the room type that matches their budget. The reunion registration fee covers the organised meals (27th dinner at Malabar Palace, the campus Sadya lunch and the Gala Dinner on the 28th), the campus day, souvenir kit and shared event costs.' },
  { id: 'f-stay-5', question: 'How are children counted for room billing?', category: 'Stay', answer: 'Per Gokulam Grand\u2019s policy: children under 10 share the room at no extra cost; from age 10 upward each child counts as an extra person (₹1,500 + GST per night). Please capture adult / child-below-10 / child-10+ counts accurately on the registration form — this drives the final rooming list.' },
  { id: 'f-stay-6', question: 'What ID do I need to carry at check-in?', category: 'Stay', answer: 'A government notification makes photo ID mandatory for every guest — including Indian nationals. Bring Driving Licence, Passport, or Voter ID. Foreign nationals must carry a valid Visa and Passport. You can optionally capture the ID type (and last 4 digits) during registration so we can cross-reference the rooming list.' },
  { id: 'f-stay-7', question: 'I\u2019m arriving before Dec 27 or leaving after Dec 29 — how do I book extra nights?', category: 'Stay', answer: 'The batch block covers 27 and 28 Dec (check-out 29 Dec at 12:00). For nights outside that window, book directly on the hotel website or any OTA — those reservations are independent of the batch block. If you want Gokulam Grand continuity, mention it to AFC when you reserve so they can flag it with the hotel.' },
  { id: 'f-stay-8', question: 'Is breakfast included at the hotel?', category: 'Stay', answer: 'Breakfast is at your respective hotel, per your own reservation. If you booked at the room rates the batch negotiated, a breakfast buffet is included on all mornings (27, 28 and 29 Dec). If you booked a cheaper rate through a travel website, breakfast may or may not be included — check your booking.' },

  // === Event & Program ===
  { id: 'f-evt-1', question: 'Is there a dress code?', category: 'Event', answer: 'The campus day (28 Dec) is smart-casual. The Gala Dinner will have a suggested theme — being finalised by the committee and announced ahead of the event. No mandatory dress codes.' },
  { id: 'f-evt-0', question: 'Which meals are organised by the batch?', category: 'Event', answer: 'Three meals are organised and covered: dinner on the 27th (Malabar Palace), the Kerala Sadya lunch on campus on the 28th, and the Gala Dinner at Gokulam Grand on the 28th evening. Breakfasts on the 28th and 29th are on your own at your respective hotel — included if you booked the negotiated batch room rate; check your reservation if you booked via a travel site.' },
  { id: 'f-evt-2', question: 'Can I bring my children?', category: 'Event', answer: 'Yes — please indicate the number and ages of children during registration. A kids\u2019 zone during the Day-2 auditorium function is being planned so parents can sit through the main programme; exact activity details will be confirmed closer to the event.' },
  { id: 'f-evt-3', question: 'How do I reach NIT Calicut campus from the hotel?', category: 'Event', answer: 'On Day 2 (28 Dec), shuttle buses depart the hotels for NITC campus from 08:30, returning in the late afternoon — more information to follow. No separate cost — included in the reunion programme.' },
  { id: 'f-evt-4', question: 'Is the venue wheelchair-accessible?', category: 'Event', answer: 'Yes — we\u2019re committed to keeping accessibility in mind across venue, stage, and transport. If you or a family member need specific accommodations (wheelchair access, ramps, dedicated transport), mention it in Special Requests during registration and we\u2019ll coordinate with the venue and transport teams ahead of time.' },
  { id: 'f-evt-5', question: 'When will the event logo be revealed?', category: 'Event', answer: 'The event identity — the REConverge 2001 logo you see across this site — was designed by Vipin Chandran from the batch. T-shirt and souvenir designs follow the same identity and are being finalised.' },

  // === Fees & Payment ===
  { id: 'f-fee-1', question: 'What does registration cost?', category: 'Fees', answer: 'Registration is ₹15,000 per alumnus (the ₹13,500 early-bird rate ended 30 September 2026) and ₹2,500 per additional family member (partner, child, parent). Until 19 October 2026 you can still get ₹13,500 via Best Buddy Pricing — register together with a buddy who has not paid yet (see the Best Buddy FAQs). This excludes accommodation (paid to the hotel) and travel to Calicut.' },
  { id: 'f-buddy-1', question: 'What is Best Buddy Pricing?', category: 'Fees', answer: 'Bring your buddy, get the old price! Register together with one or more batchmates who have not yet paid, and every person in your group pays ₹13,500 instead of ₹15,000. Everyone in the group must complete registration AND initiate payment by 19 October 2026, 11:59 PM IST. Tick the Best Buddy option during sign-up (or on My Payments if you have already signed up but not paid) and enter your buddy’s name(s).' },
  { id: 'f-buddy-2', question: 'Who can be my buddy?', category: 'Fees', answer: 'Any Class-of-2001 batchmate who has NOT yet paid. Someone who already paid at the early-bird price cannot be claimed as a buddy, and one person cannot appear in multiple buddy groups. A family member does not qualify as a buddy. Groups of three or more are welcome — everyone gets the price.' },
  { id: 'f-buddy-3', question: 'I already registered but have not paid — can I use the Best Buddy offer?', category: 'Fees', answer: 'Yes. Sign in, open My Payments, tick the Best Buddy option and add your buddy’s name. Your amount due drops to ₹13,500. If you already paid ₹15,000 after 30 September, you can still nominate a buddy — settle the ₹1,500 difference between yourselves, or email crec2001reunion@gmail.com.' },
  { id: 'f-buddy-4', question: 'When is a Best Buddy registration confirmed? What if my buddy backs out?', category: 'Fees', answer: 'Your registration shows as complete only when everyone in your buddy group has paid. Payment must be initiated by 19 October, 11:59 PM IST with proof submitted — verification can happen afterwards. The family-member rate stays ₹2,500 per person. No cancellations or refunds once you are paid and registered — we need you there!' },
  { id: 'f-fee-2', question: 'How do I pay the registration fee?', category: 'Fees', answer: 'Payment is made via direct bank transfer to the REConverge 2001 batch bank account — the website itself does not collect payments (batch decision, MoM 1 March 2026). Account: CREC Alumni Association 2001 Batch, A/c 45429696620, IFSC SBIN0002207, SBI NIT Calicut Campus (Branch 02207). NEFT / RTGS / IMPS supported; we are working on getting a UPI ID — until then please send payments to the account. Quote your Registration ID (SJ-2026-####) in the remarks if you can — and if you couldn’t, that’s completely fine: just paste the transaction reference as your Payment UID on your profile and the Finance Committee will verify from that and flip the status to "Payment Confirmed".' },
  { id: 'f-fee-3', question: 'What is the Give Back / Project Cornerstone program?', category: 'Fees', answer: 'Project Cornerstone — the batch’s legacy initiative to fund the Alumni Guest House at NITC (₹2 Cr goal, 20 rooms). It is entirely separate from (and in addition to) your registration fee. See the Give Back page for the full story, live progress and the giving tiers — from the Foundation Circle (₹2,00,000, donor wall) up to the Keystone Circle (₹10,00,000, room naming), or any amount of your own. Intents to give are non-binding and due by 1 December 2026; the fundraising committee follows up by email with payment details.' },

  // === Give Back / Project Cornerstone ===
  { id: 'f-gb-1', highlight: true, question: 'Why is NIT, a premium institute, asking alumni for money? Doesn’t it get government funds?', category: 'Give Back', answer: 'It sounds strange, but it is a genuine constraint: the central government has told the institute to generate its own funds for development — the Govt provides financial support (pay) only for authorised staff. The college is expected to fund growth from three sources: paid/sponsored research (as most colleges abroad do), alumni who benefited from the institute giving back through programs like this (exactly as happens at the IITs), and CSR funding. This was shared by the Director himself at a NITCAA general body meeting, where he asked for a focused, collaborative alumni effort — the Health Centre (funded by senior batches, completing this December) was the first such project, and the Alumni Guest House is the next. The existing guest house is decades old and too small, and at the IITs nearly every campus guest house is alumni-funded. An official communication from the Dean of Alumni Affairs (Dr Kumaravel) is being arranged and will be shared here for added credibility.' },
  { id: 'f-gb-2', question: 'Why not fund scholarships for students instead?', category: 'Give Back', answer: 'Student support at NITC is already in comparatively good shape — roughly 70% of students are covered by existing scholarships backed by a corpus of about ₹5 crore, and government schemes cover fee waivers for those who need them. The Dean’s office confirmed the guest house is the campus need alumni can uniquely meet. That said, any funds raised beyond the ₹2 Cr goal will go toward a scholarship/fellowship for students in need, in coordination with NITCAA.' },
  { id: 'f-gb-3', question: 'How was this project chosen?', category: 'Give Back', answer: 'The institute shared a list of 10+ possible legacy projects with the batch. The fundraising committee evaluated them with the college administration and zeroed in on the Alumni Guest House as the most impactful, visible and lasting contribution a single batch can make — and one the institute has formally approved (NITC/Directorate/58/26-27, 16 Sept 2026).' },
  { id: 'f-gb-4', question: 'Have other batches done something like this?', category: 'Give Back', answer: 'Yes. Three senior REC Calicut batches jointly funded the campus Health Centre, which is being inaugurated this December. Our guest house would be the first single-batch legacy project of this scale — no REC Calicut batch has committed ₹2 Cr at a silver jubilee before.' },
  { id: 'f-gb-4b', question: 'How much did the previous batches contribute?', category: 'Give Back', answer: 'At their silver jubilees, the Batch of 1999 contributed about ₹47 lakh and the Batch of 2000 about ₹94 lakh. Our ₹2 Cr goal would make the Class of 2001 the first REC Calicut batch to reach that mark. Recent IIT silver-jubilee commitments set the bar higher still — IIT Kanpur ’00 (₹100 Cr), IIT Delhi ’00 (₹70+ Cr), IIT Bombay ’98 (₹57 Cr). (Sources: publicly available alumni relations announcements.)' },
  { id: 'f-gb-5', question: 'Who holds the money? How do I know it goes to this project?', category: 'Give Back', answer: 'All contributions go to the NIT Calicut Alumni Association (NITCAA). Funds sent to the NITCAA account for this campaign are earmarked for the Alumni Guest House and cannot be used for anything else. Execution, fund management, handover and maintenance will be governed by an MoU between NIT Calicut and NITCAA before civil works begin.' },
  { id: 'f-gb-6', question: 'Is my contribution tax-deductible?', category: 'Give Back', answer: 'Contributions are eligible for tax exemption under Section 80G in India. Many employers (via Benevity and similar platforms) also match charitable donations — do check yours, it can double your impact. Alumni outside India may have their own tax benefits; please consult your tax advisor. Tick the tax-interest box on the intent form and the committee will follow up with specifics.' },
  { id: 'f-gb-7', question: 'What do I get for giving ₹1 lakh or more?', category: 'Give Back', answer: 'Every contribution of ₹1,00,000 or more earns a free Reunion Memento — shipped to your address anywhere in the world, but only if you can’t attend the reunion in person, so the reunion comes to you. Higher tiers add more: donor-wall recognition from ₹2 L (Foundation Circle), stage felicitation from ₹5 L (Pillar Circle), and room-naming rights at ₹10 L (Keystone Circle, 20 rooms, first come first served).' },
  { id: 'f-gb-8', question: 'Is my intent to give binding? When is the money actually due?', category: 'Give Back', answer: 'Submitting an intent to give is non-binding — it is not a payment or a legal commitment. It simply lets the committee plan with confidence. All funds are due by 1 December 2026, so the cheque can be handed over and the foundation stone laid at REConverge on 27 December 2026.' },
  { id: 'f-gb-9', question: 'Can I give anonymously, or give a smaller amount?', category: 'Give Back', answer: 'Both. Any amount counts toward the ₹2 Cr goal — there is no minimum, and only aggregate figures are ever published. Tick the anonymous box on the intent form and your name will never appear on the donor wall or any public list; the committee keeps your details only for payment follow-up.' },

  // === Communications & Engagement ===
  { id: 'f-comms-1', question: 'What are the townhalls — and do I have to attend?', category: 'Comms', answer: 'Townhalls are batch-wide calls where the volunteer team shares progress and takes questions live, always in two time-zone-friendly sessions. The first pair ran on 25–26 April; the 2nd Town Hall is on Sat 19 Sept (8–9 PM IST) and Sun 20 Sept (10–11 AM IST) — see the Event page for the poster and join info. Attendance is optional; recordings get posted to the Townhalls page (visible once you log in).' },
  { id: 'f-comms-2', question: 'How do I volunteer for a committee?', category: 'Comms', answer: 'Head to the Committees page and email crec2001reunion@gmail.com with your branch, the committee(s) you\u2019d like to help with, and a line on how much time you can give. Open slots: Stay & Food (AFC), Entertainment (EC) and Sponsorship (SC) all need leads; Architecture and ECE still need branch reps.' },

  // === Post-event ===
  { id: 'f-post-1', question: 'Can I book a post-event Kerala tour?', category: 'Travel', answer: 'Yes. Vetted travel-agent contacts will be listed on the Travel page closer to the event once the volunteer team finalises them. Popular extensions include Wayanad, Munnar, and the Alleppey backwaters.' },
  { id: 'f-post-2', question: 'Will photos and videos from the event be shared?', category: 'Travel', answer: 'Yes. Full photo + video coverage of both days (including drone, candid shots and edited highlights) is scoped in the budget. A shared album link will be posted on the Yearbook / News page and emailed to every registered alumnus within days of the event.' },
];

export const RSVP_INCLUSIONS = [
  { title: 'Gala Dinner (both nights)', description: 'Manachira rooftop, Gokulam Grand — welcome drink + buffet' },
  { title: 'Souvenir Kit', description: 'Branded T-shirt, tote bag, ID card/badge and a few Kerala goodies' },
  { title: 'Kerala Sadhya on Campus', description: 'Traditional banana-leaf lunch at NIT Calicut on Day 2' },
];

export const CAMPUS_PHOTOS = [
  { src: 'NITC-Rajpath1.jpg', title: 'The Rajpath', caption: 'This is where it all began!' },
  { src: 'calicut mini canteen.avif', title: 'The Hostel Life!', caption: 'Memories from the mini canteen' },
  { src: 'calicut railway station.jpg', title: 'Most Beautiful Memories', caption: 'Most Beautiful Memories Etched In Here!' },
  { src: 'nitc-mainblock-1.jpeg', title: 'The Grand Entrance!', caption: 'The iconic main block' },
];
