import { NAV_LINKS, PROFILE, SOCIALS } from '../data/content';

export default function Footer() {
  return (
    <footer className="border-t border-line/10">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="text-xl font-semibold tracking-tight">{PROFILE.name}</p>
            <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.14em] text-accent">{PROFILE.navTagline}</p>
            <p className="mt-4 max-w-sm text-[14.5px] leading-relaxed text-muted">
              Building intelligent systems at the intersection of AI, software engineering and automation.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-[14px]">
            <ul className="space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.to}><a href={`#${l.to}`} className="text-muted transition hover:text-accent">{l.label}</a></li>
              ))}
            </ul>
            <ul className="space-y-2.5">
              {SOCIALS.map((s) => (
                <li key={s.id}><a href={s.href} target="_blank" rel="noreferrer" className="text-muted transition hover:text-accent">{s.label}</a></li>
              ))}
              <li><a href="/Pourush resume.pdf" download className="text-muted transition hover:text-accent">Resume</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-line/10 pt-6 text-[12.5px] text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} {PROFILE.name}</p>
          <p className="font-mono">Built with React · Tailwind · AI</p>
          <p className="font-serif italic">Built with curiosity. Powered by AI.</p>
        </div>
      </div>
    </footer>
  );
}
