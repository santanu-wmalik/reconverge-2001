const BASE = 'https://storage.googleapis.com/reconverge-2001-uat-bucket/landing_page_pictures/';

export const galleryPhotos = [
  { id: 'g1', url: BASE + 'IMG-20260209-WA0016.jpg', caption: 'Batch of 2001 - Then', category: 'batch' },
  { id: 'g2', url: BASE + 'IMG-20260209-WA0024.jpg', caption: 'Batch of 2001 - Now', category: 'batch' },
  { id: 'g3', url: BASE + 'IMG-20260209-WA0025.jpg', caption: 'Campus memories', category: 'campus' },
  { id: 'g4', url: BASE + 'IMG-20260209-WA0027.jpg', caption: 'College days', category: 'campus' },
  { id: 'g5', url: BASE + 'IMG-20260209-WA0029.jpg', caption: 'Friends forever', category: 'hostel' },
  { id: 'g6', url: BASE + 'IMG-20260209-WA0031.jpg', caption: 'The good old days', category: 'events' },
  { id: 'g7', url: BASE + 'Kerela day.jpeg', caption: 'Kerala Day celebrations', category: 'events' },
  { id: 'g8', url: BASE + 'Manoj & Gang.jpeg', caption: 'Manoj & Gang', category: 'hostel' },
  { id: 'g9', url: BASE + 'Sreejith college pic.jpeg', caption: 'Sreejith - College days', category: 'batch' },
  { id: 'g10', url: BASE + 'WhatsApp Image 2020-07-02 at 9.31.44 AM.jpeg', caption: 'Reunion memories', category: 'events' },
  { id: 'p-001', url: BASE + 'NITC-Rajpath1.jpg', caption: 'The iconic Rajpath', category: 'campus' },
  { id: 'p-002', url: BASE + 'calicut mini canteen.avif', caption: 'The legendary mini canteen', category: 'campus' },
  { id: 'p-003', url: BASE + 'calicut railway station.jpg', caption: 'Calicut Railway Station', category: 'campus' },
  { id: 'p-004', url: BASE + 'nitc-mainblock-1.jpeg', caption: 'NIT Calicut Main Block', category: 'campus' },
];

export const galleryVideos = [
  { id: 'v-001', thumbnail: 'https://placehold.co/600x340/1e3a5f/d4a843?text=Batch+Video', title: 'Class of 2001 - The Journey', duration: '12:45', category: 'documentary' },
  { id: 'v-002', thumbnail: 'https://placehold.co/600x340/e83e8c/ffffff?text=Cultural', title: 'Ragam & Tathva Highlights', duration: '8:30', category: 'events' },
  { id: 'v-003', thumbnail: 'https://placehold.co/600x340/2d5a8e/f8fafc?text=Campus', title: 'Virtual Campus Tour 2026', duration: '15:20', category: 'campus' },
];

export const galleryCategories = [
  { id: 'all', label: 'All' },
  { id: 'batch', label: 'Batch Photos' },
  { id: 'hostel', label: 'Hostel Life' },
  { id: 'events', label: 'Events' },
  { id: 'campus', label: 'Campus' },
];
