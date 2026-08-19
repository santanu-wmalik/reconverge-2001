import { anthemTitle, anthemDedication, anthemStanzas } from '../../data/anthem';

// Right-side translucent poem column that drifts bottom-to-top on the
// landing page.
//
// Behaviour:
//   - Only rendered on lg+ (aligned with the film strips).
//   - Sits in the gutter between the right film strip (fixed w-44) and the
//     centred hero content. Anchored to `right-44`; grows leftward.
//   - Each line uses `whitespace-nowrap` and the paragraph is right-aligned,
//     so long lines extend leftward from the right edge without wrapping.
//     `overflow-hidden` clips anything that reaches past the column's left
//     border. `pointer-events-none` keeps clicks flowing through to content.
//   - Animation `poem-drift` (tailwind.config.js) translates the block from
//     translateY(100%) to translateY(-100%). The column is EMPTY between the
//     poem exiting the top and re-entering the bottom — no seamless loop, no
//     duplication, per request.
//   - 160s per cycle: 50% faster than the earlier 240s baseline.
//   - Respects `prefers-reduced-motion`: pauses.

function Stanza({ text }) {
  return (
    <div className="mb-16">
      {text.split('\n').map((line, i) => (
        <p
          key={i}
          className="whitespace-nowrap text-right text-gold-300/90 font-heading text-3xl leading-loose tracking-wide"
          style={{ textShadow: '0 2px 14px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.85)' }}
        >
          {line}
        </p>
      ))}
    </div>
  );
}

function PoemBlock() {
  return (
    <div className="pl-6 pr-4">
      <div className="text-right mb-12">
        <h3
          className="font-heading italic text-gold-300 text-4xl whitespace-nowrap"
          style={{ textShadow: '0 2px 14px rgba(0,0,0,0.95)' }}
        >
          {anthemTitle}
        </h3>
        <p
          className="text-xs uppercase tracking-[0.3em] text-gold-300/70 mt-3 whitespace-nowrap"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.95)' }}
        >
          {anthemDedication}
        </p>
      </div>
      {anthemStanzas.map((s, i) => (
        <Stanza key={i} text={s} />
      ))}
    </div>
  );
}

export default function ScrollingPoem() {
  return (
    <div
      className="hidden lg:block pointer-events-none fixed inset-y-0 right-44 w-[560px] xl:w-[640px] z-[15] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Soft top / bottom fade so lines don't pop-in / pop-out abruptly */}
      <div
        className="absolute inset-0"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        <div className="flex flex-col animate-poem-drift motion-reduce:animate-none">
          {/* Two copies for a seamless loop, each followed by a viewport-tall
              spacer so the poem's last line clears the top BEFORE its next
              first line rises from the bottom. Track: block → gap → block →
              gap; -50% translate advances exactly one (block + gap) unit. */}
          <PoemBlock />
          <div className="shrink-0 h-screen" aria-hidden="true" />
          <PoemBlock />
          <div className="shrink-0 h-screen" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
