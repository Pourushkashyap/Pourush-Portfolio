import Reveal from './Reveal';
import { ArrowRightIcon, ArrowUpRightIcon } from './Icons';

export const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

export function Tag({ children }) {
  return <li className="rounded-full border border-line/12 px-2.5 py-1 font-mono text-[11px] text-fg/80">{children}</li>;
}

export function TagList({ items, className = '' }) {
  return <ul className={`flex flex-wrap gap-1.5 ${className}`}>{items.map((t) => <Tag key={t}>{t}</Tag>)}</ul>;
}

export function PageHero({ label, title, accent, subtitle, meta, children, side }) {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32">
      <div className="grid-lines absolute inset-0 -z-10" aria-hidden />
      <div className="hero-glow absolute -right-40 top-10 -z-10 h-[620px] w-[620px]" aria-hidden />
      <div className={`mx-auto max-w-6xl px-5 pb-14 ${side ? 'grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]' : ''}`}>
        <div>
          <p className="hero-in font-mono text-[12px] uppercase tracking-[0.22em] text-accent" style={{ '--d': '100ms' }}>{label}</p>
          <h1 className="hero-in mt-4 max-w-3xl text-[clamp(2.2rem,5.4vw,4.2rem)] font-semibold leading-[1.02] tracking-[-0.03em]" style={{ '--d': '200ms' }}>
            {title} {accent && <span className="font-serif font-normal italic text-accent">{accent}</span>}
          </h1>
          {subtitle && <p className="hero-in mt-5 max-w-xl text-[17px] leading-relaxed text-muted" style={{ '--d': '320ms' }}>{subtitle}</p>}
          {meta && <p className="hero-in mt-5 font-mono text-[12px] tracking-wide text-fg/75" style={{ '--d': '420ms' }}>{meta}</p>}
          {children}
        </div>
        {side}
      </div>
    </section>
  );
}

export function Section({ id, label, title, accent, intro, children, className = '' }) {
  return (
    <section id={id} className={`mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:py-24 ${className}`}>
      {(title || label) && (
        <Reveal className="mb-12 max-w-2xl">
          {label && <p className="mb-3 font-mono text-[12px] uppercase tracking-[0.2em] text-accent">{label}</p>}
          {title && (
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.6rem] md:leading-[1.08]">
              {title} {accent && <span className="font-serif font-normal italic text-accent">{accent}</span>}
            </h2>
          )}
          {intro && <p className="mt-4 text-[16px] leading-relaxed text-muted">{intro}</p>}
        </Reveal>
      )}
      {children}
    </section>
  );
}

export const btnPrimary = 'group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-accent-ink transition hover:brightness-110';
export const btnGhost = 'inline-flex items-center gap-2 rounded-full border border-line/20 px-6 py-3 text-[15px] font-medium transition hover:border-accent/60 hover:text-accent';

export function LinkBtn({ href, onClick, children, ghost, external }) {
  const cls = ghost ? btnGhost : btnPrimary;
  const icon = ghost && external ? <ArrowUpRightIcon width={16} height={16} /> : !ghost ? <ArrowRightIcon width={16} height={16} className="transition-transform group-hover:translate-x-1" /> : null;
  if (onClick) return <button type="button" onClick={onClick} className={cls}>{children}{icon}</button>;
  return <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className={cls}>{children}{icon}</a>;
}
