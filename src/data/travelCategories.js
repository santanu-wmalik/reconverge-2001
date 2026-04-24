// Category catalogue for the free-form Travel planner. Each category declares
// the fields captured on the item form. Extend this list to add more item
// types; the UI auto-picks up new categories.

export const TRAVEL_CATEGORIES = [
  {
    id: 'flight',
    label: 'Flight',
    icon: '✈️',
    accent: 'from-sky-500/10 to-primary-900/20 border-sky-400/30',
    fields: [
      { name: 'airline', label: 'Airline', placeholder: 'e.g. IndiGo' },
      { name: 'flightNo', label: 'Flight no.', placeholder: 'e.g. 6E-2345' },
      { name: 'fromAirport', label: 'From (airport)', placeholder: 'BLR · DEL · DXB…' },
      { name: 'toAirport', label: 'To (airport)', placeholder: 'CCJ (Calicut)', default: 'CCJ (Calicut)' },
      { name: 'arrivalDate', label: 'Arrival date', type: 'date' },
      { name: 'arrivalTime', label: 'Arrival time', type: 'time' },
      { name: 'terminal', label: 'Terminal (optional)', placeholder: 'T1 / T2 / Intl' },
    ],
  },
  {
    id: 'train',
    label: 'Train',
    icon: '🚆',
    accent: 'from-amber-500/10 to-primary-900/20 border-amber-400/30',
    fields: [
      { name: 'trainNo', label: 'Train number + name', placeholder: 'e.g. 12601 · Chennai–Mangalore Mail' },
      { name: 'fromStation', label: 'Boarding station', placeholder: 'e.g. MAS' },
      { name: 'toStation', label: 'Arrival station', placeholder: 'CLT (Kozhikode)', default: 'CLT (Kozhikode)' },
      { name: 'arrivalDate', label: 'Arrival date', type: 'date' },
      { name: 'arrivalTime', label: 'Arrival time', type: 'time' },
    ],
  },
  {
    id: 'self-drive',
    label: 'Self-drive / Road trip',
    icon: '🚗',
    accent: 'from-emerald-500/10 to-primary-900/20 border-emerald-400/30',
    fields: [
      { name: 'fromCity', label: 'From city', placeholder: 'e.g. Bangalore' },
      { name: 'route', label: 'Route (optional)', placeholder: 'e.g. via Mysore–Bandipur' },
      { name: 'arrivalDate', label: 'ETA date', type: 'date' },
      { name: 'arrivalTime', label: 'ETA time', type: 'time' },
      { name: 'vehicle', label: 'Vehicle (optional)', placeholder: 'e.g. SUV / Sedan' },
    ],
  },
  {
    id: 'carpool-offer',
    label: 'Carpool — offering',
    icon: '🧳',
    accent: 'from-gold-500/10 to-primary-900/20 border-gold-400/40',
    fields: [
      { name: 'fromCity', label: 'From city', placeholder: 'e.g. Bangalore' },
      { name: 'departureDate', label: 'Departure date', type: 'date' },
      { name: 'departureTime', label: 'Departure time', type: 'time' },
      { name: 'seatsAvailable', label: 'Seats available', type: 'number', min: 1, max: 8, default: 3 },
      { name: 'vehicle', label: 'Vehicle', placeholder: 'e.g. SUV / Sedan' },
      { name: 'contactPref', label: 'Contact via', placeholder: 'WhatsApp / phone / email' },
    ],
  },
  {
    id: 'carpool-request',
    label: 'Carpool — looking for a ride',
    icon: '🙋',
    accent: 'from-fuchsia-500/10 to-primary-900/20 border-fuchsia-400/30',
    fields: [
      { name: 'fromCity', label: 'From city', placeholder: 'e.g. Chennai' },
      { name: 'pax', label: 'How many of you', type: 'number', min: 1, max: 6, default: 1 },
      { name: 'earliestDate', label: 'Earliest date', type: 'date' },
      { name: 'latestDate', label: 'Latest date', type: 'date' },
      { name: 'flexibility', label: 'Flexibility (optional)', placeholder: 'e.g. can leave night before' },
    ],
  },
  {
    id: 'accommodation',
    label: 'Accommodation (outside the batch block)',
    icon: '🏨',
    accent: 'from-primary-500/10 to-primary-900/20 border-primary-400/30',
    fields: [
      { name: 'property', label: 'Hotel / Airbnb', placeholder: 'e.g. Dimora, Calicut' },
      { name: 'checkInDate', label: 'Check-in', type: 'date' },
      { name: 'checkOutDate', label: 'Check-out', type: 'date' },
      { name: 'roommate', label: 'Sharing with (optional)', placeholder: 'Name of batchmate' },
    ],
  },
  {
    id: 'pickup',
    label: 'Airport / Rail pickup preference',
    icon: '🚐',
    accent: 'from-cyan-500/10 to-primary-900/20 border-cyan-400/30',
    fields: [
      {
        name: 'preference',
        label: 'How will you get from the airport / station?',
        type: 'select',
        options: ['Batch shuttle', 'Own cab / taxi', 'Family collection', 'Hotel transfer'],
      },
      { name: 'contactPoint', label: 'Pickup point', placeholder: 'Calicut Airport · Calicut Rly · KSRTC bus' },
      { name: 'arrivalDate', label: 'Arrival date', type: 'date' },
      { name: 'arrivalTime', label: 'Arrival time', type: 'time' },
    ],
  },
  {
    id: 'pre-event',
    label: 'Pre-event plans',
    icon: '🌴',
    accent: 'from-lime-500/10 to-primary-900/20 border-lime-400/30',
    fields: [
      { name: 'location', label: 'Where', placeholder: 'e.g. Wayanad · Trivandrum · at family home' },
      { name: 'fromDate', label: 'From', type: 'date' },
      { name: 'toDate', label: 'To', type: 'date' },
      { name: 'openToCompany', label: 'Open to company?', type: 'select', options: ['Yes, join me', 'Flexible', 'Solo / family only'] },
    ],
  },
  {
    id: 'post-event',
    label: 'Post-event Kerala tour',
    icon: '🗺️',
    accent: 'from-teal-500/10 to-primary-900/20 border-teal-400/30',
    fields: [
      { name: 'destination', label: 'Destination', placeholder: 'e.g. Munnar, Alleppey backwaters, Wayanad' },
      { name: 'fromDate', label: 'From', type: 'date' },
      { name: 'toDate', label: 'To', type: 'date' },
      { name: 'openToCompany', label: 'Open to company?', type: 'select', options: ['Yes, join me', 'Flexible', 'Solo / family only'] },
    ],
  },
  {
    id: 'accessibility',
    label: 'Accessibility / medical note',
    icon: '♿',
    accent: 'from-rose-500/10 to-primary-900/20 border-rose-400/30',
    fields: [
      { name: 'needs', label: 'What you\u2019d like us to plan for', placeholder: 'Wheelchair access, mobility help, dietary / medical specifics…' },
    ],
  },
  {
    id: 'note',
    label: 'Free-text note',
    icon: '📝',
    accent: 'from-slate-400/10 to-primary-900/20 border-slate-400/30',
    fields: [
      { name: 'body', label: 'Anything else', placeholder: 'Use this for anything that doesn\u2019t fit the other categories' },
    ],
  },
];

// Three visibility levels per item. Default is 'private' so people actively
// opt in to sharing. No public-web option — travel details stay inside the
// batch.
export const VISIBILITY_LEVELS = [
  { id: 'private', label: 'Private', icon: '🔒', blurb: 'Only you + the Travel committee can see this' },
  { id: 'alumni', label: 'Registered alumni', icon: '🎟️', blurb: 'Visible to any logged-in batchmate on the Who\u2019s Coming board' },
  { id: 'specific', label: 'Specific people', icon: '👥', blurb: 'Pick batchmates individually (available after registration launch)' },
];

export function getCategory(id) {
  return TRAVEL_CATEGORIES.find((c) => c.id === id);
}
