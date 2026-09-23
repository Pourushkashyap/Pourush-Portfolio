import { useEffect, useMemo, useRef } from 'react';
import { ABOUT_BUILD, ABOUT_STAGES, BUILDING_NOW, FOCUS_ITEMS, THINK_STEPS } from '../data/about';
import { PROFILE } from '../data/content';
import GraphScene from '../components/GraphScene';
import Reveal from '../components/Reveal';
import PageCTA from '../components/PageCTA';
import { LinkBtn, PageHero, Section, TagList, go } from '../components/ui';
import { AgentIcon, ArrowRightIcon, ChartIcon, LayersIcon, StackIcon } from '../components/Icons';
import { useScrollProgress } from '../lib/hooks';

const ICONS = { agent: AgentIcon, layers: LayersIcon, chart: ChartIcon, stack: StackIcon };

/* deterministic pseudo-random so the network looks the same on every load */
function rng(seed) {
  let a = seed;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

function neuralLayout() {
  const r = rng(7);
  const layers = [4, 6, 7, 6, 3];
  const nodes = [];
  const idx = [];
  layers.forEach((count, li) => {
    idx[li] = [];
    for (let k = 0; k < count; k++) {
      const y = (k - (count - 1) / 2) * 0.95 + (r() - 0.5) * 0.35;
      nodes.push({ label: '', pos: [(li - 2) * 1.9, y, (r() - 0.5) * 2.6], size: li === 2 && k === 3 ? 1.5 : 0.8 + r() * 0.4, kind: li === 2 && k === 3 ? 'gem' : 'node' });
      idx[li].push(nodes.length - 1);
    }
  });
  const edges = [];
  for (let li = 0; li < layers.length - 1; li++) {
    idx[li].forEach((a) => {
      const picks = new Set();
      const want = 2 + Math.floor(r() * 2);
      while (picks.size < Math.min(want, idx[li + 1].length)) picks.add(idx[li + 1][Math.floor(r() * idx[li + 1].length)]);
      picks.forEach((b) => edges.push([a, b]));
    });
  }
  return { nodes, edges };
}

function pipelineLayout() {
  const nodes = THINK_STEPS.map((s, i) => {
    const a = i * 0.95;
    return { label: s.title, desc: s.text, pos: [Math.cos(a) * 1.5, 2.7 - i * 0.9, Math.sin(a) * 1.5], size: 1.15, kind: 'node' };
  });
  return { nodes, edges: nodes.slice(1).map((_, i) => [i, i + 1]) };
}

/* ------------------------------ 01 · Hero ------------------------------ */
function AboutHero() {
  const net = useMemo(neuralLayout, []);
  return (
    <PageHero
      label="ABOUT / 01"
      title="Building"
      accent="Intelligence Into Software"
      subtitle={`I’m ${PROFILE.name}, a Computer Science Engineer focused on AI/ML, Generative AI and Agentic AI.`}
      meta="AI Systems · Agents · RAG · Machine Learning · Full Stack"
    >
      <div className="hero-in mt-8 flex flex-wrap gap-3" style={{ '--d': '520ms' }}>
        <LinkBtn onClick={() => go('who')}>My story</LinkBtn>
        <LinkBtn href="#/projects" ghost>See the work</LinkBtn>
      </div>
      <div className="hero-in relative mt-8 sm:mt-12" style={{ '--d': '600ms' }}>
        <div className="relative overflow-hidden rounded-3xl border border-line/10 bg-surface/30">
          <GraphScene
            nodes={net.nodes} edges={net.edges} labels={false}
            className="h-[360px] sm:h-[460px]" fit={0.46} spin={0.06} sway={0.5} pitch={0.22} particles={44}
            ariaLabel="Animated 3D neural network"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-bg/80 to-transparent px-5 pb-4 pt-10 font-mono text-[11px] uppercase tracking-[0.18em] text-muted sm:px-8">
            <span>Ideas</span><ArrowRightIcon width={14} height={14} className="text-accent" />
            <span>Intelligence</span><ArrowRightIcon width={14} height={14} className="text-accent" />
            <span>Systems</span>
          </div>
        </div>
      </div>
    </PageHero>
  );
}

/* ----------------------------- 02 · Who I am ----------------------------- */
function IdentityOrbit() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm">
      <div className="orbit-ring absolute inset-0 rounded-full border border-dashed border-line/20">
        <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_18px_4px_rgb(var(--accent)/.5)]" />
      </div>
      <div className="orbit-ring-rev absolute inset-[13%] rounded-full border border-line/15">
        <span className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-fg/80" />
        <span className="absolute -left-1 top-[22%] h-2 w-2 rounded-full bg-accent/70" />
      </div>
      <div className="orbit-ring absolute inset-[27%] rounded-full border border-line/10" />
      <div className="absolute inset-[36%] grid place-items-center rounded-3xl border border-accent/40 bg-surface shadow-[0_0_60px_-10px_rgb(var(--accent)/.5)]">
        <span className="font-serif text-4xl italic text-accent">PK</span>
      </div>
      {['LangGraph', 'RAG', 'MCP'].map((t, i) => (
        <span key={t} className="float-slow absolute rounded-full border border-line/15 bg-bg/80 px-2.5 py-1 font-mono text-[10px] backdrop-blur" style={{ top: ['6%', '72%', '30%'][i], left: ['6%', '70%', '78%'][i], animationDelay: `${i * 1.2}s` }}>{t}</span>
      ))}
    </div>
  );
}

function WhoIAm() {
  return (
    <Section id="who" label="01 / Who I am" title="Who I" accent="am">
      <div className="grid items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
        <Reveal className="space-y-5 text-[17px] leading-relaxed text-muted">
          <p className="text-[19px] text-fg">
            I’m {PROFILE.name}, a Computer Science student and AI-focused developer who enjoys turning complex problems into intelligent software systems.
          </p>
          <p>
            My journey started with full-stack development, where I learned how applications are designed, built and deployed. That foundation led me into Machine Learning and Deep Learning, and eventually toward Generative AI, RAG and Agentic AI.
          </p>
          <p>
            Today, I’m particularly interested in building systems where AI can reason, use tools, interact with other agents and operate as part of real software infrastructure.
          </p>
          <ul className="flex flex-wrap gap-3 pt-3">
            {[["CSE ’27", 'Computer Science'], ['AI / ML', 'Focus'], ['AI AGENTS', 'Direction']].map(([a, b]) => (
              <li key={a} className="rounded-xl border border-line/12 bg-surface/60 px-5 py-3">
                <p className="font-semibold tracking-tight">{a}</p>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">{b}</p>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={150}><IdentityOrbit /></Reveal>
      </div>
    </Section>
  );
}

/* ---------------------------- 03 · What I build --------------------------- */
function WhatIBuildAbout() {
  return (
    <Section id="build" label="02 / What I build" title="What exactly do I" accent="work on?">
      <div className="grid gap-4 sm:grid-cols-2">
        {ABOUT_BUILD.map((c, i) => {
          const Icon = ICONS[c.icon];
          return (
            <Reveal key={c.title} delay={i * 90}>
              <article className="group h-full rounded-2xl border border-line/10 bg-surface/60 p-7 transition duration-300 hover:-translate-y-1 hover:border-accent/40">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-line/12 text-accent transition group-hover:scale-110 group-hover:bg-accent group-hover:text-accent-ink">
                  <Icon width={20} height={20} />
                </span>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{c.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{c.text}</p>
                <TagList items={c.tags} className="mt-5" />
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ---------------------------- 04 · How I think ---------------------------- */
function HowIThink() {
  const layout = useMemo(pipelineLayout, []);
  const { sectionRef, progressRef, index } = useScrollProgress(THINK_STEPS.length);
  return (
    <section id="think" ref={sectionRef} className="relative h-[430vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="mx-auto grid h-full max-w-6xl grid-rows-[38%_1fr] gap-2 px-5 pb-6 pt-20 lg:grid-cols-[1fr_1.05fr] lg:grid-rows-1 lg:gap-8 lg:pt-24">
          <div className="min-h-0 lg:order-2">
            <GraphScene
              nodes={layout.nodes} edges={layout.edges} progressRef={progressRef} traveler litMode="passed"
              className="h-full" fit={0.4} sway={0.28} yaw={0.5} pitch={0.18} particles={0}
              ariaLabel="Scroll-controlled 3D engineering pipeline"
            />
          </div>
          <div className="flex min-h-0 flex-col justify-center lg:order-1">
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-accent">03 / How I think</p>
            <h2 className="mt-3 text-3xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              I don’t start with the model. <span className="font-serif font-normal italic text-accent">I start with the problem.</span>
            </h2>
            <ol className="mt-6 space-y-1.5">
              {THINK_STEPS.map((s, i) => {
                const on = i === index;
                return (
                  <li key={s.title} className={`rounded-xl border px-4 py-2.5 transition-all duration-300 ${on ? 'border-accent/50 bg-accent/[0.07]' : 'border-transparent'}`}>
                    <div className="flex items-baseline gap-3">
                      <span className={`font-mono text-[11px] ${on ? 'text-accent' : 'text-muted/70'}`}>{String(i + 1).padStart(2, '0')}</span>
                      <span className={`text-[15px] font-medium tracking-tight ${on ? 'text-fg' : i < index ? 'text-fg/70' : 'text-muted'}`}>{s.title}</span>
                    </div>
                    <p className={`overflow-hidden pl-[34px] text-[13.5px] leading-snug text-muted transition-all duration-300 ${on ? 'mt-1 max-h-16 opacity-100' : 'max-h-0 opacity-0'}`}>{s.text}</p>
                  </li>
                );
              })}
            </ol>
            <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted/70">Scroll to move the signal through the pipeline</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- 05 · AI journey ---------------------------- */
function AIJourney() {
  const { sectionRef, progressRef } = useScrollProgress();
  return (
    <Section id="journey" label="04 / My AI journey" title="From Full Stack to" accent="Agentic AI">
      <div ref={sectionRef} className="relative mx-auto max-w-3xl">
        <div className="absolute bottom-2 left-[15px] top-2 w-px bg-line/15" aria-hidden />
        <FillLineImpl progressRef={progressRef} />
        <ol className="space-y-8">
          {ABOUT_STAGES.map((s, i) => (
            <Reveal as="li" key={s.title} delay={60} className="relative pl-12">
              <span className={`absolute left-0 top-1 grid h-8 w-8 place-items-center rounded-full border bg-bg font-mono text-[11px] ${i === ABOUT_STAGES.length - 1 ? 'marker-ping border-accent text-accent' : 'border-line/25 text-muted'}`}>
                <span className="relative z-10">{String(i + 1).padStart(2, '0')}</span>
              </span>
              <h3 className="text-lg font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-1 text-[15px] leading-relaxed text-muted">{s.text}</p>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-10 pl-12">
          <a href="#/journey" className="group inline-flex items-center gap-2 text-[15px] font-medium transition hover:text-accent">
            Explore the full 3D journey <ArrowRightIcon width={16} height={16} className="transition-transform group-hover:translate-x-1" />
          </a>
        </Reveal>
      </div>
    </Section>
  );
}

// accent line that fills as the section scrolls through
function FillLineImpl({ progressRef }) {
  const ref = useRef(null);
  useEffect(() => {
    let raf;
    const tick = () => {
      if (ref.current) ref.current.style.transform = `scaleY(${Math.min(1, progressRef.current * 1.15)})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);
  return <div ref={ref} className="line-fill absolute bottom-2 left-[15px] top-2 w-px bg-accent shadow-[0_0_10px_1px_rgb(var(--accent)/.6)]" aria-hidden />;
}

/* --------------------------- 06 · Current focus --------------------------- */
function CurrentFocus() {
  return (
    <Section id="focus" label="05 / Current focus" title="Currently" accent="exploring">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <Reveal>
          <ul className="grid gap-3 sm:grid-cols-2">
            {FOCUS_ITEMS.map((f) => (
              <li key={f} className="flex items-center gap-3 rounded-xl border border-line/10 bg-surface/60 px-4 py-4 text-[15px] font-medium">
                <span className="relative grid h-2.5 w-2.5 place-items-center"><span className="marker-ping absolute inset-0" /><span className="relative h-2.5 w-2.5 rounded-full bg-accent" /></span>
                {f}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={120} className="flex items-center">
          <p className="border-l-2 border-accent pl-6 font-serif text-[1.6rem] italic leading-snug text-fg/90">
            My goal is to build AI systems that are not just intelligent, but reliable, observable and useful in real-world environments.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------------------------- 07 · Building now --------------------------- */
function BuildingNow() {
  return (
    <Section id="now" label="06 / Building now" title="What I’m" accent="building">
      <div className="grid gap-4 md:grid-cols-3">
        {BUILDING_NOW.map((b, i) => (
          <Reveal key={b.name} delay={i * 90}>
            <a href="#/projects" className="group flex h-full flex-col rounded-2xl border border-line/10 bg-surface/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/40">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">In progress</span>
              <h3 className="mt-4 text-xl font-semibold tracking-tight">{b.name}</h3>
              <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-muted">{b.text}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium group-hover:text-accent">
                View Project <ArrowRightIcon width={15} height={15} className="transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ----------------------------- 08 · Beyond code ---------------------------- */
function BeyondCode() {
  return (
    <section className="relative mx-auto max-w-6xl overflow-hidden px-5 py-24 text-center">
      <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-accent">Beyond code</p>
      <Reveal>
        <p className="mx-auto mt-6 max-w-2xl font-serif text-[clamp(2rem,4.6vw,3.4rem)] italic leading-[1.1]">
          Curious by nature. <span className="text-accent">Builder by habit.</span> Always learning.
        </p>
      </Reveal>
      <Reveal delay={120}>
        <p className="mx-auto mt-6 max-w-lg text-[16px] leading-relaxed text-muted">
          I enjoy exploring new AI systems, solving algorithmic problems and turning ideas into working products.
        </p>
      </Reveal>
      {['☕', '💻', '🧠', '⚡'].map((e, i) => (
        <span key={e} aria-hidden className="float-slow absolute hidden text-2xl opacity-60 md:block" style={{ top: `${[18, 62, 28, 70][i]}%`, left: `${[12, 20, 84, 76][i]}%`, animationDelay: `${i * 1.1}s` }}>{e}</span>
      ))}
    </section>
  );
}

export default function About() {
  return (
    <>
      <AboutHero />
      <WhoIAm />
      <WhatIBuildAbout />
      <HowIThink />
      <AIJourney />
      <CurrentFocus />
      <BuildingNow />
      <BeyondCode />
      <PageCTA eyebrow="Where I’m heading" title="Building intelligent systems that can" accent="reason, act and solve real problems.">
        <LinkBtn href="#/projects">Explore My Projects</LinkBtn>
      </PageCTA>
    </>
  );
}
