import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animationVariants';
import { POLICY_VERSION, POLICY_EFFECTIVE, privacyPolicy, termsAndConditions } from '../../data/policies';

// Renders either policy document (public pages: /privacy-policy, /terms).
function PolicyDoc({ doc }) {
  return (
    <motion.div {...pageTransition} className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <span className="eyebrow">Reconverge 2001 Reunion</span>
        <h1 className="mt-3 text-4xl md:text-5xl font-heading font-medium italic text-forest-600">{doc.title}</h1>
        <p className="mt-2 font-serif text-ink-muted text-sm">
          Version {POLICY_VERSION} · Last Updated: {POLICY_EFFECTIVE}
        </p>
      </div>
      <div className="bg-white border border-forest-500/15 shadow-sm px-6 sm:px-10 py-8 space-y-5">
        {doc.sections.map((sec, i) => (
          <section key={i}>
            {sec.heading && (
              <h2 className="font-heading font-bold text-lg text-forest-700 mb-2">{sec.heading}</h2>
            )}
            {sec.paragraphs?.map((p, j) => (
              <p key={j} className="text-sm text-ink-soft leading-relaxed mb-2">{p}</p>
            ))}
            {sec.list && (
              <ul className="list-disc pl-6 text-sm text-ink-soft leading-relaxed space-y-1 mb-2">
                {sec.list.map((li) => <li key={li}>{li}</li>)}
              </ul>
            )}
            {sec.after?.map((p, j) => (
              <p key={j} className="text-sm text-ink-soft leading-relaxed mb-2">{p}</p>
            ))}
          </section>
        ))}
      </div>
    </motion.div>
  );
}

export function PrivacyPolicyPage() {
  return <PolicyDoc doc={privacyPolicy} />;
}

export default function TermsPage() {
  return <PolicyDoc doc={termsAndConditions} />;
}
