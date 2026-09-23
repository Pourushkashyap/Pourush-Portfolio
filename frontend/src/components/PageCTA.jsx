import Reveal from './Reveal';
import ParticleField from './ParticleField';

export default function PageCTA({ eyebrow, title, accent, text, children }) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 pt-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-line/12 bg-surface/60 px-6 py-16 text-center sm:px-12 sm:py-20">
          <ParticleField />
          <div className="hero-glow pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2" aria-hidden />
          <div className="relative">
            {eyebrow && <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.22em] text-accent">{eyebrow}</p>}
            <h2 className="mx-auto max-w-3xl text-3xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              {title} {accent && <span className="font-serif font-normal italic text-accent">{accent}</span>}
            </h2>
            {text && <p className="mx-auto mt-6 max-w-xl text-[16.5px] leading-relaxed text-muted">{text}</p>}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">{children}</div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
