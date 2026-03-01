import { motion } from 'framer-motion';

export default function SponsorLogo({ sponsor }) {
  return (
    <motion.a
      href={sponsor.website}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1 }}
      className="block grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
    >
      <img
        src={sponsor.logo}
        alt={sponsor.name}
        className="h-12 md:h-16 w-auto object-contain"
      />
    </motion.a>
  );
}
