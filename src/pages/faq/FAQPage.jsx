import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQ_DATA } from '../../data/constants';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import SectionHeading from '../../components/shared/SectionHeading';
import GlassCard from '../../components/ui/GlassCard';

const ChevronIcon = ({ isOpen }) => (
  <motion.svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    animate={{ rotate: isOpen ? 180 : 0 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    style={{ flexShrink: 0 }}
  >
    <path
      d="M6 9L12 15L18 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </motion.svg>
);

const AccordionItem = ({ question, answer, isOpen, onToggle, index }) => (
  <motion.div variants={staggerItem}>
    <GlassCard>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '1.25rem 1.5rem',
          textAlign: 'left',
          color: isOpen ? '#d4a843' : '#e2e8f0',
          transition: 'color 0.3s ease',
        }}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <span
          style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            lineHeight: 1.4,
            letterSpacing: '0.01em',
          }}
        >
          {question}
        </span>
        <ChevronIcon isOpen={isOpen} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${index}`}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '0 1.5rem 1.25rem 1.5rem',
                color: '#cbd5e1',
                fontSize: '1rem',
                lineHeight: 1.7,
                borderTop: '1px solid rgba(212, 168, 67, 0.15)',
                paddingTop: '1rem',
                marginTop: '0',
              }}
            >
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  </motion.div>
);

export default function FAQPage() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleToggle = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        minHeight: '100vh',
        padding: '6rem 1.5rem 4rem',
        maxWidth: '860px',
        margin: '0 auto',
      }}
    >
      <SectionHeading title="FAQs" subtitle="Guidance for our shared homecoming" />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginTop: '3rem',
        }}
      >
        {FAQ_DATA.map((faq, index) => (
          <AccordionItem
            key={index}
            index={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={expandedIndex === index}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </motion.div>

      {/* Still have questions? */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6, ease: 'easeOut' }}
        style={{
          marginTop: '4rem',
          textAlign: 'center',
          padding: '2.5rem 2rem',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(212, 168, 67, 0.2)',
          borderRadius: '1rem',
        }}
      >
        <h3
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#d4a843',
            marginBottom: '0.75rem',
          }}
        >
          Still have questions?
        </h3>
        <p
          style={{
            color: '#94a3b8',
            fontSize: '1.05rem',
            lineHeight: 1.6,
            marginBottom: '1.25rem',
          }}
        >
          We are happy to help. Reach out to us and we will get back to you as soon as possible.
        </p>
        <a
          href="mailto:reconverge2001@gmail.com"
          style={{
            display: 'inline-block',
            padding: '0.75rem 2rem',
            background: 'linear-gradient(135deg, #d4a843, #b8860b)',
            color: '#0f172a',
            fontWeight: 700,
            fontSize: '1rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            letterSpacing: '0.02em',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            boxShadow: '0 4px 15px rgba(212, 168, 67, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 25px rgba(212, 168, 67, 0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 168, 67, 0.3)';
          }}
        >
          reconverge2001@gmail.com
        </a>
      </motion.div>
    </motion.div>
  );
}
