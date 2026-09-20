import { WHAT_I_BUILD } from '../data/content';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

const spotlight = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
};

export default function WhatIBuild() {
  return (
    <section id="what-i-build" className="mx-auto max-w-6xl px-5 py-24">
      <SectionHeading eyebrow="What I build" title="Four areas, one goal: AI that actually ships." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {WHAT_I_BUILD.map((c, i) => (
          <Reveal key={c.n} delay={i * 90}>
            <article
              onMouseMove={spotlight}
              className="spot group flex h-full flex-col rounded-2xl border border-line/10 bg-surface/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/40"
            >
              <span className="font-mono text-[12px] text-accent">{c.n}</span>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">{c.title}</h3>
              <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-muted">{c.text}</p>
              <ul className="mt-6 flex flex-wrap gap-1.5">
                {c.tags.map((t) => (
                  <li key={t} className="rounded-full border border-line/12 px-2.5 py-1 font-mono text-[11px] text-fg/80">
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
