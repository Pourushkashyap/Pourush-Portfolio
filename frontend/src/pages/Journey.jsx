import { useMemo, useState } from 'react';
import { EQUATION, FOCUS_CARDS, KNOWLEDGE, MILESTONES, ROADMAP, STACK_YEARS, STAGES } from '../data/journey';
import GraphScene from '../components/GraphScene';
import HeroScene from '../components/HeroScene';
import CountUp from '../components/CountUp';
import Reveal from '../components/Reveal';
import PageCTA from '../components/PageCTA';
import ParticleField from '../components/ParticleField';
import { LinkBtn, PageHero, Section, TagList } from '../components/ui';
import { ArrowRightIcon } from '../components/Icons';
import { useInView, useScrollProgress } from '../lib/hooks';

/* An ascending 3D path that recedes toward the horizon. */
function pathLayout(labels) {
  const nodes = labels.map((label, i) => ({
    label,
    pos: [i * 1.25 - labels.length * 0.6, i * 0.95 - labels.length * 0.4, -i * 0.85 + Math.sin(i * 1.3) * 0.5],
    size: 1.15,
    kind: i === labels.length - 1 ? 'gem' : 'node',
  }));
  return { nodes, edges: nodes.slice(1).map((_, i) => [i, i + 1]) };
}

/* ------------------------------ 01 · Hero ------------------------------ */
function JourneyHero() {
  const path = useMemo(() => pathLayout(['Full Stack', 'ML / DL', 'GenAI', 'RAG', 'Agentic AI', 'NOW']), []);
  return (
    <PageHero
      label="JOURNEY / 01"
      title="From building applications to building"
      accent="intelligent systems"
      subtitle="A journey through software engineering, machine learning, Generative AI and Agentic AI."
      meta="CSE ’27 · AI/ML · GenAI · Agentic AI"
      side={
        <GraphScene
          nodes={path.nodes} edges={path.edges} follow autoLoop={16} litMode="near" scale={0.11} cam={7} fadeDist={7.5}
          yaw={0.55} sway={0.08} pitch={0.28} particles={22} className="h-[380px] sm:h-[460px]" hint="Camera follows the path"
          ariaLabel="3D journey path from Full Stack to Agentic AI"
        />
      }
    />
  );
}

/* ------------------------------- 02 · Origin ------------------------------ */
function Origin() {
  return (
    <Section id="origin" label="02 / Origin" title="Where it" accent="started">
      <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
        <Reveal className="space-y-5 text-[17px] leading-relaxed text-muted">
          <p>My journey began with Computer Science and software development. Building applications taught me how different pieces of a system — frontend, backend, APIs and databases — come together to solve a problem.</p>
          <p>That foundation eventually led me toward Machine Learning, where I became interested not only in building software, but in making software capable of learning from data.</p>
        </Reveal>
        <Reveal delay={120}>
          <ol className="relative mx-auto max-w-xs space-y-6 rounded-2xl border border-line/10 bg-surface/60 p-7 text-center font-mono text-[12px] uppercase tracking-[0.14em]">
            {['Computer Science', 'Software Development', 'Problem Solving'].map((t, i, a) => (
              <li key={t} className="relative">
                <span className="block rounded-lg border border-line/12 bg-bg/60 px-4 py-3">{t}</span>
                {i < a.length - 1 && <span className="mx-auto mt-2 block h-4 w-px bg-accent" />}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </Section>
  );
}

/* --------------------- 03 · Engineering evolution (signature) --------------------- */
function Evolution() {
  const path = useMemo(() => {
    const p = pathLayout(STAGES.map((s) => s.title));
    return p;
  }, []);
  const { sectionRef, progressRef, index } = useScrollProgress(STAGES.length);
  const st = STAGES[index];
  return (
    <section id="evolution" ref={sectionRef} className="relative" style={{ height: `${STAGES.length * 95}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="mx-auto grid h-full max-w-6xl grid-rows-[40%_1fr] gap-3 px-5 pb-5 pt-20 lg:grid-cols-[0.95fr_1.2fr] lg:grid-rows-1 lg:gap-8 lg:pt-24">
          <div className="min-h-0 overflow-y-auto pr-1 lg:order-1">
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-accent">03 / My engineering evolution</p>
            <div key={index} className="hero-in mt-4" style={{ '--d': '0ms' }}>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-5xl italic text-accent sm:text-6xl">{st.n}</span>
                {st.current && <span className="rounded-full border border-accent/50 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">Current</span>}
              </div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{st.title}</h2>
              <TagList items={st.focus} className="mt-4" />
              {st.flow && <p className="mt-4 rounded-lg border border-line/10 bg-surface/60 px-3 py-2 font-mono text-[11.5px] leading-relaxed text-fg/80">{st.flow}</p>}
              <p className="mt-4 text-[15.5px] leading-relaxed text-muted">{st.story}</p>
              <p className="mt-3 text-[14px] leading-relaxed text-muted"><span className="font-semibold text-fg">What it taught me — </span>{st.taught}</p>
              {st.projects && (
                <p className="mt-3 flex flex-wrap items-center gap-2 text-[13px] text-muted">
                  Built: {st.projects.map((p) => <a key={p} href="#/projects" className="rounded-full border border-accent/40 px-2.5 py-0.5 font-mono text-[11px] text-accent hover:bg-accent hover:text-accent-ink">{p}</a>)}
                </p>
              )}
            </div>
            <div className="mt-6 flex items-center gap-1.5" aria-hidden>
              {STAGES.map((s, i) => <span key={s.n} className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-accent' : i < index ? 'w-3 bg-accent/50' : 'w-3 bg-line/20'}`} />)}
            </div>
            <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted/70">Scroll — the camera follows the path</p>
          </div>
          <div className="min-h-0 lg:order-2">
            <GraphScene
              nodes={path.nodes} edges={path.edges} progressRef={progressRef} follow litMode="near" scale={0.1} cam={7} fadeDist={7}
              yaw={0.55} sway={0.1} pitch={0.28} particles={24} className="h-full" ariaLabel="Scroll-controlled 3D career path"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ 04 · Milestones ----------------------------- */
function Milestones() {
  return (
    <Section id="milestones" label="04 / Milestones" title="Milestones along the" accent="way">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MILESTONES.map((m, i) => (
          <Reveal key={m.label} delay={i * 90}>
            <div className="group h-full rounded-2xl border border-line/10 bg-surface/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/40">
              <p className="text-3xl font-semibold tracking-tight">{m.count ? <CountUp to={m.count} suffix={m.suffix} /> : m.big}</p>
              <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.14em] text-accent">{m.label}</p>
              <p className="mt-1 text-[13.5px] text-muted">{m.sub}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------- 05 · Learning stack evolution ------------------------ */
function StackEvolution() {
  const [ref, seen] = useInView(0.25);
  return (
    <Section id="stack" label="05 / Learning stack evolution" title="How my stack" accent="evolved" intro="Different from the Skills page: not what I know now, but how it grew.">
      <div ref={ref} className="relative">
        <div className={`draw-line absolute left-0 right-0 top-[15px] hidden h-px bg-accent/60 md:block ${seen ? 'in' : ''}`} aria-hidden />
        <ol className="grid gap-8 md:grid-cols-4">
          {STACK_YEARS.map((y, i) => (
            <li key={y.year} className={`pop-in ${seen ? 'in' : ''}`} style={{ transitionDelay: `${300 + i * 260}ms` }}>
              <span className="relative z-10 grid h-8 w-8 place-items-center rounded-full border border-accent bg-bg"><span className={`h-2.5 w-2.5 rounded-full ${i === 3 ? 'bg-accent' : 'bg-accent/50'}`} /></span>
              <p className="mt-4 font-serif text-4xl italic text-accent">{y.year}</p>
              <TagList items={y.items} className="mt-3" />
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

/* --------------------------- 06 · Learning by building --------------------------- */
function Building() {
  return (
    <Section id="building" label="06 / Learning by building" title="Learning by" accent="building" intro="My learning turned into real systems. Hover a technology to light up the projects connected to it.">
      <Reveal>
        <div className="overflow-hidden rounded-3xl border border-line/12 bg-surface/50">
          <GraphScene
            nodes={KNOWLEDGE.nodes} edges={KNOWLEDGE.edges} lineage className="h-[440px] sm:h-[540px]" fit={0.42} sway={0.3} pitch={0.2}
            particles={30} hint="Hover to trace connections" ariaLabel="3D knowledge graph linking technologies to projects"
          />
        </div>
      </Reveal>
    </Section>
  );
}

/* ------------------------------ 07 · Current focus ------------------------------ */
const FOCUS_CORE = { name: 'AI Systems', desc: 'Where the journey is right now.' };
const FOCUS_NODES = [
  { name: 'MCP', desc: 'Standardised tool and context access for models' },
  { name: 'RAG', desc: 'Retrieval-grounded generation' },
  { name: 'Agents', desc: 'Tool-using, multi-step reasoning' },
  { name: 'LangGraph', desc: 'Stateful agent orchestration' },
];

function Focus() {
  return (
    <Section id="focus" label="07 / Current focus" title="What I’m" accent="exploring now">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <HeroScene core={FOCUS_CORE} nodes={FOCUS_NODES} className="h-[360px]" hint="Hover a node" />
        <div className="grid gap-3 sm:grid-cols-2">
          {FOCUS_CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <div className="h-full rounded-2xl border border-line/10 bg-surface/60 p-5 transition hover:border-accent/40">
                <h3 className="font-semibold tracking-tight">{c.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------ 08–09 · Heading + roadmap ------------------------------ */
function Heading() {
  const [sel, setSel] = useState(0);
  return (
    <Section id="heading" label="08 / Where I’m heading" title="Where I’m" accent="heading">
      <Reveal className="max-w-3xl">
        <p className="font-serif text-[1.7rem] italic leading-snug text-fg/90">
          I’m working toward becoming an AI/ML engineer capable of designing and building intelligent systems from the model layer to the application and infrastructure layer.
        </p>
      </Reveal>
      <Reveal className="mt-12">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-3 font-mono text-[11.5px] uppercase tracking-[0.12em]">
          {EQUATION.map((e, i) => (
            <span key={e} className="inline-flex items-center gap-3">
              <span className="rounded-full border border-line/15 bg-surface/60 px-4 py-2">{e}</span>
              {i < EQUATION.length - 1 && <span className="text-accent">+</span>}
            </span>
          ))}
          <ArrowRightIcon width={16} height={16} className="text-accent" />
          <span className="rounded-full bg-accent px-4 py-2 font-semibold text-accent-ink">Intelligent products</span>
        </div>
      </Reveal>

      <div className="mt-20">
        <p className="mb-6 font-mono text-[12px] uppercase tracking-[0.2em] text-accent">09 / Future roadmap — exploring next</p>
        <ol className="relative grid gap-3 md:grid-cols-5">
          <div className="absolute left-0 right-0 top-[15px] hidden h-px bg-line/15 md:block" aria-hidden />
          {ROADMAP.map((r, i) => (
            <li key={r.title}>
              <button type="button" onClick={() => setSel(i)} aria-pressed={sel === i} className="group block w-full text-left">
                <span className={`relative z-10 grid h-8 w-8 place-items-center rounded-full border bg-bg transition ${sel === i ? 'border-accent shadow-[0_0_18px_2px_rgb(var(--accent)/.5)]' : 'border-line/25 group-hover:border-accent/60'}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${r.now ? 'bg-accent' : 'bg-line/40'} ${sel === i ? '!bg-accent' : ''}`} />
                </span>
                <p className={`mt-3 text-[15px] font-medium tracking-tight transition ${sel === i ? 'text-accent' : ''}`}>{r.title}</p>
                {r.now && <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">Current</p>}
              </button>
            </li>
          ))}
        </ol>
        <p key={sel} className="hero-in mt-6 max-w-xl rounded-xl border border-line/10 bg-surface/60 px-5 py-4 text-[14.5px] text-muted" style={{ '--d': '0ms' }}>{ROADMAP[sel].text}</p>
      </div>
    </Section>
  );
}

export default function Journey() {
  return (
    <>
      <JourneyHero />
      <Origin />
      <Evolution />
      <Milestones />
      <StackEvolution />
      <Building />
      <Focus />
      <Heading />
      <section className="relative">
        <ParticleField count={70} link={90} className="opacity-60" />
        <PageCTA eyebrow="The journey continues" title="Every project is another step toward" accent="more capable intelligent systems.">
          <LinkBtn href="#/projects">Explore My Projects</LinkBtn>
        </PageCTA>
      </section>
    </>
  );
}
