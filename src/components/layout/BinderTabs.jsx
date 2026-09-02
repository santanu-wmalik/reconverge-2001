import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

// Binder-style sub-navigation for the signed-in shells (My Portal / Admin).
//
//   ┌────────┐┌────────┐╔════════╗┌────────┐
//   │ AGENDA ││ EARLY  ║ STAY   ║│ TRAVEL │   ← tabs
//   ────────────────────╝        ╚──────────  ← rail line, open under the active tab
//   (page content, same cream as the active tab)
//
// Phones: tabs wrap onto as many rows as needed. Large screens: one row
// (tight tracking + small type keep 11 portal tabs inside 1280px). The row
// deliberately has NO overflow container: overflow-x:auto would also clip
// vertically and show a scrollbar for the active tab, which hangs 1px below
// the rail so it opens into the page.
export default function BinderTabs({ label, links, isActive }) {
  return (
    <div className="bg-cream-200/70 border-b border-forest-500/25">
      <div className="w-full px-4 sm:px-6">
        <div className="flex flex-wrap lg:flex-nowrap items-end gap-x-1 gap-y-1.5 pt-3">
          <span className="nav-caps text-gold-700 mr-2 sm:mr-3 pb-2.5 shrink-0">{label}</span>
          {links.map((link) => {
            const active = isActive(link);
            return (
              <Link
                key={link.path}
                to={link.path}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-t-lg border border-b-0',
                  'text-[10px] lg:text-[11px] font-semibold uppercase tracking-[0.08em] lg:tracking-[0.05em] whitespace-nowrap transition-colors',
                  active
                    ? '-mb-px z-10 bg-cream-100 border-forest-500/25 text-forest-700 pb-[11px]'
                    : 'bg-white/70 border-forest-500/15 text-ink-soft hover:bg-white hover:text-forest-700'
                )}
              >
                {/* Icons help on phones; on laptops they cost the width that
                    keeps all 11 portal tabs on one row, so they return at 2xl. */}
                {link.icon && <span aria-hidden="true" className="lg:hidden 2xl:inline">{link.icon}</span>}
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
