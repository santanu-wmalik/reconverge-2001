import { anthemTitle, anthemDedication, anthemStanzas } from '../../data/anthem';

// Translucent poem column that drifts bottom-to-top.
//
// Two modes:
//   default → `fixed` right-side overlay
//   inline  → `relative` column that fills its parent (FAQ page uses this
//             so the poem sits in a grid column beside the questions).
//
// Theme: forest-green ink on the cream public theme (no shadow — it would
// muddy on paper); gold with a dark halo inside dark shells.

const lineCls =
  'whitespace-nowrap text-right font-heading text-3xl leading-loose tracking-wide ' +
  'text-forest-700/90 dark:text-gold-300/90 dark:text-shadow-lg';

function Stanza({ text }) {
  return (
    <div className="mb-16">
      {text.split('\n').map((line, i) => (
        <p key={i} className={lineCls}>{line}</p>
      ))}
    </div>
  );
}

function PoemBlock() {
  return (
    <div className="pl-6 pr-4">
      <div className="text-right mb-12">
        <h3 className="font-heading italic text-4xl whitespace-nowrap text-forest-700 dark:text-gold-300 dark:text-shadow-lg">
          {anthemTitle}
        </h3>
        <p className="nav-caps mt-3 whitespace-nowrap text-gold-700 dark:text-gold-300/70">
          {anthemDedication}
        </p>
      </div>
      {anthemStanzas.map((s, i) => (
        <Stanza key={i} text={s} />
      ))}
    </div>
  );
}

export default function ScrollingPoem({ inline = false }) {
  const outerCls = inline
    ? 'hidden lg:block relative w-full h-full min-h-screen z-[1] overflow-hidden select-none'
    : 'hidden lg:block pointer-events-none fixed inset-y-0 right-44 w-[560px] xl:w-[640px] z-[15] overflow-hidden select-none';
  const maskStyle = {
    maskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
  };
  return (
    <div className={outerCls} aria-hidden={!inline || undefined}>
      <div className={inline ? 'sticky top-0 h-screen' : 'absolute inset-0'} style={maskStyle}>
        <div className="flex flex-col animate-poem-drift motion-reduce:animate-none">
          <PoemBlock />
          <div className="shrink-0 h-screen" aria-hidden="true" />
          <PoemBlock />
          <div className="shrink-0 h-screen" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
