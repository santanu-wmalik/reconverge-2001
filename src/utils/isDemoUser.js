// Demo accounts (alumni@email.com, admin@email.com, superuser@email.com) are
// seeded on a fresh database so anybody can log in and try the app. They
// shouldn't appear in any stat / list / blast — they are not real alumni.
// Filter with the helper below wherever we count or enumerate alumni.

export const DEMO_EMAILS = new Set([
  'alumni@email.com',
  'admin@email.com',
  'superuser@email.com',
]);

export function isDemoUser(userLike) {
  if (!userLike) return false;
  const email = String(userLike.email || '').trim().toLowerCase();
  return DEMO_EMAILS.has(email);
}
