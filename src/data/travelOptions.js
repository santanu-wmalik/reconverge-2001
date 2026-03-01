export const hotels = [
  { id: 'hotel-001', name: 'Hotel Sangam', distance: '8 km from campus', priceRange: '3,500 - 6,000', rating: 4.3, amenities: ['WiFi', 'Pool', 'Restaurant', 'Parking'], image: 'https://placehold.co/400x250/1e3a5f/d4a843?text=Sangam', special: 'Alumni discount: 15% off' },
  { id: 'hotel-002', name: 'Kadavu Resorts', distance: '12 km from campus', priceRange: '4,000 - 7,000', rating: 4.4, amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'River View'], image: 'https://placehold.co/400x250/2d5a8e/f8fafc?text=Kadavu', special: 'Event partner hotel' },
  { id: 'hotel-003', name: 'Grand Gardenia', distance: '10 km from campus', priceRange: '3,500 - 8,000', rating: 4.5, amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym'], image: 'https://placehold.co/400x250/0b1a2c/d4a843?text=Gardenia', special: 'Official event partner' },
  { id: 'hotel-004', name: 'Hycinth by Sparsa', distance: '9 km from campus', priceRange: '3,000 - 5,500', rating: 4.2, amenities: ['WiFi', 'Restaurant', 'Parking', 'Gym'], image: 'https://placehold.co/400x250/374151/f8fafc?text=Hycinth', special: 'Booking code: TBD' },
];

export const carpoolOffers = [
  { id: 'cp-001', driverName: 'Suresh Menon', fromCity: 'Kochi', departureDate: '2026-12-26', departureTime: '06:00', seatsAvailable: 3, vehicleType: 'SUV' },
  { id: 'cp-002', driverName: 'Nandini Reddy', fromCity: 'Bangalore', departureDate: '2026-12-26', departureTime: '04:00', seatsAvailable: 2, vehicleType: 'Sedan' },
  { id: 'cp-003', driverName: 'Arun Balaji', fromCity: 'Bangalore', departureDate: '2026-12-26', departureTime: '05:30', seatsAvailable: 4, vehicleType: 'SUV' },
  { id: 'cp-004', driverName: 'Karthik Sundaram', fromCity: 'Coimbatore', departureDate: '2026-12-26', departureTime: '08:00', seatsAvailable: 3, vehicleType: 'Sedan' },
];

export const shuttleSchedule = [
  { id: 'sh-001', from: 'Calicut Airport', to: 'Hotels in City', departureTime: '10:00', date: '2026-12-27', capacity: 40, booked: 28 },
  { id: 'sh-002', from: 'Calicut Airport', to: 'Hotels in City', departureTime: '14:00', date: '2026-12-27', capacity: 40, booked: 35 },
  { id: 'sh-003', from: 'Hotels in City', to: 'NIT Calicut Campus', departureTime: '08:15', date: '2026-12-28', capacity: 50, booked: 42 },
  { id: 'sh-004', from: 'NIT Calicut Campus', to: 'Hotels in City', departureTime: '16:30', date: '2026-12-28', capacity: 50, booked: 40 },
  { id: 'sh-005', from: 'Hotels in City', to: 'Calicut Airport', departureTime: '10:00', date: '2026-12-29', capacity: 40, booked: 30 },
];

export const cityWiseAlumni = [
  { city: 'Bangalore', count: 45 }, { city: 'Chennai', count: 32 }, { city: 'Kochi', count: 28 },
  { city: 'Mumbai', count: 22 }, { city: 'Trivandrum', count: 18 }, { city: 'Hyderabad', count: 16 },
  { city: 'Delhi NCR', count: 15 }, { city: 'Pune', count: 12 }, { city: 'Kozhikode', count: 10 },
  { city: 'USA', count: 28 }, { city: 'UK', count: 12 }, { city: 'Singapore', count: 8 },
];
