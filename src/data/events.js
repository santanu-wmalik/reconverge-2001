// Event schedule distilled from the xlsx "Day-wise Run Sheet" tab.
// Timings kept in sync with the latest MoM decision (Gala moved to Day 2).

export const eventSchedule = [
  // Day 1 - December 27, 2026 (Check-in & Ice-Breaker)
  { id: 'evt-d1-01', title: 'Airport & Rail Pickups', description: 'Staggered shuttles from Calicut Airport and Railway station to Gokulam Grand. See the Travel page for exact bus times.', day: 1, date: '2026-12-27', startTime: '10:00', endTime: '17:00', venue: 'Calicut Airport / Rly Stn', category: 'social', icon: '🚐', isFeatured: false },
  { id: 'evt-d1-02', title: 'Hotel Check-in & Registration Desk', description: 'Check in at Gokulam Grand and collect your souvenir kit + badge at the registration desk in the lobby.', day: 1, date: '2026-12-27', startTime: '12:00', endTime: '17:30', venue: 'Gokulam Grand Lobby', category: 'ceremony', icon: '📋', isFeatured: false },
  { id: 'evt-d1-03', title: 'High-Tea & Informal Speed-Reconnect', description: 'Snacks, tea, and deliberately randomised seating to help people reconnect with batchmates they haven\u2019t seen in 25 years.', day: 1, date: '2026-12-27', startTime: '15:00', endTime: '17:00', venue: 'Hotel Common Area', category: 'social', icon: '☕', isFeatured: false },
  { id: 'evt-d1-04', title: 'Welcome Address & Housekeeping Brief', description: 'Short welcome from the OCC with a quick walkthrough of the two-day plan.', day: 1, date: '2026-12-27', startTime: '17:30', endTime: '18:00', venue: 'Hotel Banquet Hall', category: 'ceremony', icon: '🎤', isFeatured: false },
  { id: 'evt-d1-05', title: 'Ice-Breaker & Cultural Evening by Batchmates', description: 'Performances from the batch — Bakwas Stories, music, and the nostalgia AV to kick off the reunion. Senior batch feedback: "give this more time".', day: 1, date: '2026-12-27', startTime: '18:00', endTime: '21:30', venue: 'Hotel Banquet Hall', category: 'cultural', icon: '🎭', isFeatured: true },
  { id: 'evt-d1-06', title: 'Buffet Dinner with Modest Programme', description: 'Conversation-friendly dinner at the hotel — small groups, informal.', day: 1, date: '2026-12-27', startTime: '21:30', endTime: '23:00', venue: 'Hotel Dining', category: 'social', icon: '🍽️', isFeatured: false },

  // Day 2 - December 28, 2026 (Campus + Gala)
  { id: 'evt-d2-01', title: 'Breakfast @ Gokulam Grand', description: 'Buffet breakfast (included with the room). Be at the lobby by 08:45 for the buses.', day: 2, date: '2026-12-28', startTime: '07:00', endTime: '09:00', venue: 'Gokulam Grand', category: 'social', icon: '☕', isFeatured: false },
  { id: 'evt-d2-02', title: 'Buses Depart to NIT Calicut (5 × 44-seater)', description: 'Five buses leave the hotel between 09:00 and 09:45. A coordinator + bus marshal is assigned per bus; water and snacks onboard.', day: 2, date: '2026-12-28', startTime: '09:00', endTime: '09:45', venue: 'Gokulam Grand → NITC', category: 'social', icon: '🚌', isFeatured: false },
  { id: 'evt-d2-03', title: 'Gate Welcome, Campus Tour & Procession', description: 'Chendamelam welcome at the gate, photo ops with Kathakali artists, and a walk through the new departments.', day: 2, date: '2026-12-28', startTime: '10:00', endTime: '11:00', venue: 'NITC Campus', category: 'campus', icon: '🚶', isFeatured: true },
  { id: 'evt-d2-04', title: 'NITC Auditorium Programme', description: 'Faculty & alumni addresses, felicitation ceremony, and the Remembrance segment honouring batchmates no longer with us.', day: 2, date: '2026-12-28', startTime: '11:00', endTime: '12:30', venue: 'NITC Auditorium', category: 'ceremony', icon: '🏛️', isFeatured: true },
  { id: 'evt-d2-05', title: 'Kerala Sadya on Campus', description: 'Traditional banana-leaf Sadya lunch at the NITC dining hall. Casual seating; staff gratitude moment.', day: 2, date: '2026-12-28', startTime: '12:30', endTime: '14:00', venue: 'NITC Dining Hall', category: 'social', icon: '🍌', isFeatured: true },
  { id: 'evt-d2-06', title: 'Hostel / Department Visits & Free Roaming', description: 'Optional — walk the hostels, departments, and "Back to class" sessions with professors.', day: 2, date: '2026-12-28', startTime: '14:00', endTime: '16:00', venue: 'NITC Campus', category: 'campus', icon: '🗺️', isFeatured: false },
  { id: 'evt-d2-07', title: 'Return Buses to Hotel', description: 'Return buses run 16:00–17:00. Rest time at the hotel before the evening.', day: 2, date: '2026-12-28', startTime: '16:00', endTime: '17:00', venue: 'NITC → Gokulam Grand', category: 'social', icon: '🚌', isFeatured: false },
  { id: 'evt-d2-08', title: 'Red-Carpet Entry & Batch Photo', description: 'Themed entry at the banquet hall followed by the headline batch photo (pre-planned structure — seniors said this is worth every rupee).', day: 2, date: '2026-12-28', startTime: '18:00', endTime: '18:30', venue: 'Hotel Banquet Hall', category: 'campus', icon: '📸', isFeatured: true },
  { id: 'evt-d2-09', title: 'Nostalgia AV & Curtain-Raiser Video', description: 'Old photos, video messages from batchmates who couldn\u2019t make it, and the curtain-raiser to the evening.', day: 2, date: '2026-12-28', startTime: '18:30', endTime: '19:00', venue: 'Hotel Banquet Hall', category: 'cultural', icon: '🎞️', isFeatured: false },
  { id: 'evt-d2-10', title: '25-Year Batch Story & Giving Back Update', description: 'Transparent view on where the batch has come, where the Give Back contributions stand, and what the Health Centre target looks like.', day: 2, date: '2026-12-28', startTime: '19:00', endTime: '19:30', venue: 'Hotel Banquet Hall', category: 'ceremony', icon: '💛', isFeatured: false },
  { id: 'evt-d2-11', title: 'Gala Dinner with Live Counters', description: 'Multi-cuisine Gala dinner on the Manachira rooftop at Gokulam Grand. Welcome drink, buffet, dessert spread.', day: 2, date: '2026-12-28', startTime: '19:30', endTime: '21:30', venue: 'Manachira Rooftop, Gokulam Grand', category: 'social', icon: '🍽️', isFeatured: true },
  { id: 'evt-d2-12', title: 'Live Band + DJ Dance Party', description: 'Family-friendly start, energetic later. Music cuts off at 22:00 per govt rule — the DJ keeps going indoors.', day: 2, date: '2026-12-28', startTime: '21:30', endTime: '24:00', venue: 'Manachira Rooftop, Gokulam Grand', category: 'cultural', icon: '🎉', isFeatured: true },

  // Day 3 - December 29, 2026 (Departure)
  { id: 'evt-d3-01', title: 'Breakfast Brunch with Open Mic', description: 'Long breakfast with short reflections. MC keeps it casual — whoever wants to say something grabs the mic.', day: 3, date: '2026-12-29', startTime: '08:00', endTime: '11:00', venue: 'Hotel Dining', category: 'social', icon: '🎙️', isFeatured: true },
  { id: 'evt-d3-02', title: 'Interest-Group Corners', description: 'Self-selected corners — Entrepreneurs, Academia, Arts, Sports. Volunteers facilitate each corner so conversations don\u2019t stall.', day: 3, date: '2026-12-29', startTime: '11:00', endTime: '13:00', venue: 'Hotel Common Areas', category: 'social', icon: '🧭', isFeatured: false },
  { id: 'evt-d3-03', title: 'Hotel Check-out & Departure Shuttles', description: 'Checkout by 12:00. Shuttles run in staggered waves to the airport / railway station. Optional Kerala tour extensions from here.', day: 3, date: '2026-12-29', startTime: '12:00', endTime: '18:00', venue: 'Gokulam Grand → Airport / Station', category: 'social', icon: '👋', isFeatured: false },
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
  { day: 3, date: '2026-12-29', label: 'Day 3 - Dec 29', subtitle: 'Departure' },
];
