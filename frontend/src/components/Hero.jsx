import { PROFILE, SOCIALS } from '../data/content';
import { scrollToId } from '../lib/router';
import { ArrowRightIcon, DownloadIcon, SOCIAL_ICONS } from './Icons';
import HeroScene from './HeroScene';

const d = (ms) => ({ '--d': `${ms}ms` });

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-24 sm:pt-28">
      <div className="hero-grid absolute inset-0 -z-10" aria-hidden />
      <div className="hero-glow absolute right-[-10%] top-[8%] -z-10 h-[640px] w-[640px]" aria-hidden />

      <div className="mx-auto grid min-h-[calc(100svh-6rem)] max-w-6xl items-center gap-4 px-5 pb-16 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:pb-20">
        {/* ------------------------------ Left ------------------------------ */}
        <div>
          <div
            className="hero-in inline-flex items-center gap-2.5 rounded-full border border-line/15 bg-surface/60 px-3.5 py-1.5"
            style={d(1100)}
          >
            <span className="pulse-dot h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
              {PROFILE.badge}
            </span>
          </div>

          <p className="hero-in mt-8 text-xl text-muted sm:text-2xl" style={d(1200)}>
            I’m
          </p>
          <h1
            className="hero-in mt-1 text-[clamp(3rem,7.4vw,5.6rem)] font-semibold leading-[0.94] tracking-[-0.035em]"
            style={d(1280)}
          >
            Pourush
            <br />
            <span className="font-serif font-normal italic tracking-[-0.02em] text-accent">Kashyap</span>
          </h1>

          <div className="hero-in mt-6 flex items-center gap-3" style={d(1380)}>
            <span className="h-px w-10 bg-accent" />
            <p className="text-lg font-medium tracking-tight sm:text-xl">{PROFILE.role}</p>
          </div>

          <p className="hero-in mt-5 max-w-xl text-[17px] leading-relaxed text-muted" style={d(1460)}>
            {PROFILE.intro}
          </p>

          <p className="hero-in mt-5 flex flex-wrap gap-x-2 gap-y-1 font-mono text-[12px] text-fg/80" style={d(1540)}>
            {PROFILE.stack.map((s, i) => (
              <span key={s} className="inline-flex items-center gap-2">
                {s}
                {i < PROFILE.stack.length - 1 && <span className="text-accent">·</span>}
              </span>
            ))}
          </p>

          <div className="hero-in mt-9 flex flex-wrap items-center gap-3" style={d(1620)}>
            <button
              type="button"
              onClick={() => scrollToId('projects')}
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-accent-ink transition hover:brightness-110"
            >
              Explore My Work
              <ArrowRightIcon width={16} height={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href="/Pourush resume.pdf"
              download="Pourush-Kashyap-Resume.pdf"
              className="inline-flex items-center gap-2 rounded-full border border-line/20 px-6 py-3 text-[15px] font-medium transition hover:border-accent/60 hover:text-accent"
            >
              Download Resume <DownloadIcon width={16} height={16} />
            </a>
          </div>

          <div className="hero-in mt-8 flex items-center gap-5" style={d(1700)}>
            {SOCIALS.map((s) => {
              const Icon = SOCIAL_ICONS[s.id];
              return (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[13px] text-muted transition hover:text-accent"
                >
                  <Icon width={16} height={16} /> {s.label}
                </a>
              );
            })}
          </div>
        </div>

        {/* ------------------------------ Right ----------------------------- */}
        <div className="hero-in" style={d(1000)}>
          <HeroScene />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted/70">Scroll</span>
        <span className="scroll-cue h-6 w-px bg-gradient-to-b from-accent to-transparent" />
      </div>
    </section>
  );
}
