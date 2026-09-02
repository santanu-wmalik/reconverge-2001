// Canonical 3-tier language for a batchmate's engagement with the reunion.
// Every user-facing label + colour anywhere on the site should draw from
// this file — no inline strings like "Registered" / "RSVPed" / "Paid".
//
//   shown_interest   — dropped a name+email via the quick RSVP form (no acct)
//   signed_up        — created a full account on the site (isRegistered)
//   paid_attending   — Finance Committee has verified their payment
//
// `stateForAlumnus` collapses an alumnus row into one of the three.
// `stateForRsvp`   collapses a public RSVP submission (always Shown Interest).

export const INTEREST_STATES = {
  shown_interest: {
    key: 'shown_interest',
    label: 'Shown Interest',
    short: 'Interest',
    tone: 'sky',            // sky-300 badge
  },
  signed_up: {
    key: 'signed_up',
    label: 'Signed Up',
    short: 'Signed Up',
    tone: 'gold',
  },
  paid_attending: {
    key: 'paid_attending',
    label: 'Paid & Attending',
    short: 'Attending',
    tone: 'emerald',
  },
};

export function stateForAlumnus(a) {
  if (!a) return INTEREST_STATES.shown_interest;
  if (a.paymentStatus === 'paid' || a.paymentStatus === 'confirmed') {
    return INTEREST_STATES.paid_attending;
  }
  if (a.isRegistered) return INTEREST_STATES.signed_up;
  return INTEREST_STATES.shown_interest;
}

export function stateForRsvp() {
  return INTEREST_STATES.shown_interest;
}
