import { cn } from '../../utils/cn';

// Binder-style tabs (matches BinderTabs in the shells and the Our Journey
// filters): tabs sit on a rail line, the active one shares the page's cream
// background and opens into the content below. ONE row on phones — tighter
// type, no icons below sm; icons and full spacing return from sm:.
export default function Tabs({ tabs, activeTab, onChange, className }) {
  return (
    <div className={cn('border-b border-forest-500/25', className)}>
      <div className="flex flex-nowrap items-end gap-x-0.5 sm:gap-x-1 pt-2">
        {tabs.map((tab) => {
          const id = tab.id || tab;
          const active = id === activeTab;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              aria-pressed={active}
              className={cn(
                'relative min-w-0 flex items-center justify-center gap-1.5 px-1.5 sm:px-4 py-2 rounded-t-lg border border-b-0',
                'text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.04em] sm:tracking-[0.08em] whitespace-nowrap transition-colors',
                active
                  ? '-mb-px z-10 bg-cream-100 border-forest-500/25 text-forest-700 pb-[11px]'
                  : 'bg-white/70 border-forest-500/15 text-ink-soft hover:bg-white hover:text-forest-700'
              )}
            >
              {tab.icon && <span aria-hidden="true" className="hidden sm:inline">{tab.icon}</span>}
              <span className="truncate">{tab.label || tab}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
