import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import { townhalls } from '../../data/townhalls';
import SectionHeading from '../../components/shared/SectionHeading';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

function formatDate(iso) {
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

function formatTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
}

function isUpcoming(iso) {
  try {
    const d = new Date(iso + 'T23:59:59');
    return d.getTime() >= Date.now();
  } catch {
    return true;
  }
}

export default function TownhallsPage() {
  return (
    <motion.div {...pageTransition}>
      <SectionHeading
        title="Townhalls"
        subtitle="Batch-wide calls where decisions get shared, questions get asked, and the volunteer team takes feedback in the open. Recordings land here afterwards."
      />

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-5">
        {townhalls.map((th) => {
          const upcoming = isUpcoming(th.date);
          return (
            <motion.div key={th.id} variants={staggerItem}>
              <GlassCard className={`${upcoming ? 'border-gold-500/30 bg-gradient-to-br from-gold-500/5 to-primary-900/20' : 'border-white/5'}`}>
                <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default" size="sm">{th.session}</Badge>
                      {upcoming ? (
                        <Badge variant="gold" size="sm">Upcoming</Badge>
                      ) : th.recordingUrl ? (
                        <Badge variant="success" size="sm">Recording available</Badge>
                      ) : (
                        <Badge size="sm">Recording pending</Badge>
                      )}
                    </div>
                    <h3 className="text-white font-heading font-bold text-lg">{th.title}</h3>
                    {th.tagline && <p className="text-xs text-slate-400 mt-1 italic">{th.tagline}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-3 text-sm mb-4">
                  <div className="flex items-start gap-2 text-slate-300">
                    <span>📅</span>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">When</p>
                      <p>{formatDate(th.date)}</p>
                      <p className="text-xs">{formatTime(th.startTime)} – {formatTime(th.endTime)} {th.timezone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-slate-300">
                    <span>🌏</span>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Region</p>
                      <p className="text-xs">{th.regionHint}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-slate-300">
                    <span>🎙️</span>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Host</p>
                      <p className="text-sm">{th.organiser}</p>
                    </div>
                  </div>
                </div>

                {/* Join / Recording / Transcript actions */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {upcoming && (
                    <a href={th.meet.url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm">🎥 Join via Google Meet</Button>
                    </a>
                  )}

                  {/* Recording — always visible, disabled until URL is published */}
                  {th.recordingUrl ? (
                    <a href={th.recordingUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline">▶️ Watch recording</Button>
                    </a>
                  ) : (
                    <Button size="sm" variant="outline" disabled title="Recording will be attached once the session wraps">
                      ▶️ Recording — coming soon
                    </Button>
                  )}

                  {/* Transcript — always visible, disabled until URL is published */}
                  {th.transcriptUrl ? (
                    <a href={th.transcriptUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline">📝 View transcript</Button>
                    </a>
                  ) : (
                    <Button size="sm" variant="outline" disabled title="Transcript will be posted alongside the recording">
                      📝 Transcript — coming soon
                    </Button>
                  )}

                  {upcoming && th.meet.morePhones && (
                    <a href={th.meet.morePhones} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline">📞 Other dial-in numbers</Button>
                    </a>
                  )}
                </div>

                {/* Meet details — only meaningful while upcoming */}
                {upcoming && (
                  <div className="bg-white/3 border border-white/5 rounded-xl p-4 mb-5 text-sm">
                    <p className="text-xs uppercase tracking-wider text-gold-400 font-semibold mb-2">Meet joining info</p>
                    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
                      <div>
                        <span className="text-slate-500 text-xs">Video link: </span>
                        <a href={th.meet.url} target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:text-gold-300 break-all">{th.meet.url}</a>
                      </div>
                      <div>
                        <span className="text-slate-500 text-xs">Dial ({th.meet.dialInCountry}): </span>
                        <span className="text-white font-mono">{th.meet.dialIn}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-xs">PIN: </span>
                        <span className="text-white font-mono">{th.meet.pin}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Agenda */}
                {th.agenda && th.agenda.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs uppercase tracking-wider text-gold-400 font-semibold mb-2">Agenda</p>
                    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-slate-300">
                      {th.agenda.map((a, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-gold-400 mt-0.5">›</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Inline recording player — Drive's /preview iframe.
                    Renders only when an explicit embed URL is provided so
                    we don't try to <iframe> arbitrary external links. */}
                {th.recordingEmbedUrl && (
                  <div className="mt-5 pt-4 border-t border-white/5">
                    <p className="text-xs uppercase tracking-wider text-gold-400 font-semibold mb-2">
                      Recording
                    </p>
                    <div className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-black/40" style={{ paddingTop: '56.25%' }}>
                      <iframe
                        src={th.recordingEmbedUrl}
                        title={`${th.title} — recording`}
                        allow="autoplay"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                    {th.recordingNotes && (
                      <p className="text-xs text-slate-500 italic mt-2">{th.recordingNotes}</p>
                    )}
                  </div>
                )}

                {/* Recording slot — note-only fallback when there's no embed yet */}
                {!upcoming && !th.recordingEmbedUrl && !th.recordingUrl && th.recordingNotes && (
                  <p className="text-xs text-slate-500 italic mt-4 pt-3 border-t border-white/5">
                    {th.recordingNotes}
                  </p>
                )}
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10"
      >
        <GlassCard className="border-primary-400/30 bg-gradient-to-br from-primary-900/20 to-transparent">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📣</span>
            <div>
              <h4 className="text-white font-heading font-semibold mb-1">Missed a session?</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Every townhall is auto-recorded via Google Meet. Once the host finishes up, the recording + chat transcript get attached to this page — typically within 24 hours of the session.
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
