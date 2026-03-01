import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="text-8xl md:text-9xl font-heading font-bold gradient-text mb-4">404</div>
        <h1 className="text-2xl md:text-3xl font-heading text-white mb-3">Page Not Found</h1>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Looks like this page went back to campus and forgot to return. Let's get you back on track.
        </p>
        <Link to="/">
          <Button size="lg">Go Back Home</Button>
        </Link>
      </motion.div>
    </div>
  );
}
