export const EVENT_CONFIG = {
  collegeName: 'Regional Engineering College Calicut',
  collegeShort: 'REC',
  collegeNow: 'NIT Calicut',
  eventName: 'REConverge 2001',
  tagline: 'The Last RECians',
  heroQuote: 'Welcome home, Class of 2001! Let\u2019s celebrate 25 years of brilliance, camaraderie, and beautiful memories of Calicut REC.',
  eventDate: new Date('2026-12-26T09:00:00'),
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
    description: 'Partnered Hotels in Calicut city',
    bookingCode: 'TBD',
  },
  registrationFee: 12500,
  familyMemberFee: 2500,
  registrationDeadline: 'Jun 30th, 2026',
  batchYear: 2001,
  yearsAgo: 25,
  contact: {
    email: 'reconverge2001@gmail.com',
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

export const FAMILY_OPTIONS = [
  { label: 'Coming Solo', value: 0 },
  { label: 'Self & Partner', value: 1 },
  { label: 'Self, Partner & Kid(s)', value: 2 },
  { label: 'Self, Partner, Kid(s) & Parent(s)', value: 3 },
];

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'When & Where', path: '/when-where' },
  { label: 'Agenda', path: '/agenda' },
  { label: 'Yearbook', path: '/yearbook' },
  { label: 'Groups', path: '/groups' },
  { label: 'Store', path: '/store' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Committees', path: '/committees' },
  { label: 'RSVP', path: '/rsvp' },
  { label: 'Our Journey', path: '/our-journey' },
];

export const NAV_LINKS_PORTAL = [
  { label: 'Agenda', path: '/agenda' },
  { label: 'My Itinerary', path: '/events/my-plan' },
  { label: 'Groups', path: '/groups' },
  { label: 'Travel', path: '/travel' },
  { label: 'Yearbook', path: '/yearbook' },
  { label: 'Store', path: '/store' },
  { label: 'Give Back', path: '/give-back' },
  { label: 'News', path: '/news' },
];

export const STATS = [
  { label: 'Batch Strength', value: 350, suffix: '+' },
  { label: 'Glorious Years', value: 25, suffix: '' },
  { label: 'Branches', value: 7, suffix: '' },
  { label: 'Days of Reunion', value: 3, suffix: '' },
];

export const FAQ_DATA = [
  { id: 'f1', question: 'Is accommodation available on campus?', answer: 'No. We will be tying up with a few hotels in the City. The discount coupon will be shared for those hotels. You can book your accommodation in any of those hotels or any other hotel of your choice in Calicut city.' },
  { id: 'f2', question: 'Is there a dress code for the event?', answer: 'Yes, there will be event-specific dress codes! The themes for the Gala Dinner, REConverge main event at NITC and the branch-wise dinners will be shared soon!' },
  { id: 'f3', question: 'Can I bring my children?', answer: 'Absolutely! We will have a dedicated kids\u2019 zone with activities planned during the main events.' },
  { id: 'f4', question: 'How do I reach REC Calicut for the event?', answer: 'Buses will be arranged from the hotel(s) to NITC Campus on Day 2 morning and back to the hotel in the evening.' },
  { id: 'f5', question: 'What is the cost for the event?', answer: 'The cost for the event is Rs. 12,500 per person. Any additional family member will be charged Rs. 2,500. This excludes accommodation and travel to and from Calicut.' },
  { id: 'f6', question: 'Does the above cost include the \u2018Giving Back\u2019 initiative?', answer: 'No, the \u2018Giving Back\u2019 initiative is a separate fund and will be collected separately. More details will be shared soon.' },
  { id: 'f7', question: 'What if we plan to go for a short Kerala tour post the event?', answer: 'Few travel agent numbers will be shared shortly on the website. You can book group tours at economic prices based on your tour itinerary.' },
];

export const RSVP_INCLUSIONS = [
  { title: 'Full Regalia Dinner', description: 'Multi-cuisine Gala Dinner with Cocktails' },
  { title: 'Commemorative Pack', description: 'Hoodies, Medallions, Memorabilia' },
  { title: 'The Grand Kerala Feast', description: 'Traditional Sadhya Lunch' },
];

export const CAMPUS_PHOTOS = [
  { src: 'NITC-Rajpath1.jpg', title: 'The Rajpath', caption: 'This is where it all began!' },
  { src: 'calicut mini canteen.avif', title: 'The Hostel Life!', caption: 'Memories from the mini canteen' },
  { src: 'calicut railway station.jpg', title: 'Most Beautiful Memories', caption: 'Most Beautiful Memories Etched In Here!' },
  { src: 'nitc-mainblock-1.jpeg', title: 'The Grand Entrance!', caption: 'The iconic main block' },
];
