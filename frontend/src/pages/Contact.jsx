import { useState } from 'react';
import { ASSISTANT_PROMPTS_CONTACT, PROFILE, SOCIALS } from '../data/content';
import Reveal from '../components/Reveal';
import PageCTA from '../components/PageCTA';
import { LinkBtn, PageHero } from '../components/ui';
import { ArrowUpRightIcon, DownloadIcon, MailIcon, PhoneIcon, PinIcon, SendIcon, SparkIcon } from '../components/Icons';
import { SOCIAL_ICONS } from '../components/Icons';

/* ------------------------------- 01 · Hero ------------------------------- */
function ContactHero() {
  return (
    <PageHero
      label="CONTACT / 06"
      title="Let’s Build Something"
      accent="Intelligent."
      subtitle="Whether you're looking for an AI/ML intern, want to discuss an AI project, or simply want to connect, feel free to reach out."
    >
      <div className="hero-in mt-7 inline-flex items-center gap-2.5 rounded-full border border-line/15 bg-surface/60 px-3.5 py-1.5" style={{ '--d': '460ms' }}>
        <span className="pulse-dot h-2 w-2 rounded-full bg-emerald-500" />
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-muted">Open to opportunities</span>
      </div>
      <p className="hero-in mt-3 font-mono text-[12px] text-fg/75" style={{ '--d': '540ms' }}>
        AI/ML Internships · AI Engineering · GenAI · Agentic AI · Full-Stack AI
      </p>
    </PageHero>
  );
}

/* ------------------------------ 02 · Connect + form ------------------------------ */
function ConnectInfo() {
  return (
    <Reveal>
      <div className="h-full rounded-2xl border border-line/10 bg-surface/60 p-7 sm:p-9">
        <h2 className="text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl">
          Have an idea? <span className="font-serif font-normal italic text-accent">Let’s talk.</span>
        </h2>

        <div className="mt-8 space-y-5">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line/12 text-accent"><MailIcon width={19} height={19} /></span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Email</p>
              <p className="mt-0.5 truncate text-[15px] font-medium">{PROFILE.email}</p>
              <a href={`mailto:${PROFILE.email}`} className="mt-1.5 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-accent">Send an Email <ArrowUpRightIcon width={13} height={13} /></a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line/12 text-accent"><PhoneIcon width={18} height={18} /></span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Phone</p>
              <p className="mt-0.5 text-[15px] font-medium">{PROFILE.phone}</p>
              <a href={PROFILE.phoneHref} className="mt-1.5 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-accent">Call Me <ArrowUpRightIcon width={13} height={13} /></a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line/12 text-accent"><PinIcon width={18} height={18} /></span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Location</p>
              <p className="mt-0.5 text-[15px] font-medium">India</p>
            </div>
          </div>
        </div>

        <h3 className="mb-3 mt-9 border-t border-line/10 pt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Find me online</h3>
        <ul className="space-y-2.5">
          {SOCIALS.map((s) => {
            const Icon = SOCIAL_ICONS[s.id];
            return (
              <li key={s.id}>
                <a href={s.href} target="_blank" rel="noreferrer" className="group flex items-center justify-between rounded-xl border border-line/10 bg-bg/40 px-4 py-3 transition hover:border-accent/40">
                  <span className="flex items-center gap-3"><Icon width={16} height={16} className="text-muted transition group-hover:text-accent" /><span className="text-[14px] font-medium">{s.label}</span></span>
                  <span className="text-[12.5px] text-muted">{s.display}</span>
                </a>
              </li>
            );
          })}
          <li>
            <a href={PROFILE.resumeUrl} download className="group flex items-center justify-between rounded-xl border border-line/10 bg-bg/40 px-4 py-3 transition hover:border-accent/40">
              <span className="flex items-center gap-3"><DownloadIcon width={16} height={16} className="text-muted transition group-hover:text-accent" /><span className="text-[14px] font-medium">Resume</span></span>
              <span className="text-[12.5px] text-muted">View / Download</span>
            </a>
          </li>
        </ul>
      </div>
    </Reveal>
  );
}

function MessageForm() {
  const [sent, setSent] = useState(false);
  const [values, setValues] = useState({ name: '', email: '', company: '', message: '' });
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    // Demo only — wire this up to your backend or an email service (e.g. Formspree, Resend).
    setSent(true);
  };

  return (
    <Reveal delay={120}>
      <div className="h-full rounded-2xl border border-line/10 bg-surface/60 p-7 sm:p-9">
        <h2 className="text-xl font-semibold tracking-tight">Send a Message</h2>
        {sent ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-accent/25 bg-accent/[0.06] px-6 py-14 text-center">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-accent-ink"><SendIcon width={18} height={18} /></span>
            <p className="mt-4 text-[15px] font-medium">Thanks — message received.</p>
            <p className="mt-1 text-[13.5px] text-muted">This is a demo form; connect it to your inbox to go live.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Name</span>
                <input required value={values.name} onChange={set('name')} type="text" placeholder="Your name" className="w-full rounded-xl border border-line/15 bg-bg px-4 py-2.5 text-[14.5px] outline-none placeholder:text-muted/60 focus:border-accent/60" />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Email</span>
                <input required value={values.email} onChange={set('email')} type="email" placeholder="you@company.com" className="w-full rounded-xl border border-line/15 bg-bg px-4 py-2.5 text-[14.5px] outline-none placeholder:text-muted/60 focus:border-accent/60" />
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Company / Organization</span>
              <input value={values.company} onChange={set('company')} type="text" placeholder="Optional" className="w-full rounded-xl border border-line/15 bg-bg px-4 py-2.5 text-[14.5px] outline-none placeholder:text-muted/60 focus:border-accent/60" />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Message</span>
              <textarea required value={values.message} onChange={set('message')} rows={5} placeholder="What would you like to build or discuss?" className="w-full resize-none rounded-xl border border-line/15 bg-bg px-4 py-2.5 text-[14.5px] outline-none placeholder:text-muted/60 focus:border-accent/60" />
            </label>
            <button type="submit" className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-accent-ink transition hover:brightness-110">
              Send Message <SendIcon width={15} height={15} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>
        )}
      </div>
    </Reveal>
  );
}

function ConnectSection() {
  return (
    <section id="connect" className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
      <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
        <ConnectInfo />
        <MessageForm />
      </div>
    </section>
  );
}

/* ------------------------- 03 · AI assistant + comms node ------------------------- */
function CommsNode() {
  return (
    <svg viewBox="0 0 320 200" className="mx-auto h-40 w-full max-w-md" aria-hidden>
      <text x="160" y="16" textAnchor="middle" className="font-mono" style={{ fill: 'rgb(var(--muted))', fontSize: 9, letterSpacing: '0.14em' }}>RECRUITER</text>
      <line x1="160" y1="24" x2="160" y2="60" style={{ stroke: 'rgb(var(--line) / .3)' }} strokeWidth="1.5" />
      <rect x="110" y="62" width="100" height="34" rx="17" fill="none" style={{ stroke: 'rgb(var(--accent))' }} strokeWidth="1.5" />
      <text x="160" y="83" textAnchor="middle" className="font-mono" style={{ fill: 'rgb(var(--accent))', fontSize: 10, fontWeight: 600 }}>AI ASSISTANT</text>

      {[
        { x: 56, label: 'EMAIL' },
        { x: 160, label: 'CHAT' },
        { x: 264, label: 'LINKEDIN' },
      ].map((n) => (
        <g key={n.label}>
          <path d={`M160 96 L${n.x} 150`} fill="none" style={{ stroke: 'rgb(var(--line) / .28)' }} strokeWidth="1.5" />
          <circle r="2.6" style={{ fill: 'rgb(var(--accent))' }}>
            <animateMotion dur="2.6s" repeatCount="indefinite" path={`M160 96 L${n.x} 150`} />
          </circle>
          <circle cx={n.x} cy="156" r="16" style={{ fill: 'rgb(var(--bg))', stroke: 'rgb(var(--fg) / .55)' }} strokeWidth="1.4" />
          <text x={n.x} y="182" textAnchor="middle" className="font-mono" style={{ fill: 'rgb(var(--muted))', fontSize: 8.5, letterSpacing: '0.1em' }}>{n.label}</text>
        </g>
      ))}
    </svg>
  );
}

function ContactAssistant({ onOpenChat }) {
  return (
    <section id="assistant" className="mx-auto max-w-6xl px-5 pb-20 sm:pb-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-line/12 bg-surface/60 px-6 py-14 sm:px-12 sm:py-16">
          <div className="hero-glow pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/3" aria-hidden />
          <div className="relative mx-auto max-w-2xl text-center">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-ink"><SparkIcon width={18} height={18} /></span>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Ask My <span className="font-serif font-normal italic text-accent">AI Assistant</span></h2>
            <p className="mt-3 text-[15.5px] leading-relaxed text-muted">
              Curious about my projects, technical skills, education, experience, or the technologies I work with? My AI assistant can answer your questions.
            </p>

            <CommsNode />

            <div className="grid gap-2.5 sm:grid-cols-2">
              {ASSISTANT_PROMPTS_CONTACT.map((q) => (
                <button
                  key={q} type="button" onClick={() => onOpenChat(q)}
                  className="rounded-xl border border-line/12 bg-bg/50 px-4 py-3 text-left text-[13.5px] leading-snug text-fg/90 transition hover:border-accent/50 hover:text-accent"
                >
                  “{q}”
                </button>
              ))}
            </div>

            <button
              type="button" onClick={() => onOpenChat()}
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[15px] font-semibold text-accent-ink transition hover:brightness-110"
            >
              Ask My AI Assistant <SparkIcon width={14} height={14} />
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function Contact({ onOpenChat }) {
  return (
    <>
      <ContactHero />
      <ConnectSection />
      <ContactAssistant onOpenChat={onOpenChat} />
      <PageCTA
        eyebrow="Recruiters"
        title="Looking for an AI/ML"
        accent="Engineer in the making?"
        text="I'm currently focused on building intelligent systems with Machine Learning, Generative AI, RAG, and Agentic AI."
      >
        <a href={PROFILE.resumeUrl} download className="inline-flex items-center gap-2 rounded-full border border-line/20 px-6 py-3 text-[15px] font-medium transition hover:border-accent/60 hover:text-accent">View Resume</a>
        <LinkBtn href="#/projects" ghost>View Projects</LinkBtn>
        <LinkBtn href={`mailto:${PROFILE.email}`}>Get in Touch</LinkBtn>
      </PageCTA>
    </>
  );
}
