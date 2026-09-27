import { AGENTFORGE, DEBUGGER, FINGROW, FITGENIUS, PROJECTS } from '../data/projects';
import { CASE_STUDIES } from '../data/caseStudies';
import { SOCIALS } from '../data/content';
import GraphScene from '../components/GraphScene';
import MiniViz from '../components/MiniViz';
import Reveal from '../components/Reveal';
import PageCTA from '../components/PageCTA';
import { LinkBtn, Section, TagList } from '../components/ui';
import { ArrowRightIcon, ArrowUpRightIcon, CheckIcon } from '../components/Icons';

const GITHUB = SOCIALS.find((s) => s.id === 'github').href;
const GRAPHS = { AGENTFORGE, DEBUGGER, FINGROW, FITGENIUS };

/* --------------------------------- Not found -------------------------------- */
function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-6xl flex-col justify-center px-5 pt-28">
      <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-accent">404</p>
      <h1 className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl">Project not found</h1>
      <p className="mt-4 max-w-md text-muted">That case study doesn’t exist yet.</p>
      <a href="#/projects" className="mt-8 w-fit rounded-full border border-line/20 px-6 py-3 text-[15px] font-medium transition hover:border-accent/60 hover:text-accent">
        ← Back to Projects
      </a>
    </section>
  );
}

/* ----------------------------------- Hero ---------------------------------- */
function CaseHero({ p, cs, idx }) {
  const graphKey = cs.graph && GRAPHS[cs.graph];
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32">
      <div className="grid-lines absolute inset-0 -z-10" aria-hidden />
      <div className="hero-glow absolute -right-40 top-10 -z-10 h-[620px] w-[620px]" aria-hidden />
      <div className="mx-auto max-w-6xl px-5 pb-10">
        <a href="#/projects" className="hero-in inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] text-muted transition hover:text-accent" style={{ '--d': '80ms' }}>
          ← All projects
        </a>
        <p className="hero-in mt-6 font-mono text-[12px] uppercase tracking-[0.22em] text-accent" style={{ '--d': '160ms' }}>
          Case study {idx ? `/ ${String(idx).padStart(2, '0')}` : ''}
        </p>
        <h1 className="hero-in mt-4 max-w-3xl text-[clamp(2.4rem,6vw,4.6rem)] font-semibold leading-[1.0] tracking-[-0.03em]" style={{ '--d': '240ms' }}>
          {p.name}
        </h1>
        <p className="hero-in mt-4 max-w-xl text-[17px] leading-relaxed text-muted" style={{ '--d': '340ms' }}>
          {cs.tagline || p.sub}
        </p>
        <div className="hero-in mt-5" style={{ '--d': '420ms' }}>
          <TagList items={p.tags} />
        </div>
        <div className="hero-in mt-8 flex flex-wrap gap-3" style={{ '--d': '500ms' }}>
          <LinkBtn href={GITHUB} external ghost>View on GitHub</LinkBtn>
        </div>
      </div>

      <Reveal delay={140} className="mx-auto max-w-6xl px-5 pb-4">
        <div className="overflow-hidden rounded-3xl border border-line/12 bg-surface/40">
          {graphKey ? (
            <GraphScene
              nodes={graphKey.nodes} edges={graphKey.edges} className="h-[360px] sm:h-[460px]"
              fit={0.42} sway={0.4} yaw={0.15} pitch={0.2} particles={26} hint="Hover a node"
              ariaLabel={`3D architecture diagram for ${p.name}`}
            />
          ) : (
            <div className="h-[220px] p-6 sm:h-[260px]"><MiniViz kind={cs.viz || p.viz} /></div>
          )}
        </div>
      </Reveal>
    </section>
  );
}

/* --------------------------------- Sections -------------------------------- */
function Prose({ id, n, label, title, children }) {
  if (!children) return null;
  return (
    <Section id={id} label={`${n} / ${label}`} title={title}>
      <Reveal><p className="max-w-3xl text-[16.5px] leading-relaxed text-muted">{children}</p></Reveal>
    </Section>
  );
}

function StepList({ id, n, label, title, items }) {
  if (!items?.length) return null;
  return (
    <Section id={id} label={`${n} / ${label}`} title={title}>
      <Reveal>
        <ol className="grid gap-px overflow-hidden rounded-2xl border border-line/12 bg-line/12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <li key={it.title} className="bg-surface p-6">
              <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, '0')}</span>
              <p className="mt-2 font-semibold tracking-tight">{it.title}</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{it.text}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}

function Challenges({ n, items }) {
  if (!items?.length) return null;
  return (
    <Section id="challenges" label={`${n} / Challenges`} title="Challenges">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((c, i) => (
          <Reveal key={c.title} delay={i * 80}>
            <div className="h-full rounded-2xl border border-line/10 bg-surface/60 p-6">
              <p className="font-semibold tracking-tight">{c.title}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{c.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Future({ n, items }) {
  if (!items?.length) return null;
  return (
    <Section id="future" label={`${n} / Future improvements`} title="Where this could go" accent="next">
      <Reveal>
        <ul className="space-y-3">
          {items.map((f) => (
            <li key={f} className="flex items-start gap-3 text-[15px] leading-relaxed">
              <CheckIcon width={16} height={16} className="mt-1 shrink-0 text-accent" />{f}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

export default function CaseStudy({ slug }) {
  const p = PROJECTS.find((x) => x.slug === slug);
  const cs = p && CASE_STUDIES[slug];
  if (!p || !cs) return <NotFound />;

  const idx = PROJECTS.indexOf(p) + 1;
  let n = 1;
  const next = () => String(n++).padStart(2, '0');

  return (
    <>
      <CaseHero p={p} cs={cs} idx={idx} />
      <Prose id="overview" n={next()} label="Overview" title="Overview">{cs.overview}</Prose>
      <Prose id="problem" n={next()} label="Problem" title="The problem">{cs.problem}</Prose>
      <StepList id="workflow" n={next()} label="Architecture & workflow" title="How it works" items={cs.workflow} />
      <StepList id="implementation" n={next()} label="Implementation" title="Implementation" items={cs.implementation} />
      <Challenges n={next()} items={cs.challenges} />
      <Prose id="evaluation" n={next()} label="Evaluation" title="Evaluation">{cs.evaluation}</Prose>
      <Future n={next()} items={cs.future} />

      <PageCTA eyebrow="Like what you see?" title="Explore more of my" accent="AI systems" text="Every project here follows the same instinct: design the system, not just the prompt.">
        <LinkBtn href="#/projects">Back to Projects</LinkBtn>
        <LinkBtn href={GITHUB} ghost external>View GitHub</LinkBtn>
        <a href="#/contact" className="inline-flex items-center gap-2 rounded-full border border-line/20 px-6 py-3 text-[15px] font-medium transition hover:border-accent/60 hover:text-accent">
          Get in Touch <ArrowRightIcon width={15} height={15} />
        </a>
      </PageCTA>
    </>
  );
}
