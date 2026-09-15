// Event schedule distilled from the xlsx "Day-wise Run Sheet" tab.
// Timings kept in sync with the latest MoM decision (Gala moved to Day 2).
//
// Sept 2026 relabel per Robin: it's a TWO-day programme — Day 1 (27 Dec,
// check-in & ice-breaker) and Day 2 (28 Dec, campus & gala). The 29th is
// checkout only — no planned activities (open mic / interest corners cut),
// and breakfast everywhere is per each alumnus's own hotel reservation
// (included with the negotiated batch rate; maybe not with OTA bookings).

export const eventSchedule = [
  // Day 1 - December 27, 2026 (Check-in & Ice-Breaker)
  { id: 'evt-d1-02', title: 'Hotel Check-in & Registration Desk', description: 'Check in at Gokulam Grand and collect your souvenir kit + badge at the registration desk in the lobby.', day: 1, date: '2026-12-27', startTime: '12:00', endTime: '17:30', venue: 'Gokulam Grand Lobby', category: 'ceremony', icon: '📋', isFeatured: false },
  { id: 'evt-d1-04', title: 'Welcome Address & Housekeeping Brief', description: 'Short welcome from the OCC with a quick walkthrough of the two-day plan.', day: 1, date: '2026-12-27', startTime: '17:30', endTime: '18:00', venue: 'Hotel Banquet Hall', category: 'ceremony', icon: '🎤', isFeatured: false },
  { id: 'evt-d1-05', title: 'Ice-Breaker & Cultural Evening by Batchmates', description: 'Performances from the batch — Bakwas Stories, music, and the nostalgia AV to kick off the reunion. Senior batch feedback: "give this more time".', day: 1, date: '2026-12-27', startTime: '18:00', endTime: '21:30', venue: 'Hotel Banquet Hall', category: 'cultural', icon: '🎭', isFeatured: true },
  { id: 'evt-d1-06', title: 'Buffet Dinner with Modest Programme', description: 'Conversation-friendly organised dinner — small groups, informal.', day: 1, date: '2026-12-27', startTime: '21:30', endTime: '23:00', venue: 'Malabar Palace', category: 'social', icon: '🍽️', isFeatured: false },

  // Day 2 - December 28, 2026 (Campus + Gala)
  { id: 'evt-d2-01', title: 'Breakfast at Your Hotel', description: 'At your respective hotel. Included if you booked the negotiated batch rate; if you booked via a travel site, check whether breakfast is part of your reservation.', day: 2, date: '2026-12-28', startTime: '07:00', endTime: '09:00', venue: 'Respective hotels', category: 'social', icon: '☕', isFeatured: false },
  { id: 'evt-d2-03', title: 'Gate Welcome, Campus Tour & Procession', description: 'Traditional welcome at the gate followed by a walk through the campus and new departments.', day: 2, date: '2026-12-28', startTime: '10:00', endTime: '11:00', venue: 'NITC Campus', category: 'campus', icon: '🚶', isFeatured: true },
  { id: 'evt-d2-04', title: 'NITC Auditorium Programme', description: 'Faculty & alumni addresses, felicitation ceremony, and the Remembrance segment honouring batchmates no longer with us.', day: 2, date: '2026-12-28', startTime: '11:00', endTime: '12:30', venue: 'NITC Auditorium', category: 'ceremony', icon: '🏛️', isFeatured: true },
  { id: 'evt-d2-05', title: 'Kerala Sadya on Campus', description: 'Traditional banana-leaf Sadya lunch at the NITC dining hall. Casual seating; staff gratitude moment.', day: 2, date: '2026-12-28', startTime: '12:30', endTime: '14:00', venue: 'NITC Dining Hall', category: 'social', icon: '🍌', isFeatured: true },
  { id: 'evt-d2-06', title: 'Hostel / Department Visits & Free Roaming', description: 'Optional — walk the hostels, departments, and "Back to class" sessions with professors.', day: 2, date: '2026-12-28', startTime: '14:00', endTime: '16:00', venue: 'NITC Campus', category: 'campus', icon: '🗺️', isFeatured: false },
  { id: 'evt-d2-08', title: 'Red-Carpet Entry & Batch Photo', description: 'Themed entry at the banquet hall followed by the headline batch photo (pre-planned structure — seniors said this is worth every rupee).', day: 2, date: '2026-12-28', startTime: '18:00', endTime: '18:30', venue: 'Hotel Banquet Hall', category: 'campus', icon: '📸', isFeatured: true },
  { id: 'evt-d2-09', title: 'Nostalgia AV & Curtain-Raiser Video', description: 'Old photos, video messages from batchmates who couldn’t make it, and the curtain-raiser to the evening.', day: 2, date: '2026-12-28', startTime: '18:30', endTime: '19:00', venue: 'Hotel Banquet Hall', category: 'cultural', icon: '🎞️', isFeatured: false },
  { id: 'evt-d2-11', title: 'Gala Dinner with Live Counters', description: 'Multi-cuisine Gala dinner on the Manachira rooftop at Gokulam Grand. Welcome drink, buffet, dessert spread.', day: 2, date: '2026-12-28', startTime: '19:30', endTime: '21:30', venue: 'Manachira Rooftop, Gokulam Grand', category: 'social', icon: '🍽️', isFeatured: true },
  { id: 'evt-d2-12', title: 'Live Band + DJ Dance Party', description: 'Family-friendly start, energetic later. Music cuts off at 22:00 per govt rule — the DJ keeps going indoors.', day: 2, date: '2026-12-28', startTime: '21:30', endTime: '24:00', venue: 'Manachira Rooftop, Gokulam Grand', category: 'cultural', icon: '🎉', isFeatured: true },

  // December 29, 2026 — checkout only (no planned activities)
  { id: 'evt-d3-03', title: 'Hotel Check-out & Departure Shuttles', description: 'Checkout by 12:00 — no planned activities on the 29th. Breakfast per your own hotel reservation. Shuttles run in staggered waves to the airport / railway station; optional Kerala tour extensions from here.', day: 3, date: '2026-12-29', startTime: '12:00', endTime: '18:00', venue: 'Gokulam Grand → Airport / Station', category: 'social', icon: '👋', isFeatured: false },
];

export const eventCategories = [
  { id: 'all', label: 'All Events', icon: '📋' },
  { id: 'ceremony', label: 'Ceremony', icon: '🏛️' },
  { id: 'cultural', label: 'Cultural', icon: '🎭' },
  { id: 'campus', label: 'Campus', icon: '🎓' },
  { id: 'social', label: 'Social', icon: '🍽️' },
];

export const eventDays = [
  { day: 1, date: '2026-12-27', label: 'Day 1 - Dec 27', subtitle: 'Check-in & Ice-Breaker' },
  { day: 2, date: '2026-12-28', label: 'Day 2 - Dec 28', subtitle: 'Campus & Gala' },
  { day: 3, date: '2026-12-29', label: 'Checkout - Dec 29', subtitle: 'Departure only' },
];
