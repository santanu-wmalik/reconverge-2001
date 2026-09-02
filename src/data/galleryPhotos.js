const BASE = 'https://storage.googleapis.com/reconverge-2001-uat-bucket/landing_page_pictures/';
const SCANS = '/gallery-scans/';

// Generated list of 50 scanned prints dropped into public/gallery-scans/.
// File names come straight from the scan session (8 Feb 2026). To add more,
// drop the file in public/gallery-scans/ and append an entry here (or replace
// this block with an `import.meta.glob` driven helper if volume grows).
const scannedNames = [
  'Scanned_20260208-1135.jpg',
  'Scanned_20260208-1136.jpg',
  'Scanned_20260208-1137(1).jpg',
  'Scanned_20260208-1137.jpg',
  'Scanned_20260208-1139.jpg',
  'Scanned_20260208-1140.jpg',
  'Scanned_20260208-1141.jpg',
  'Scanned_20260208-1144.jpg',
  'Scanned_20260208-1146.jpg',
  'Scanned_20260208-1148.jpg',
  'Scanned_20260208-1149.jpg',
  'Scanned_20260208-1150(1).jpg',
  'Scanned_20260208-1150.jpg',
  'Scanned_20260208-1151.jpg',
  'Scanned_20260208-1152.jpg',
  'Scanned_20260208-1153.jpg',
  'Scanned_20260208-1154.jpg',
  'Scanned_20260208-1155.jpg',
  'Scanned_20260208-1157(1).jpg',
  'Scanned_20260208-1157.jpg',
  'Scanned_20260208-1158.jpg',
  'Scanned_20260208-1200(1).jpg',
  'Scanned_20260208-1200.jpg',
  'Scanned_20260208-1201.jpg',
  'Scanned_20260208-1203.jpg',
  'Scanned_20260208-1204.jpg',
  'Scanned_20260208-1205.jpg',
  'Scanned_20260208-1206.jpg',
  'Scanned_20260208-1207.jpg',
  'Scanned_20260208-1208.jpg',
  'Scanned_20260208-1209.jpg',
  'Scanned_20260208-1210.jpg',
  'Scanned_20260208-1211.jpg',
  'Scanned_20260208-1212.jpg',
  'Scanned_20260208-1213.jpg',
  'Scanned_20260208-1214.jpg',
  'Scanned_20260208-1216.jpg',
  'Scanned_20260208-1217.jpg',
  'Scanned_20260208-1219.jpg',
  'Scanned_20260208-1220.jpg',
  'Scanned_20260208-1221.jpg',
  'Scanned_20260208-1222.jpg',
  'Scanned_20260208-1223.jpg',
  'Scanned_20260208-1225.jpg',
  'Scanned_20260208-1229.jpg',
  'Scanned_20260208-1230(1).jpg',
  'Scanned_20260208-1230.jpg',
  'Scanned_20260208-1231.jpg',
  'Scanned_20260208-1232.jpg',
  'Scanned_20260208-1233.jpg',
];

const scannedPhotos = scannedNames.map((fileName, i) => ({
  id: `scan-${String(i + 1).padStart(3, '0')}`,
  url: SCANS + encodeURIComponent(fileName),
  caption: `Archive scan · ${String(i + 1).padStart(2, '0')} of ${scannedNames.length}`,
  category: 'archive',
}));

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
  ...scannedPhotos,
];

// Curated batch videos. To add more, append an entry with a YouTube URL —
// the gallery page parses out the video id and renders an inline player.
export const galleryVideos = [
  {
    id: 'v-townhall-2026-04',
    title: 'Golden memories - 1',
    description: 'First batch-wide sync (Apr 2026). Title reveal, website walkthrough, run order, Giveback, budget, and Q&A.',
    youtubeUrl: 'https://www.youtube.com/watch?v=Jiz1OKUVI8A',
    publishedAt: '2026-04-25',
  },
];

export const galleryCategories = [
  { id: 'all', label: 'All' },
  { id: 'batch', label: 'Batch Photos' },
  { id: 'hostel', label: 'Hostel Life' },
  { id: 'events', label: 'Events' },
  { id: 'campus', label: 'Campus' },
];
