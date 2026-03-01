export const eventSchedule = [
  // Day 1 - December 27, 2026 (Check-in Day)
  { id: 'evt-001', title: 'Checking in to hotel rooms & relaxing', description: 'Welcome back to Calicut City! Check in to your respective hotel rooms!', day: 1, date: '2026-12-27', startTime: '14:00', endTime: '17:30', venue: 'Calicut City', category: 'social', icon: '🏨', isFeatured: false },
  { id: 'evt-002', title: 'Registration Desk Opens', description: 'Collect your goodies, meet your friends and chill!', day: 1, date: '2026-12-27', startTime: '17:30', endTime: '18:30', venue: 'Hotel Lobby (TBD)', category: 'ceremony', icon: '📋', isFeatured: false },
  { id: 'evt-003', title: 'REConverge Gala Program', description: 'Welcome note, REConverge performances, Bakwas Stories!', day: 1, date: '2026-12-27', startTime: '18:30', endTime: '19:30', venue: 'Hotel Convention Hall (TBD)', category: 'cultural', icon: '🎭', isFeatured: true },
  { id: 'evt-004', title: 'Musical Evening & Gala Dinner', description: 'Gala Dinner, sharing memories, and meeting the old friends!', day: 1, date: '2026-12-27', startTime: '19:30', endTime: '23:30', venue: 'Hotel Convention Hall (TBD)', category: 'social', icon: '🍽️', isFeatured: true },

  // Day 2 - December 28, 2026 (Main Event Day at Campus)
  { id: 'evt-005', title: 'Breakfast @ Hotel', description: 'Have breakfast at the hotel & wait for the buses to pick you up!', day: 2, date: '2026-12-28', startTime: '07:00', endTime: '08:15', venue: 'Hotel (TBD)', category: 'social', icon: '☕', isFeatured: false },
  { id: 'evt-006', title: 'Buses depart to NIT Calicut Campus', description: 'Enjoy the ride from City to the Campus!', day: 2, date: '2026-12-28', startTime: '08:15', endTime: '08:30', venue: 'Hotel Lobby', category: 'social', icon: '🚌', isFeatured: false },
  { id: 'evt-007', title: 'Arrival at NIT Calicut Campus', description: 'Enjoy the fresh air of REC Calicut all over again!', day: 2, date: '2026-12-28', startTime: '09:30', endTime: '10:00', venue: 'Assemble at Rajpath', category: 'campus', icon: '🎓', isFeatured: true },
  { id: 'evt-008', title: 'Batch Procession @ Rajpath', description: 'Relive the memories of walking down the Rajpath', day: 2, date: '2026-12-28', startTime: '10:00', endTime: '10:15', venue: 'Rajpath', category: 'ceremony', icon: '🚶', isFeatured: true },
  { id: 'evt-009', title: 'Batch / Branch wise Photos', description: 'Group Photos of all branches and batch photos!', day: 2, date: '2026-12-28', startTime: '10:15', endTime: '11:00', venue: 'NITC Auditorium', category: 'campus', icon: '📸', isFeatured: false },
  { id: 'evt-010', title: 'REConverge @ NITC - Alumni Day Function', description: 'Address by Faculty & Alumni, felicitation ceremony, Remembrance of Batchmates', day: 2, date: '2026-12-28', startTime: '11:00', endTime: '13:00', venue: 'NITC Auditorium', category: 'ceremony', icon: '🏛️', isFeatured: true },
  { id: 'evt-011', title: 'Kerala Traditional Sadhya', description: 'Traditional Sadhya Lunch', day: 2, date: '2026-12-28', startTime: '13:00', endTime: '14:30', venue: 'Hostel Mess (TBD)', category: 'social', icon: '🍌', isFeatured: true },
  { id: 'evt-012', title: 'Relaxed Campus Tour & Photo Sessions', description: 'After sumptuous lunch, walk around the hostels, departments, and other places that you may have missed during your stay at NITC', day: 2, date: '2026-12-28', startTime: '14:30', endTime: '16:30', venue: 'NITC Campus', category: 'campus', icon: '🗺️', isFeatured: false },
  { id: 'evt-013', title: 'Buses depart to Hotel', description: 'Buses will depart to Hotel', day: 2, date: '2026-12-28', startTime: '16:30', endTime: '17:00', venue: 'NITC Campus', category: 'social', icon: '🚌', isFeatured: false },
  { id: 'evt-014', title: 'Reach back Calicut City & relax', description: 'Relax at the hotel', day: 2, date: '2026-12-28', startTime: '17:00', endTime: '19:00', venue: 'Hotel (TBD)', category: 'social', icon: '🛌', isFeatured: false },
  { id: 'evt-015', title: 'Branch Wise Dinner', description: 'Meet & Greet with your branch mates once again before we say goodbye', day: 2, date: '2026-12-28', startTime: '19:00', endTime: '23:00', venue: 'Different Venues (TBD)', category: 'social', icon: '🥘', isFeatured: true },

  // Day 3 - December 29, 2026 (Departure Day)
  { id: 'evt-016', title: 'Relaxed Breakfast @ Hotel', description: 'Breakfast time', day: 3, date: '2026-12-29', startTime: '07:30', endTime: '09:30', venue: 'Hotel', category: 'social', icon: '☕', isFeatured: false },
  { id: 'evt-017', title: 'Checkout & Departure', description: 'Checkout & proceed to your destination(s) or optional Kerala Tour', day: 3, date: '2026-12-29', startTime: '09:30', endTime: '12:00', venue: 'Hotel', category: 'social', icon: '👋', isFeatured: false },
];

export const eventCategories = [
  { id: 'all', label: 'All Events', icon: '📋' },
  { id: 'ceremony', label: 'Ceremony', icon: '🏛️' },
  { id: 'cultural', label: 'Cultural', icon: '🎭' },
  { id: 'campus', label: 'Campus', icon: '🎓' },
  { id: 'social', label: 'Social', icon: '🍽️' },
];

export const eventDays = [
  { day: 1, date: '2026-12-27', label: 'Day 1 - Dec 27', subtitle: 'Check-in & Gala' },
  { day: 2, date: '2026-12-28', label: 'Day 2 - Dec 28', subtitle: 'Campus Day' },
  { day: 3, date: '2026-12-29', label: 'Day 3 - Dec 29', subtitle: 'Departure' },
];
