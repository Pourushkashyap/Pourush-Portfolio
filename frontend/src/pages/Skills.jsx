import { useState } from 'react';
import { AREAS, CONTRIBUTE, CORE, DATA_SKILLS, DEVOPS, HERO_STACK, PROFICIENCY, ROLES, SECTIONS, WORKFLOW } from '../data/skills';
import HeroScene from '../components/HeroScene';
import MiniViz from '../components/MiniViz';
import Reveal from '../components/Reveal';
import PageCTA from '../components/PageCTA';
import { LinkBtn, PageHero, Section, TagList } from '../components/ui';
import { PROFILE } from '../data/content';
import { CheckIcon } from '../components/Icons';

const HERO_CORE = { name: 'AI Engineering', desc: 'Click any node to see the skills behind it.' };
const HERO_NODES = Object.keys(AREAS).map((k) => ({ name: k, desc: 'Click to highlight the related skills' }));

function SkillsHero() {
  const [area, setArea] = useState(null);
  return (
    <PageHero
      label="SKILLS / TECHNICAL EXPERTISE"
      title="Tools I use to build"
      accent="intelligent systems"
      subtitle="AI/ML, Agentic AI and full-stack technologies I use to design, build, deploy and maintain software systems."
      side={
        <div>
          <HeroScene core={HERO_CORE} nodes={HERO_NODES} className="h-[360px] sm:h-[420px]" hint="Click a node" selected={area} onSelect={(i, n) => n && i > 0 && setArea(n.name === area ? null : n.name)} />
          <div className="min-h-[74px] rounded-2xl border border-line/10 bg-surface/60 p-4 transition">
            {area ? (
              <>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">{area}</p>
                <TagList items={AREAS[area]} className="mt-3" />
              </>
            ) : (
              <p className="text-[13.5px] text-muted">Select Agents, RAG, ML, Full Stack or Deployment to see the skills behind it.</p>
            )}
          </div>
        </div>
      }
    >
      <p className="hero-in mt-7 max-w-lg font-mono text-[12px] leading-relaxed text-fg/80" style={{ '--d': '480ms' }}>
        {HERO_STACK.join(' · ')}
      </p>
    </PageHero>
  );
}

function CoreExpertise() {
  return (
    <Section id="core" label="02 / Core expertise" title="Four things I" accent="do well" intro="If you only read one section: this is what I can build.">
      <div className="grid gap-4 md:grid-cols-2">
        {CORE.map((c, i) => (
          <Reveal key={c.n} delay={i * 80}>
            <article className="group h-full rounded-2xl border border-line/10 bg-surface/60 p-7 transition duration-300 hover:-translate-y-1 hover:border-accent/40">
              <span className="font-mono text-[12px] text-accent">{c.n}</span>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight">{c.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{c.text}</p>
              <TagList items={c.tags} className="mt-5" />
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Group({ title, items, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <div className="h-full rounded-2xl border border-line/10 bg-surface/60 p-6">
        <h3 className="border-b border-line/10 pb-3 font-mono text-[11.5px] uppercase tracking-[0.16em] text-accent">{title}</h3>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {items.map((t) => <li key={t} className="rounded-lg border border-line/10 bg-bg/50 px-2.5 py-1.5 text-[13px] transition hover:border-accent/50 hover:text-accent">{t}</li>)}
        </ul>
      </div>
    </Reveal>
  );
}

function SkillSection({ s }) {
  return (
    <Section id={s.id} label={`${s.n} / ${s.title} ${s.accent}`} title={s.title} accent={s.accent} intro={s.intro}>
      <div className="grid gap-4 lg:grid-cols-3">
        {s.groups.map((g, i) => <Group key={g.title} {...g} delay={i * 80} />)}
      </div>
    </Section>
  );
}

function GenAI() {
  return (
    <Section id="genai" label="05 / Generative AI & RAG" title="Generative AI &" accent="RAG" intro="How a GenAI application is actually constructed — not just “I know ChatGPT”.">
      <div className="grid items-center gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <div className="rounded-2xl border border-line/10 bg-surface/60 p-6">
            <div className="mx-auto h-52 max-w-sm"><MiniViz kind="genai" /></div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
              <span>LLMs</span><span>Embeddings · RAG</span><span>Vector DB · Retrieval</span>
            </div>
            <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-accent">→ AI Application</p>
          </div>
        </Reveal>
        <Group title="Technologies" items={['LLMs', 'RAG', 'Embeddings', 'Vector Search', 'FAISS', 'Chroma', 'Prompt Engineering', 'Contextual Retrieval', 'MultiQuery Retrieval', 'Context Compression']} delay={100} />
      </div>
    </Section>
  );
}

function DataDb() {
  return (
    <Section id="data" label="07 / Data & databases" title="Data &" accent="databases">
      <div className="grid gap-4 md:grid-cols-3">
        {Object.values(DATA_SKILLS).map((g, i) => <Group key={g.title} {...g} delay={i * 80} />)}
      </div>
    </Section>
  );
}

function DevOps() {
  return (
    <Section id="devops" label="08 / DevOps & deployment" title="DevOps &" accent="deployment">
      <div className="grid gap-4 lg:grid-cols-2">
        <Group title="Tools" items={DEVOPS.tools} />
        <Reveal delay={100}>
          <div className="h-full rounded-2xl border border-line/10 bg-surface/60 p-6">
            <h3 className="border-b border-line/10 pb-3 font-mono text-[11.5px] uppercase tracking-[0.16em] text-accent">What I can do</h3>
            <ul className="mt-4 space-y-2.5">
              {DEVOPS.can.map((c) => <li key={c} className="flex items-center gap-3 text-[14.5px]"><CheckIcon width={16} height={16} className="shrink-0 text-accent" />{c}</li>)}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function Workflow() {
  return (
    <Section id="workflow" label="09 / Development workflow" title="How I" accent="work">
      <Reveal>
        <ol className="grid gap-px overflow-hidden rounded-2xl border border-line/12 bg-line/12 sm:grid-cols-2 lg:grid-cols-6">
          {WORKFLOW.map(([a, b], i) => (
            <li key={a} className="relative bg-surface p-5">
              <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, '0')}</span>
              <p className="mt-2 font-semibold tracking-tight">{a}</p>
              <p className="mt-1 text-[13px] text-muted">{b}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}

function Contribute() {
  return (
    <Section id="contribute" label="10 / How I can contribute" title="What I can build for" accent="your team" intro="If you hire me — what can I actually contribute?">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {CONTRIBUTE.map((c, i) => (
          <Reveal key={c.title} delay={i * 70} className={i === 0 ? 'lg:col-span-1' : ''}>
            <article className="group h-full rounded-2xl border border-accent/25 bg-gradient-to-b from-accent/[0.07] to-transparent p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/60">
              <span className="font-mono text-[12px] text-accent">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">{c.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{c.text}</p>
              <TagList items={c.tags} className="mt-5" />
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-16">
        <h3 className="mb-5 font-mono text-[12px] uppercase tracking-[0.2em] text-accent">Where I can contribute</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {ROLES.map((r) => (
            <div key={r.title} className="rounded-2xl border border-line/10 bg-surface/60 p-6">
              <p className="text-lg font-semibold tracking-tight">{r.title}</p>
              <ul className="mt-4 space-y-2 text-[14px] text-muted">
                {r.items.map((i) => <li key={i} className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-accent" />{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[13px] text-muted">These are the kinds of work my current skill set is oriented toward — not claims of professional experience in each role.</p>
      </Reveal>
    </Section>
  );
}

function Proficiency() {
  return (
    <Section id="proficiency" label="12 / Skill proficiency" title="An honest view of" accent="my level" intro="No arbitrary percentage bars — just three clear categories.">
      <div className="grid gap-4 md:grid-cols-3">
        {PROFICIENCY.map((p, i) => (
          <Reveal key={p.title} delay={i * 90}>
            <div className={`h-full rounded-2xl border p-6 ${i === 0 ? 'border-accent/40 bg-accent/[0.05]' : 'border-line/10 bg-surface/60'}`}>
              <p className="text-xl font-semibold tracking-tight">{p.title}</p>
              <p className="mb-4 text-[13px] text-muted">{p.sub}</p>
              <TagList items={p.items} />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export default function Skills() {
  return (
    <>
      <SkillsHero />
      <CoreExpertise />
      <SkillSection s={SECTIONS[0]} />
      <SkillSection s={SECTIONS[1]} />
      <GenAI />
      <SkillSection s={SECTIONS[2]} />
      <DataDb />
      <DevOps />
      <Workflow />
      <Contribute />
      <Proficiency />
      <PageCTA title="Looking for someone who can" accent="build with AI?" text="Let’s talk about what I can contribute to your next AI/ML or software engineering project.">
        <LinkBtn href="#/projects">View Projects</LinkBtn>
        <a href={PROFILE.resumeUrl} download className="inline-flex items-center gap-2 rounded-full border border-line/20 px-6 py-3 text-[15px] font-medium transition hover:border-accent/60 hover:text-accent">Download Resume</a>
      </PageCTA>
    </>
  );
}
