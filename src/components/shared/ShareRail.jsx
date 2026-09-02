// Floating left-hand share rail — WhatsApp only (Facebook / X removed per
// volunteer request), visible on every screen size including phones.
// 44px hit area for touch.

const SITE = 'https://reconverge-2001.onrender.com/';
const TEXT = 'REC Calicut Class of 2001 — Silver Jubilee Reunion, 27–28 Dec 2026. Come home.';

export default function ShareRail() {
  const href = `https://wa.me/?text=${encodeURIComponent(`${TEXT} ${SITE}`)}`;
  return (
    <div className="flex fixed left-0 top-1/2 -translate-y-1/2 z-40">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        title="Share on WhatsApp"
        className="w-11 h-11 flex items-center justify-center text-white rounded-r-md shadow-md hover:w-13 transition-all"
        style={{ background: '#25d366' }}
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
          <path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.5 4.1 1.6 5.9L0 24l6.5-1.7a11.8 11.8 0 0 0 5.6 1.4c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.1-3.4-8.4zM12.1 21.7c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.8 9.8 0 0 1-1.5-5.2c0-5.4 4.4-9.8 9.9-9.8 2.6 0 5.1 1 6.9 2.9a9.7 9.7 0 0 1 2.9 6.9c0 5.4-4.4 9.9-9.8 9.9zm5.4-7.3c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.4-1.5-.9-.8-1.5-1.8-1.6-2.1-.2-.3 0-.5.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4z" />
        </svg>
      </a>
    </div>
  );
}
