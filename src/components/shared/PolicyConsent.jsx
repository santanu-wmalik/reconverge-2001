import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  POLICY_VERSION, POLICY_EFFECTIVE, CONSENT_LABEL, DIRECTORY_LABEL, PHOTO_NOTICE,
} from '../../data/policies';

// Reusable consent block (registration Review step + re-acceptance modal).
export function ConsentFields({ agreed, setAgreed, directoryOptIn, setDirectoryOptIn }) {
  return (
    <div className="space-y-4 text-left">
      <div className="rounded-xl border border-forest-500/20 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-forest-700 mb-2">🛡️ Privacy &amp; Event Terms</p>
        <p className="text-xs text-ink-muted mb-3">
          Please review our{' '}
          <Link to="/privacy-policy" target="_blank" className="text-gold-700 underline underline-offset-2">Privacy Policy</Link>{' '}
          and{' '}
          <Link to="/terms" target="_blank" className="text-gold-700 underline underline-offset-2">Terms &amp; Conditions</Link>{' '}
          (version {POLICY_VERSION}, {POLICY_EFFECTIVE}).
        </p>
        <label className="flex items-start gap-2.5 cursor-pointer text-sm text-ink font-medium">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 accent-[#b8922a]"
            required
          />
          <span>{CONSENT_LABEL} <span className="text-red-700">*</span></span>
        </label>
      </div>

      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-800 mb-2">📷 Photography &amp; Video Notice</p>
        {PHOTO_NOTICE.map((p) => (
          <p key={p.slice(0, 20)} className="text-xs text-amber-900 leading-relaxed mb-1.5">{p}</p>
        ))}
      </div>

      <div className="rounded-xl border border-forest-500/20 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-forest-700 mb-2">👥 Reunion Directory (Optional)</p>
        <label className="flex items-start gap-2.5 cursor-pointer text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={directoryOptIn}
            onChange={(e) => setDirectoryOptIn(e.target.checked)}
            className="mt-0.5 accent-[#b8922a]"
          />
          <span>{DIRECTORY_LABEL}</span>
        </label>
      </div>
    </div>
  );
}

// Blocking re-acceptance modal: shows for any signed-in user whose accepted
// policy version differs from the current one (including never-accepted).
// Bump POLICY_VERSION in data/policies.js and every user is re-prompted.
export default function PolicyConsentModal() {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [agreed, setAgreed] = useState(false);
  const [directoryOptIn, setDirectoryOptIn] = useState(Boolean(user?.directoryOptIn));
  const [saving, setSaving] = useState(false);

  const needsConsent = isAuthenticated && user && user.policyVersion !== POLICY_VERSION;

  const accept = async () => {
    if (!agreed) return;
    setSaving(true);
    try {
      await updateProfile({
        policyVersion: POLICY_VERSION,
        policyAcceptedAt: new Date().toISOString(),
        directoryOptIn,
      });
    } catch (err) {
      showToast(err.message || 'Could not save — please try again', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {needsConsent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="max-w-lg w-full max-h-[90vh] overflow-y-auto bg-cream-50 border-2 border-gold-500/50 shadow-2xl p-6 sm:p-7"
            role="dialog"
            aria-modal="true"
            aria-label="Privacy and event terms"
          >
            <h2 className="text-2xl font-heading font-bold text-forest-700 mb-1 text-center">
              Privacy &amp; Event Terms
            </h2>
            <p className="text-sm text-ink-muted text-center mb-5">
              {user?.policyVersion
                ? 'Our policies have been updated — please review and accept to continue.'
                : 'Please review and accept our policies to continue using the portal.'}
            </p>
            <ConsentFields
              agreed={agreed}
              setAgreed={setAgreed}
              directoryOptIn={directoryOptIn}
              setDirectoryOptIn={setDirectoryOptIn}
            />
            <button
              type="button"
              onClick={accept}
              disabled={!agreed || saving}
              className="nav-caps w-full mt-5 px-6 py-3.5 bg-gradient-to-b from-gold-400 to-gold-600 text-forest-900 shadow hover:from-gold-300 hover:to-gold-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Agree & Continue'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
