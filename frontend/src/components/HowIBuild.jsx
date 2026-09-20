import { PROCESS } from '../data/content';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

// A glowing particle travels the pipeline; each stage lights up as it passes.
export default function HowIBuild() {
  return (
    <section id="how-i-build" className="mx-auto max-w-6xl px-5 py-24">
      <SectionHeading eyebrow="How I build" title="How I build AI systems" />

      <Reveal>
        <div className="relative rounded-2xl border border-line/12 bg-surface/50 px-5 py-10 md:px-8 md:py-14">
          <div className="relative grid gap-8 sm:grid-cols-2 md:grid-cols-6 md:gap-2">
            {/* track + particle (desktop) — spans centre of first column to centre of last */}
            <div className="flow-track pointer-events-none absolute left-[8.333%] right-[8.333%] top-[11px] hidden h-px md:block" aria-hidden>
              <span className="flow-particle" />
            </div>

            {PROCESS.map((s, i) => (
              <div key={s.title} className="relative flex gap-4 md:flex-col md:items-center md:gap-5 md:text-center">
                <span
                  className="flow-node relative z-10 grid h-[23px] w-[23px] shrink-0 place-items-center rounded-full border font-mono text-[9px]"
                  style={{ animationDelay: `${(1.76 * i - 0.1).toFixed(2)}s` }}
                >
                  <span className="h-1 w-1 rounded-full bg-fg/60" />
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold tracking-tight">
                    <span className="mr-1.5 font-mono text-[11px] text-accent md:hidden">{String(i + 1).padStart(2, '0')}</span>
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-snug text-muted md:px-2">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
