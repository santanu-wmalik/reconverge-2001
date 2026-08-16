// Give Back data sourced from the official NITCAA Health Centre appeal
// (Backup/Give-Back/Health center project- Appeal (2).docx, HC Appeal with
// QR code.png, NITCAA Payment Process.png, register wnitcaa.jpg).
//
// The batch's Give Back contribution flows through NITCAA to the New Health
// Centre project (Susrutha Swastya Kendram) — the institute's flagship
// fundraise for the expanding NITC campus.
//
// ── Two separate accounts — do not mix ─────────────────────────────────
//   • REGISTRATION FEE  → `batchBankAccount` (below) — the CREC Alumni
//     Association 2001 Batch account at SBI NITC Campus, opened 01-Aug-2026.
//   • GIVE BACK DONATION → `paymentChannels.domestic` / `paymentChannels.fcra` —
//     the NITCAA project account. Contributions flow through NITCAA per
//     college mandate.
//
// The purpose line quoted with any Give Back transaction is "REC 2001 Batch
// — Health Centre" so NITCAA can reconcile per-batch (per Uma NITCAA on
// WhatsApp, 6-Aug-2026 process note).

// ── REConverge 2001 batch bank account (REGISTRATION FEE only) ─────────
// Opened at SBI NIT Calicut branch on 01-Aug-2026; announced on the
// volunteers group by Shyam the same day. Used only for the reunion
// registration fee and reunion expenses — never for Give Back donations.
export const batchBankAccount = {
  purpose: 'REConverge 2001 registration fee',
  beneficiary: 'CREC Alumni Association 2001 Batch',
  accountNumber: '45429696620',
  ifsc: 'SBIN0002207',
  bankBranch: 'State Bank of India — NIT Calicut Campus',
  branchCode: '02207',
  branchAddress: 'NIT Calicut Campus, Chathamangalam PO, Dist. Kozhikode, Kerala 673601',
  branchEmail: 'sbi.02207@sbi.co.in',
  branchPhones: ['9188937176', '9447788838'],
  accountType: 'SAVINGS / Association of Persons',
  openedOn: '2026-08-01',
  supports: ['NEFT', 'RTGS', 'IMPS', 'UPI'],
  paymentReferenceHint: 'Quote your Registration ID (SJ-2026-####) in the transfer remarks.',
};

export const healthCentreProject = {
  id: 'nitcaa-health-centre',
  name: 'Susrutha Swastya Kendram',
  subtitle: 'New Health Centre for NIT Calicut',
  flagship: true,
  totalCostCrore: 3.5,
  constructionCostCrore: 2.7,
  alreadyPledgedLakh: 47,
  alreadyPledgedBy: 'Class of 1999',
  timelineMonths: 10,
  wallOfHonorThresholdLakh: 1,
  taxSection: '80G',
  appealPosterUrl: '/give-back/hc-appeal.png',
  upiQrUrl: '/give-back/nitcaa-payment-qr.png',
  contactEmail: 'nitcaa@nitc.ac.in',
  upiId: 'nitcaaprojects.188@sbi',
  rationale: [
    'NIT Calicut, established in 1961, is home to ~10,000 people today — students, faculty, staff and families.',
    'Under NEP, student intake is set to rise by 40% and foreign admissions by 20%, nearly doubling the campus community in a few years.',
    'The on-campus health centre — built in the REC era — is outdated and inadequate for this scale.',
    'The institute and NITCAA are building a modern health centre to serve students, faculty, staff and families, reducing dependence on external hospitals.',
  ],
};

// Payment channels are taken verbatim from the NITCAA appeal document.
export const paymentChannels = {
  upi: {
    label: 'UPI / QR (fastest)',
    upiId: 'nitcaaprojects.188@sbi',
    qrImage: '/give-back/nitcaa-payment-qr.png',
    note: 'Scan with BHIM, UPI, YONO SBI, BHIM SBI Pay, G Pay, Paytm or WhatsApp Pay. After paying, email the transaction reference and your details to nitcaa@nitc.ac.in.',
  },
  domestic: {
    label: 'Indian bank transfer (residents, NRIs with Indian passport, Indian entities)',
    beneficiary: 'NIT Calicut Alumni Association (NITCAA)',
    accountNumber: '00000039195795299',
    bankBranch: 'SBI CREC Branch, NIT Calicut Campus, Chathamangalam, Kozhikode',
    branchCode: '02207',
    ifsc: 'SBIN0002207',
    swift: 'SBININBB392',
    accountType: 'SAVINGS (Domestic)',
  },
  fcra: {
    label: 'FCRA account (foreign citizens / non-Indian passport / foreign entities)',
    beneficiary: 'NIT Calicut Alumni Association',
    accountNumber: '42394734508',
    bankBranch: 'State Bank of India, New Delhi Main Branch, FCRA Cell, 4th Floor, 11 Sansadmarg, New Delhi 110011',
    branchCode: '00691',
    ifsc: 'SBIN0000691',
    swift: 'SBININBB104',
    accountType: 'FCRA Receipt cum Utilization',
  },
};

// Per Uma (NITCAA Office, 6-Aug-2026 WhatsApp): the info to submit for every
// donation. Mirrors the NITCAA thank-you email template that Aravind
// Parameswaran received for the 2000-batch Giving Back initiative.
export const paymentRequiredInfo = [
  'Donor name and branch',
  'Phone and email',
  'Amount (INR)',
  'Transaction reference (NEFT / RTGS / IMPS / UPI / SWIFT)',
  'Transaction date and mode of payment',
  'PAN — required for 80G receipt (Indian citizens only)',
  'Passport copy — for NRI / foreign citizens',
  'Purpose of contribution (quote: "REC 2001 Batch — Health Centre")',
  'Submit via the batch Google Form or email nitcaa@nitc.ac.in (with a copy to the REConverge 2001 Finance Committee for reconciliation).',
];

// NITCAA contribution process — Uma NITCAA, 6-Aug-2026. Explains what happens
// after the donor pays: how batches submit details, how NITCAA reconciles,
// receipts, thank-you emails, and Wall of Honor recognition.
export const nitcaaContributionProcess = [
  {
    step: 'Submit contribution details',
    detail:
      'Each donor submits their contribution details via the REConverge 2001 batch Google Form (circulated by the Finance Committee), or directly by emailing nitcaa@nitc.ac.in.',
  },
  {
    step: 'Batch coordinator maintains the list',
    detail:
      'The batch coordinator/team keeps the running contributor list. NITCAA also receives the contribution details via the project account.',
  },
  {
    step: 'NITCAA reconciles',
    detail:
      "NITCAA cross-checks contributions received in the project account against the batch coordinator's list.",
  },
  {
    step: '80G receipt (on request, if eligible)',
    detail:
      'NITCAA issues 80G receipts on request. Eligibility: Indian citizens who provide PAN and address, and who are eligible to claim the deduction under the applicable Old Tax Regime.',
  },
  {
    step: 'Thank-you email',
    detail: 'NITCAA sends a formal thank-you email to every contributor.',
  },
  {
    step: 'Donor Wall of Honor',
    detail:
      'Contributors of ₹1 lakh or more will have their names displayed on the Donor Wall of the New Health Centre.',
  },
];

// One-line eligibility note we surface next to the 80G tag anywhere it appears.
export const eightyGEligibilityNote =
  '80G receipts are issued only to Indian citizens who provide PAN and address, and who are eligible to claim the deduction under the applicable Old Tax Regime.';

// The Class of 2001's batch-level initiative: rally contributions to the
// NITCAA Health Centre, plus an optional support-staff welfare add-on.
export const giveBackInitiatives = [
  {
    id: 'init-health-centre',
    title: 'New Health Centre at NIT Calicut',
    description: 'The Susrutha Swastya Kendram — a modern, fully-equipped health centre to replace the outdated REC-era clinic. Our batch is rallying behind NITCAA\u2019s flagship project so students, faculty, staff and families can get essential care on campus.',
    status: 'active',
    icon: '🏥',
    flagship: true,
    details: [
      'Total project: ₹3.5 crore flagship · ₹2.7 crore construction',
      'Class of 1999 has already pledged ₹47 lakhs — momentum is real',
      'Built in 10 months once funded; managed jointly by the institute & NITCAA',
      'Individual contributions of ₹1 lakh+ are recognised on the Wall of Honor',
      'Tax-deductible under Section 80G (India); FCRA route available for international donors',
    ],
    link: '/give-back',
  },
  {
    id: 'init-support-staff',
    title: 'Supporting Staff Welfare (optional add-on)',
    description: 'A batch-level gesture for the non-teaching staff who were part of our daily campus life during 1997–2001 — an idea carried forward from our senior batch. Details will be finalised by the Giving Back Committee alongside the Health Centre drive.',
    status: 'discussion',
    icon: '🤲',
    details: [
      'Suggested by our senior batch (Class of 2000)',
      'Scoped separately from the Health Centre contribution',
      'Exact form and channel to be decided by GBC + NITCAA',
    ],
  },
];

// Impact stories / volunteer slots — will be populated from real commitments.
export const impactStories = [];
export const volunteerOpportunities = [];

// Keep for backward compatibility
export const campaigns = giveBackInitiatives;
export const mentorshipAreas = ['Software Engineering', 'Data Science & AI', 'Product Management', 'Entrepreneurship', 'Finance', 'Research', 'Manufacturing', 'Design'];
