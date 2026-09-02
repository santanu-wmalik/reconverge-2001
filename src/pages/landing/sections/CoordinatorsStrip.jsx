import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { committees } from '../../../data/committees';
import Avatar from '../../../components/ui/Avatar';

// Public "Organising Committee" grid — ONE card per committee with the Lead
// on the left and the Co-lead(s) on the right. Two cards per row on md+,
// one per row on phones. Committees without a named lead are hidden.
function groupsFromCommittees() {
  const out = [];
  for (const c of committees) {
    const leadStr = String(c.lead || '');
    const lead = leadStr && !leadStr.toLowerCase().includes('tbd') ? leadStr : null;
    const coLeads = c.coLead ? String(c.coLead).split('·').map((s) => s.trim()).filter(Boolean) : [];
    if (!lead && coLeads.length === 0) continue;
    out.push({ id: c.id, name: c.name, short: c.shortName, lead, coLeads });
  }
  return out;
}

// Display first names only in this public strip.
const firstName = (n) => String(n).trim().split(/\s+/)[0];

function Person({ name, role }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <Avatar name={firstName(name)} size="md" />
      <div className="min-w-0">
        <p className="font-heading text-ink text-sm sm:text-base leading-tight truncate">{firstName(name)}</p>
        <p className="nav-caps text-gold-700 mt-0.5">{role}</p>
      </div>
    </div>
  );
}

export default function CoordinatorsStrip() {
  const groups = groupsFromCommittees();
  if (groups.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-cream-200/60 border-y border-forest-500/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="eyebrow">The people behind it</span>
          <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-heading font-medium italic text-forest-600">Organising Committee</h2>
          <p className="mt-2 font-serif text-ink-muted">The batchmates rolling up their sleeves to make REConverge happen.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          {groups.map((g) => (
            <div key={g.id} className="bg-white border border-forest-500/15 p-5 shadow-sm hover:border-gold-500/60 transition">
              <p className="nav-caps text-forest-700 mb-4">
                {g.name} <span className="text-ink-muted">· {g.short}</span>
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-4">
                {/* Lead — left */}
                <div className="w-full sm:flex-1 min-w-0">
                  {g.lead && <Person name={g.lead} role="Lead" />}
                </div>
                {/* Co-lead(s) — right */}
                {g.coLeads.length > 0 && (
                  <div className="w-full sm:flex-1 min-w-0 flex flex-col gap-3 items-start sm:items-end">
                    {g.coLeads.map((co) => (
                      <div key={co} className="flex flex-row sm:flex-row-reverse items-center gap-3 min-w-0 text-left sm:text-right">
                        <Avatar name={firstName(co)} size="md" />
                        <div className="min-w-0">
                          <p className="font-heading text-ink text-sm sm:text-base leading-tight truncate">{firstName(co)}</p>
                          <p className="nav-caps text-gold-700 mt-0.5">Co-lead</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </motion.div>

        <div className="flex justify-center">
          <Link to="/committees" className="nav-caps px-6 py-3 border-2 border-forest-600/60 text-forest-700 hover:bg-forest-600/8">All committees →</Link>
        </div>
      </div>
    </section>
  );
}
