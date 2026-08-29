// Hotel data sourced from Gokulam Grand's formal banquet + rooms proposal
// (SILVER JUBILEE REUNION.pdf) and AFC committee shortlist captured in
// REConverge '26.xlsx (Vendor Contact List sheet).
//
// Rates quoted are the negotiated REConverge 2001 group rates. Public "actual"
// rate shown alongside so alumni can see the saving vs booking direct.

export const accommodationContact = {
  name: 'Accommodation & Food Committee',
  shortName: 'AFC',
  email: 'crec2001reunion@gmail.com',
  whatsapp: 'https://chat.whatsapp.com/JXcd7Dh4qKtJbrV6x3yw1Z',
  quoteRef: 'REConverge 2001 - Silver Jubilee Block',
  note: 'Always quote "REConverge 2001" when calling the hotel to access the negotiated rate.',
};

export const hotels = [
  {
    id: 'gokulam-grand',
    name: 'Gokulam Grand Calicut',
    tier: 'primary',
    status: 'Confirmed — Block of 52 rooms held',
    tagline: 'Central location, seniors liked',
    website: 'https://gokulamhotels.com/gokulam-grand-kozhikode.html',
    distanceFromStation: '1.5 km from Calicut Rly / KSRTC bus',
    distanceFromAirport: '28 km from Calicut International Airport',
    starClass: '5-star',
    blockSize: 52,
    roomsReserved: 0,
    image: 'https://placehold.co/800x400/1e3a5f/d4a843?text=Gokulam+Grand+Calicut',
    badge: 'Official Event Hotel',
    checkIn: '14:00',
    checkOut: '12:00',
    amenities: ['Wi-Fi', 'Buffet Breakfast', 'Swimming Pool', 'Health Club', 'Doctor on Call', '24hr Room Service', 'Welcome Drink', 'Parking'],
    roomTypes: [
      { id: 'deluxe', name: 'Deluxe Room', actualRate: 9000, singleRate: 6000, doubleRate: 7000, extraPerson: 1500, inventory: 39, note: 'Buffet breakfast included; tea/coffee maker in room' },
      { id: 'superior', name: 'Superior Room', actualRate: 12000, singleRate: 9000, doubleRate: 10000, extraPerson: 1500, inventory: 4, note: 'Larger room with upgraded furnishing' },
      { id: 'suite', name: 'Suite Room', actualRate: 14000, singleRate: 12000, doubleRate: 12000, extraPerson: 1500, inventory: 4, note: 'Separate living area' },
      { id: 'grand-suite', name: 'Grand Suite', actualRate: 15000, singleRate: 13000, doubleRate: 13000, extraPerson: 1500, inventory: 5, note: 'Largest category with full amenities' },
    ],
    policies: {
      extraPerson: 'Rs. 1,500 + GST per extra person (age 10+ is counted as an extra person).',
      cancellation: 'Free cancellation up to 2 days before arrival. Later cancellations / no-show: 100% of reservation amount retained.',
      payment: 'Amount payable at the hotel before the guest departs. Credit/card/bank transfer accepted.',
      id: 'All guests must present Driving Licence, Passport, or Voter ID at check-in. Foreign nationals require valid Visa + Passport.',
    },
    bookingMethod: 'Contact the AFC via the group WhatsApp/email. We will forward your preferred room type, sharing pattern, and dates to Gokulam Grand and reply with a booking confirmation + payment link.',
  },
  {
    id: 'tiara-mps',
    name: 'Tiara by MPS',
    tier: 'backup',
    status: 'On AFC shortlist — quote requested (27 Mar)',
    tagline: 'Next to Gokulam, easy cross-hotel mingling',
    image: 'https://placehold.co/800x400/2d5a8e/f8fafc?text=Tiara+by+MPS',
    badge: 'Backup option',
    amenities: [],
    bookingMethod: 'Spillover option if Gokulam Grand block is exhausted. Contact AFC for the latest on rates and availability.',
  },
  {
    id: 'raviz-calicut',
    name: 'The Raviz Calicut',
    tier: 'backup',
    status: 'On AFC shortlist — quote requested',
    tagline: 'Business-class, central',
    image: 'https://placehold.co/800x400/0b1a2c/d4a843?text=Raviz+Calicut',
    badge: 'Backup option',
    amenities: [],
    bookingMethod: 'Contact AFC — rates and availability to be confirmed.',
  },
  {
    id: 'raviz-kadavu',
    name: 'The Raviz Kadavu',
    tier: 'resort',
    status: 'On AFC shortlist (resort alternative)',
    tagline: 'Chaliyar river, large lawns, atmospheric',
    image: 'https://placehold.co/800x400/374151/d4a843?text=Raviz+Kadavu',
    badge: 'Resort alternative',
    amenities: [],
    bookingMethod: 'Optional resort-evening consideration; book individually if you want to extend your stay.',
  },
];

export const galaDinner = {
  venue: 'Manachira — 7th-floor Rooftop, Gokulam Grand Calicut',
  dates: ['2026-12-27', '2026-12-28'],
  time: '18:30 – 22:30',
  dressCode: 'Theme to be announced (Black & Gold / Wine & Black / Retro on poll)',
  guaranteedPax: 400,
  seatingPlan: 'Theatre + Cluster',
  musicCutoff: '22:00 (government rule)',
  menus: [
    { id: 'menu-2nv', name: '2 Non-Veg Menu', actualRate: 1250, specialRate: 1150, taxPercent: 18, includes: 'Two soups, three salads, two bread items, two rice items, two non-veg (chicken + fish), two veg, dal, two desserts, pappad/curd/pickle' },
    { id: 'menu-3nv', name: '3 Non-Veg Menu', actualRate: 1400, specialRate: 1300, taxPercent: 18, includes: 'Two soups, three salads, two bread items, two rice items, three non-veg (chicken + fish + beef), two veg, dal, three desserts' },
    { id: 'menu-4nv', name: '4 Non-Veg Menu', actualRate: 1500, specialRate: 1400, taxPercent: 18, includes: 'Two soups, three salads, two bread items, two rice items, four non-veg (2 chicken + 1 fish + 1 beef), two veg, dal, four desserts' },
  ],
  includes: ['Welcome drink on arrival', 'Buffet dinner as per selection', 'Seating arrangements', 'Music & entertainment (till 22:00)'],
  notes: [
    'Decoration services and basic sound/stage for the rooftop must be outsourced.',
    'LCD projector available on hire: ₹3,000 + 18% GST.',
    'Outside food & beverages are not permitted in hotel premises.',
    '50% advance required to confirm the banquet booking.',
  ],
};

// Carpool offers are added by alumni through the portal — none have been
// submitted yet. Do not seed fabricated rides.
export const carpoolOffers = [];

// Shuttle schedule reflects the xlsx "Day-Wise Run Sheet":
// Dec 27: staggered airport/rail pickups through the day.
// Dec 28: 5x 44-seater buses depart hotel 09:00–09:45 for NITC; return 16:00–17:00.
// Dec 29: staggered hotel → airport/rail shuttles at check-out.
// Exact departure times for Dec 27 pickups and Dec 29 drop-offs are still
// being finalised with the transport vendor — those values are placeholders.
export const shuttleSchedule = [
  { id: 'sh-d28-1', from: 'Gokulam Grand / Hotels', to: 'NIT Calicut Campus', departureTime: '09:00', date: '2026-12-28', capacity: 44, booked: 0, note: 'Bus 1 of 5' },
  { id: 'sh-d28-2', from: 'Gokulam Grand / Hotels', to: 'NIT Calicut Campus', departureTime: '09:15', date: '2026-12-28', capacity: 44, booked: 0, note: 'Bus 2 of 5' },
  { id: 'sh-d28-3', from: 'Gokulam Grand / Hotels', to: 'NIT Calicut Campus', departureTime: '09:30', date: '2026-12-28', capacity: 44, booked: 0, note: 'Bus 3 of 5' },
  { id: 'sh-d28-4', from: 'Gokulam Grand / Hotels', to: 'NIT Calicut Campus', departureTime: '09:45', date: '2026-12-28', capacity: 44, booked: 0, note: 'Bus 4 of 5' },
  { id: 'sh-d28-5', from: 'Gokulam Grand / Hotels', to: 'NIT Calicut Campus', departureTime: '10:00', date: '2026-12-28', capacity: 44, booked: 0, note: 'Bus 5 of 5' },
  { id: 'sh-d28-r1', from: 'NIT Calicut Campus', to: 'Gokulam Grand / Hotels', departureTime: '16:30', date: '2026-12-28', capacity: 44, booked: 0 },
  { id: 'sh-d28-r2', from: 'NIT Calicut Campus', to: 'Gokulam Grand / Hotels', departureTime: '17:00', date: '2026-12-28', capacity: 44, booked: 0 },
];

// City-wise alumni distribution will be computed from the live registration
// tracker once registrations open. No fabricated baseline.
export const cityWiseAlumni = [];
