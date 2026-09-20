import { PROFILE, SOCIALS } from '../data/content';
import Reveal from './Reveal';
import { ArrowRightIcon, ArrowUpRightIcon } from './Icons';

export default function CTA() {
  const github = SOCIALS.find((s) => s.id === 'github');
  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 pb-24 pt-12">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-line/12 bg-surface/60 px-6 py-16 text-center sm:px-12 sm:py-20">
          <div className="hero-glow pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2" aria-hidden />
          <div className="relative">
            <h2 className="mx-auto max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Let’s build something <span className="font-serif font-normal italic text-accent">intelligent.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[16.5px] leading-relaxed text-muted">
              I’m interested in AI/ML engineering, Agentic AI and building products that solve real problems.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`mailto:${PROFILE.email}`}
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[15px] font-semibold text-accent-ink transition hover:brightness-110"
              >
                Get in Touch
                <ArrowRightIcon width={16} height={16} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href={github.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line/20 px-7 py-3.5 text-[15px] font-medium transition hover:border-accent/60 hover:text-accent"
              >
                View GitHub <ArrowUpRightIcon width={16} height={16} />
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
