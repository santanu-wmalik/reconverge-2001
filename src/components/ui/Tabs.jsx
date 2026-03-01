import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export default function Tabs({ tabs, activeTab, onChange, className }) {
  return (
    <div className={cn('flex gap-1 p-1 bg-white/5 rounded-xl overflow-x-auto', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id || tab}
          onClick={() => onChange(tab.id || tab)}
          className={cn(
            'relative px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap',
            (tab.id || tab) === activeTab ? 'text-white' : 'text-slate-400 hover:text-slate-200'
          )}
        >
          {(tab.id || tab) === activeTab && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-primary-700/60 rounded-lg"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label || tab}
          </span>
        </button>
      ))}
    </div>
  );
}
