import { useRef, useState } from 'react';
import {
  ACHIEVEMENTS, BUILT_ALONG, CERTIFICATIONS, CERT_CATEGORIES, CURRENT_FOCUS,
  EDUCATION, EXPERIENCE, PROBLEM_TAGS, SCHOOL, TRAINING,
} from '../data/education';
import { PROFILE, SOCIALS } from '../data/content';
import CountUp from '../components/CountUp';
import Reveal from '../components/Reveal';
import PageCTA from '../components/PageCTA';
import { LinkBtn, PageHero, Section, TagList } from '../components/ui';
import { ArrowRightIcon, ArrowUpRightIcon, CheckIcon } from '../components/Icons';
import { useFlip } from '../lib/hooks';

const LEETCODE = SOCIALS.find((s) => s.id === 'leetcode').href;
const GITHUB = SOCIALS.find((s) => s.id === 'github').href;

/* ------------------------------- 01 · Hero ------------------------------- */
function BackgroundHero() {
  return (
    <PageHero
      label="EDUCATION / EXPERIENCE"
      title="Building My"
      accent="Foundation"
      subtitle="My academic background, practical training, certifications and achievements shaping my journey toward AI/ML engineering."
    >
      <div className="relative mt-8">
        <div className="draw-line in absolute left-0 top-1/2 h-px w-full bg-gradient-to-r from-accent via-line/25 to-transparent" aria-hidden />
        <ul className="hero-in relative flex flex-wrap gap-2" style={{ '--d': '460ms' }}>
          {["CSE '27", 'AI/ML', 'Agentic AI', 'Full-Stack Development'].map((t) => (
            <li key={t} className="rounded-full border border-line/15 bg-bg px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-fg/85">{t}</li>
          ))}
        </ul>
      </div>
    </PageHero>
  );
}

/* ----------------------------- 02 · Education ----------------------------- */
function Education() {
  return (
    <Section id="education" label="01 / Education" title="Education">
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Reveal>
          <div className="h-full rounded-2xl border border-line/10 bg-surface/60 p-7 sm:p-9">
            <p className="text-xl font-semibold tracking-tight">{EDUCATION.school}</p>
            <p className="mt-1 text-[15px] text-muted">{EDUCATION.degree}</p>
            <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.14em] text-accent">{EDUCATION.years} · CGPA {EDUCATION.cgpa}</p>
            <h3 className="mb-3 mt-7 border-t border-line/10 pt-5 font-mono text-[11.5px] uppercase tracking-[0.16em] text-muted">Focus areas</h3>
            <TagList items={EDUCATION.focus} />
          </div>
        </Reveal>
        <Reveal delay={110}>
          <div className="grid h-full grid-cols-3 gap-3 lg:grid-cols-1">
            {[[EDUCATION.cgpa, 'CGPA'], ['CSE', 'Computer Science'], ['2027', 'Expected graduation']].map(([a, b]) => (
              <div key={b} className="flex flex-col justify-center rounded-2xl border border-line/10 bg-surface/60 p-5 text-center lg:text-left">
                <p className="text-3xl font-semibold tracking-tight">{a}</p>
                <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.13em] text-muted">{b}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal delay={160} className="mt-4 grid gap-4 sm:grid-cols-2">
        {SCHOOL.map((s) => (
          <div key={s.level} className="rounded-2xl border border-line/10 bg-surface/40 p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">{s.level}</p>
            <p className="mt-2 text-[15px] font-medium tracking-tight">{s.board}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{s.score}</p>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}

/* ------------------------- 03 · Practical experience ------------------------ */
function ExperienceCard() {
  const [open, setOpen] = useState(false);
  const d = EXPERIENCE.detail;
  return (
    <Reveal>
      <div className="overflow-hidden rounded-2xl border border-accent/25 bg-gradient-to-b from-accent/[0.06] to-transparent">
        <div className="p-7 sm:p-9">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xl font-semibold tracking-tight">{EXPERIENCE.company}</p>
              <p className="mt-1 text-[14.5px] text-accent">{EXPERIENCE.role}</p>
            </div>
            <span className="rounded-full border border-line/15 px-3 py-1 font-mono text-[11px] text-muted">{EXPERIENCE.date}</span>
          </div>
          <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.14em] text-muted">{EXPERIENCE.focus}</p>
          <ul className="mt-5 space-y-2.5 border-t border-line/10 pt-5">
            {EXPERIENCE.points.map((p) => (
              <li key={p} className="flex gap-3 text-[14.5px] leading-relaxed text-muted"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />{p}</li>
            ))}
          </ul>
          <TagList items={EXPERIENCE.tech} className="mt-5" />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium transition hover:text-accent"
          >
            {open ? 'Hide details' : 'View Experience'}
            <ArrowRightIcon width={15} height={15} className={`transition-transform ${open ? 'rotate-90' : ''}`} />
          </button>
        </div>
        <div className={`grid overflow-hidden transition-[grid-template-rows] duration-500 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="min-h-0 border-t border-line/10 bg-bg/30 p-7 sm:p-9">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">Role</p>
                <p className="mt-1.5 text-[14.5px]">{d.role}</p>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-accent">Duration</p>
                <p className="mt-1.5 text-[14.5px]">{d.duration}</p>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-accent">What I learned</p>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{d.learned}</p>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">Responsibilities</p>
                <ul className="mt-1.5 space-y-1.5">
                  {d.responsibilities.map((r) => (
                    <li key={r} className="flex gap-2.5 text-[13.5px] leading-relaxed text-muted"><CheckIcon width={14} height={14} className="mt-0.5 shrink-0 text-accent" />{r}</li>
                  ))}
                </ul>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-accent">Technologies</p>
                <TagList items={d.technologies} className="mt-1.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function TrainingCard() {
  return (
    <Reveal delay={120}>
      <div className="h-full rounded-2xl border border-line/10 bg-surface/50 p-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">Training program</p>
        <p className="mt-2 text-lg font-semibold tracking-tight">{TRAINING.program}</p>
        <p className="mt-1 text-[13px] text-muted">Duration: {TRAINING.duration}</p>
        <h4 className="mb-2 mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Focus</h4>
        <TagList items={TRAINING.focus} />
        <h4 className="mb-2 mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Skills applied</h4>
        <TagList items={TRAINING.skills} />
      </div>
    </Reveal>
  );
}

function PracticalExperience() {
  return (
    <Section id="experience" label="02 / Practical experience" title="Practical" accent="experience" intro="Internship, training and industry exposure — not full-time employment, but real project work.">
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <ExperienceCard />
        <TrainingCard />
      </div>
    </Section>
  );
}

/* ------------------------------ 04 · Certifications ----------------------------- */
function CertCard({ c }) {
  return (
    <div className="group flex h-full flex-col rounded-2xl border border-line/10 bg-surface/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/40">
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{c.category}</span>
      <p className="mt-3 flex-1 text-[16px] font-semibold leading-snug tracking-tight">{c.name}</p>
      <p className="mt-2 text-[13.5px] text-muted">{c.issuer}</p>
      <div className="mt-4 flex items-center justify-between border-t border-line/10 pt-4 text-[13px]">
        <span className="text-muted">{c.year}</span>
        {c.url ? (
          <a href={c.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium transition hover:text-accent">View Credential <ArrowUpRightIcon width={13} height={13} /></a>
        ) : (
          <span className="text-muted/60">Credential pending</span>
        )}
      </div>
    </div>
  );
}

function Certifications() {
  const [cat, setCat] = useState('All');
  const ref = useRef(null);
  const shown = CERTIFICATIONS.filter((c) => cat === 'All' || c.category === cat);
  useFlip(ref, [cat]);
  return (
    <Section id="certifications" label="03 / Certifications" title="Certifications">
      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter certifications">
        {CERT_CATEGORIES.map((c) => (
          <button
            key={c} type="button" role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
            className={`rounded-full border px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.12em] transition ${cat === c ? 'border-accent bg-accent text-accent-ink' : 'border-line/15 text-muted hover:border-accent/50 hover:text-fg'}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div ref={ref} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((c) => <div key={c.name + c.issuer} data-flip={c.name}><CertCard c={c} /></div>)}
      </div>
    </Section>
  );
}

/* ------------------------------ 05 · Achievements ----------------------------- */
function Achievements() {
  return (
    <Section id="achievements" label="04 / Achievements" title="Achievements">
      <Reveal>
        <div className="relative">
          <div className="draw-line in absolute left-0 right-0 top-[15px] hidden h-px bg-line/20 sm:block" aria-hidden />
          <div className="grid gap-6 sm:grid-cols-3">
            {ACHIEVEMENTS.map((a, i) => (
              <Reveal key={a.title} delay={i * 120} className="relative pt-9 text-center sm:text-left">
                <span className="absolute left-1/2 top-0 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full border border-accent bg-bg sm:left-0 sm:translate-x-0">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                </span>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">{a.tag}</p>
                <p className="mt-2 text-[16px] font-semibold leading-snug tracking-tight">{a.title}</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{a.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* ---------------------------- 06 · Problem solving --------------------------- */
function ProblemSolving() {
  return (
    <Section id="problem-solving" label="05 / Coding & problem solving" title="Problem" accent="solving">
      <Reveal>
        <div className="rounded-2xl border border-line/10 bg-surface/60 p-8 text-center sm:p-12">
          <p className="text-5xl font-semibold tracking-tight sm:text-6xl"><CountUp to={850} suffix="+" /></p>
          <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.16em] text-accent">LeetCode problems</p>
          <p className="mx-auto mt-5 max-w-sm text-[15px] text-muted">Data Structures + Algorithms, practiced consistently in C++.</p>
          <ul className="mx-auto mt-6 flex max-w-lg flex-wrap justify-center gap-2">
            {PROBLEM_TAGS.map((t) => <li key={t} className="rounded-full border border-line/12 px-3 py-1 font-mono text-[11.5px] text-fg/80">{t}</li>)}
          </ul>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <LinkBtn href={LEETCODE} external ghost>View LeetCode</LinkBtn>
            <LinkBtn href={GITHUB} external ghost>View GitHub</LinkBtn>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* ------------------------- 07 · Academic highlights ------------------------- */
function BuiltAlong() {
  return (
    <Section id="built-along" label="06 / What I’ve built along the way" title="What I’ve built" accent="along the way">
      <Reveal>
        <ol className="grid gap-px overflow-hidden rounded-2xl border border-line/12 bg-line/12 sm:grid-cols-3 lg:grid-cols-6">
          {BUILT_ALONG.map((s, i) => (
            <li key={s} className="flex flex-col items-center gap-2 bg-surface p-5 text-center">
              <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, '0')}</span>
              <p className="text-[13.5px] font-medium leading-snug tracking-tight">{s}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}

/* ------------------------------ 08 · Current status ----------------------------- */
function CurrentStatus() {
  return (
    <Section id="status" label="07 / Current status" title="Where I am" accent="now">
      <Reveal>
        <div className="rounded-2xl border border-accent/25 bg-gradient-to-b from-accent/[0.06] to-transparent p-8 sm:p-10">
          <p className="text-xl font-semibold tracking-tight">Computer Science & Engineering</p>
          <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.16em] text-accent">{EDUCATION.years}</p>
          <p className="mt-5 text-[14.5px] font-medium text-muted">Currently focused on:</p>
          <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {CURRENT_FOCUS.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-[14.5px]"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{f}</li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}

export default function Background() {
  return (
    <>
      <BackgroundHero />
      <Education />
      <PracticalExperience />
      <Certifications />
      <Achievements />
      <ProblemSolving />
      <BuiltAlong />
      <CurrentStatus />
      <PageCTA
        eyebrow="Looking for an AI/ML engineer in the making?"
        title="I’m looking for opportunities to contribute to"
        accent="AI/ML, Agentic AI and software engineering."
      >
        <LinkBtn href="#/projects">View My Projects</LinkBtn>
        <a href={PROFILE.resumeUrl} download className="inline-flex items-center gap-2 rounded-full border border-line/20 px-6 py-3 text-[15px] font-medium transition hover:border-accent/60 hover:text-accent">Download Resume</a>
        <LinkBtn href="#/contact" ghost>Get In Touch</LinkBtn>
      </PageCTA>
    </>
  );
}
