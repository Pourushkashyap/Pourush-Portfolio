import { FEATURED_PROJECTS } from '../data/content';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import { ArrowRightIcon, ArrowUpRightIcon } from './Icons';

export default function FeaturedProjects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl scroll-mt-16 px-5 py-24">
      <SectionHeading eyebrow="Featured projects" title="Selected work" />

      <div className="border-t border-line/12">
        {FEATURED_PROJECTS.map((p, i) => (
          <Reveal key={p.n} delay={i * 80}>
            <a
              href="#/projects"
              className="group grid gap-6 border-b border-line/12 py-9 transition-colors hover:bg-fg/[0.025] md:grid-cols-[90px_1.1fr_1.4fr_40px] md:items-center md:px-3"
            >
              <span className="font-serif text-5xl italic text-muted/60 transition-colors group-hover:text-accent md:text-6xl">
                {p.n}
              </span>
              <div>
                <h3 className="text-2xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1 sm:text-[1.75rem]">
                  {p.name}
                </h3>
                <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.12em] text-accent">{p.kicker}</p>
              </div>
              <div>
                <p className="text-[15px] leading-relaxed text-muted">{p.text}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <li key={t} className="rounded-full border border-line/12 px-2.5 py-1 font-mono text-[11px] text-fg/80">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <span className="hidden justify-self-end text-muted transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent md:block">
                <ArrowUpRightIcon width={26} height={26} />
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10">
        <a href="#/projects" className="group inline-flex items-center gap-2 text-[15px] font-medium transition-colors hover:text-accent">
          View all projects
          <ArrowRightIcon width={16} height={16} className="transition-transform group-hover:translate-x-1" />
        </a>
      </Reveal>
    </section>
  );
}
