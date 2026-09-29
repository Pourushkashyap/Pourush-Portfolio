import { useRef, useState } from 'react';
import { AGENTFORGE, CATEGORIES, CODEPILOT, DEBUGGER, FINGROW, FITGENIUS, HIGHLIGHTS, LAB, PROJECTS, SYSTEM_TYPES } from '../data/projects';
import { SOCIALS } from '../data/content';
import GraphScene from '../components/GraphScene';
import HeroScene from '../components/HeroScene';
import MiniViz from '../components/MiniViz';
import CountUp from '../components/CountUp';
import Reveal from '../components/Reveal';
import PageCTA from '../components/PageCTA';
import { LinkBtn, PageHero, Section, TagList, go } from '../components/ui';
import { ArrowRightIcon, ArrowUpRightIcon } from '../components/Icons';
import { useFlip } from '../lib/hooks';

const GITHUB = SOCIALS.find((s) => s.id === 'github').href;

const HERO_CORE = { name: 'AI Systems', desc: 'The common thread through every project on this page.' };
const HERO_NODES = [
  { name: 'Agents', desc: 'Planning, tool-using, multi-step systems' },
  { name: 'RAG', desc: 'Retrieval-grounded LLM applications' },
  { name: 'ML', desc: 'Models trained on real data' },
  { name: 'Applications', desc: 'Full-stack products around the models' },
];

function ProjectsHero() {
  return (
    <PageHero
      label="PROJECTS / 01"
      title="Systems"
      accent="I’ve Built"
      subtitle="AI systems, intelligent applications and full-stack products built around real engineering problems."
      side={<HeroScene core={HERO_CORE} nodes={HERO_NODES} className="h-[380px] sm:h-[450px]" hint="Hover a node" />}
    >
      <ul className="hero-in mt-7 flex flex-wrap gap-2" style={{ '--d': '480ms' }}>
        {['AI', 'Agents', 'RAG', 'ML', 'Full Stack'].map((t) => (
          <li key={t} className="rounded-full border border-line/15 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-fg/85">{t}</li>
        ))}
      </ul>
    </PageHero>
  );
}

function SystemsOverview() {
  return (
    <Section id="overview" label="02 / AI systems overview" title="What I" accent="build" intro="Not skill cards — the kinds of systems these projects fall into.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SYSTEM_TYPES.map((c, i) => (
          <Reveal key={c.n} delay={i * 80}>
            <div className="group h-full rounded-2xl border border-line/10 bg-surface/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/40">
              <span className="font-mono text-[12px] text-accent">{c.n}</span>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">{c.title}</h3>
              <ul className="mt-5 space-y-2 border-t border-line/10 pt-4 font-mono text-[12.5px] text-muted">
                {c.items.map((t) => <li key={t} className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-accent" />{t}</li>)}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Featured() {
  return (
    <section id="featured" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
      <Reveal>
        <div className="overflow-hidden rounded-3xl border border-line/12 bg-surface/50">
          <div className="p-7 sm:p-10">
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-accent">Featured project</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
              Agent<span className="font-serif font-normal italic text-accent">Forge</span>
            </h2>
            <p className="mt-2 text-lg text-muted">Autonomous AI Website Builder</p>
            <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[12.5px] text-fg/85">
              {['Natural Language', 'Planning', 'Code', 'Testing', 'Deployment'].map((s, i, a) => (
                <span key={s} className="inline-flex items-center gap-3">{s}{i < a.length - 1 && <ArrowRightIcon width={13} height={13} className="text-accent" />}</span>
              ))}
            </p>
            <TagList items={['LangGraph', 'LLM', 'React', 'Docker', 'FastAPI']} className="mt-5" />
            <div className="mt-7 flex flex-wrap gap-3">
              <LinkBtn href="#/projects/agentforge">View Case Study</LinkBtn>
              <LinkBtn href={GITHUB} ghost external>GitHub</LinkBtn>
            </div>
          </div>
          <div className="relative border-t border-line/10 bg-bg/40">
            <GraphScene
              nodes={AGENTFORGE.nodes} edges={AGENTFORGE.edges} className="h-[400px] sm:h-[500px]"
              fit={0.42} sway={0.4} yaw={0.15} pitch={0.2} particles={34} hint="Hover an agent" ariaLabel="3D AgentForge multi-agent architecture"
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function ProjectCard({ p, n }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line/10 bg-surface/60 transition duration-300 hover:-translate-y-1 hover:border-accent/40">
      <div className="relative h-36 border-b border-line/10 bg-bg/40 p-4">
        <span className="absolute left-4 top-3 font-serif text-3xl italic text-muted/50 transition group-hover:text-accent">{n}</span>
        <MiniViz kind={p.viz} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold tracking-tight">{p.name}</h3>
        <p className="mt-0.5 text-[13.5px] text-accent">{p.sub}</p>
        <p className="mt-3 flex-1 text-[14px] leading-relaxed text-muted">{p.text}</p>
        <TagList items={p.tags} className="mt-4" />
        <div className="mt-5 flex items-center justify-between border-t border-line/10 pt-4 text-[13.5px] font-medium">
          <a href={`#/projects/${p.slug}`} className="inline-flex items-center gap-1.5 transition hover:text-accent">Case Study <ArrowRightIcon width={14} height={14} /></a>
          <a href={GITHUB} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-muted transition hover:text-accent">GitHub <ArrowUpRightIcon width={14} height={14} /></a>
        </div>
      </div>
    </article>
  );
}

function Explorer() {
  const [cat, setCat] = useState('All');
  const ref = useRef(null);
  const shown = PROJECTS.filter((p) => cat === 'All' || p.cats.includes(cat));
  useFlip(ref, [cat]);
  const major = shown.filter((p) => p.tier < 3);
  const small = shown.filter((p) => p.tier === 3);
  return (
    <Section id="explorer" label="04 / Project explorer" title="Explore my" accent="work">
      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
        {CATEGORIES.map((c) => (
          <button
            key={c} type="button" role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
            className={`rounded-full border px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.12em] transition ${cat === c ? 'border-accent bg-accent text-accent-ink' : 'border-line/15 text-muted hover:border-accent/50 hover:text-fg'}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div ref={ref} className="relative">
        {major.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {major.map((p) => (
              <div key={p.slug} data-flip={p.slug}><ProjectCard p={p} n={String(PROJECTS.indexOf(p) + 1).padStart(2, '0')} /></div>
            ))}
          </div>
        )}
        {small.length > 0 && (
          <>
            <p className="mb-3 mt-10 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Full-stack builds</p>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {small.map((p) => (
                <div key={p.slug} data-flip={p.slug}>
                  <a href={`#/projects/${p.slug}`} className="group block h-full rounded-xl border border-line/10 bg-surface/50 p-4 transition hover:border-accent/40">
                    <p className="font-semibold tracking-tight">{p.name}</p>
                    <p className="mt-0.5 text-[12.5px] text-muted">{p.sub}</p>
                    <span className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-accent">View <ArrowRightIcon width={12} height={12} className="transition-transform group-hover:translate-x-1" /></span>
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Section>
  );
}

function Visuals() {
  const panel = (title, sub, data, extra = {}, cls = 'h-[300px]') => (
    <Reveal className={extra.wrap}>
      <div className="h-full overflow-hidden rounded-2xl border border-line/10 bg-surface/50">
        <div className="px-6 pb-1 pt-5">
          <h3 className="font-semibold tracking-tight">{title}</h3>
          <p className="text-[13px] text-muted">{sub}</p>
        </div>
        <GraphScene nodes={data.nodes} edges={data.edges} className={cls} fit={0.4} sway={0.4} pitch={0.2} particles={extra.particles ?? 16} ariaLabel={`${title} 3D visual`} />
      </div>
    </Reveal>
  );
  return (
    <Section id="visuals" label="06 / Project visuals" title="Inside the" accent="systems" intro="Each major project gets its own visual language.">
      <div className="grid gap-5 lg:grid-cols-3">
        {panel('CodePilot AI', 'Question → guardrails → cache → route → retrieve/context → answer → validate', CODEPILOT, { wrap: 'lg:col-span-3', particles: 30 }, 'h-[340px] sm:h-[400px]')}
        {panel('Self-Healing Debugger', 'Error → analyze → fix → sandbox → test → recover', DEBUGGER, { wrap: 'lg:col-span-1' })}
        {panel('FinGrow', 'Borrower → risk → loan → investor', FINGROW, { wrap: 'lg:col-span-1' })}
        {panel('FitGenius AI', 'User data → features → model → recommendation', FITGENIUS, { wrap: 'lg:col-span-1' })}
      </div>
    </Section>
  );
}

function Lab() {
  const [mode, setMode] = useState('overview');
  const cfg = LAB[mode];
  return (
    <Section id="lab" label="07 / AI systems lab" title="AI Systems" accent="Lab" intro="Explore the systems and architectures behind the projects. Pick a system — the diagram reshapes itself.">
      <Reveal>
        <div className="overflow-hidden rounded-3xl border border-line/12 bg-surface/50">
          <div className="flex flex-wrap items-center gap-2 border-b border-line/10 p-4">
            {Object.entries(LAB).map(([k, v]) => (
              <button key={k} type="button" onClick={() => setMode(k)} aria-pressed={mode === k}
                className={`rounded-full border px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.12em] transition ${mode === k ? 'border-accent bg-accent text-accent-ink' : 'border-line/15 text-muted hover:border-accent/50 hover:text-fg'}`}>
                {v.label}
              </button>
            ))}
            <span className="ml-auto hidden font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted sm:block">Hover nodes · drag mouse to tilt</span>
          </div>
          <GraphScene nodes={cfg.nodes} edges={cfg.edges} className="h-[420px] sm:h-[540px]" fit={0.42} sway={0.35} pitch={0.22} particles={38} ariaLabel="Interactive AI systems lab" />
        </div>
      </Reveal>
    </Section>
  );
}

function Highlights() {
  return (
    <Section id="taught" label="08 / Engineering highlights" title="What these projects" accent="taught me">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {HIGHLIGHTS.map((h, i) => (
          <Reveal key={h.title} delay={i * 70}>
            <div className="h-full rounded-2xl border border-line/10 bg-surface/60 p-6 transition duration-300 hover:border-accent/40">
              <span className="font-mono text-[12px] text-accent">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">{h.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{h.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Metrics() {
  const items = [
    [<CountUp key="a" to={950} suffix="+" />, 'LeetCode problems'],
    [<CountUp key="b" to={6} />, 'AI & ML systems built'],
    ['AI / ML', 'Primary focus'],
    ['Agentic AI', 'Current focus'],
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16">
      <Reveal>
        <dl className="grid gap-px overflow-hidden rounded-2xl border border-line/12 bg-line/12 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(([v, l]) => (
            <div key={l} className="bg-surface p-7">
              <dd className="text-3xl font-semibold tracking-tight sm:text-[2rem]">{v}</dd>
              <dt className="mt-2 font-mono text-[12px] uppercase tracking-[0.14em] text-accent">{l}</dt>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}

export default function Projects() {
  return (
    <>
      <ProjectsHero />
      <SystemsOverview />
      <Featured />
      <Explorer />
      <Visuals />
      <Lab />
      <Highlights />
      <Metrics />
      <PageCTA eyebrow="Have an interesting problem?" title="Let’s build something" accent="intelligent.">
        <LinkBtn href="#/contact">Get In Touch</LinkBtn>
        <LinkBtn onClick={() => go('lab')} ghost>Explore My AI Systems</LinkBtn>
      </PageCTA>
    </>
  );
}