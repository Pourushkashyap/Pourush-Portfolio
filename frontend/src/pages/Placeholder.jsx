import { NAV_LINKS } from '../data/content';

// Stand-in for the pages you'll build next (About, Projects, Skills, Journey, Education).
export default function Placeholder({ route }) {
  const title = NAV_LINKS.find((l) => l.to === route)?.label ?? 'Page';
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-6xl flex-col justify-center px-5 pt-28">
      <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-accent">Coming next</p>
      <h1 className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl">{title}</h1>
      <p className="mt-4 max-w-md text-muted">This page is the next step in the build. The navbar is already wired to it.</p>
      <a href="#/" className="mt-8 w-fit rounded-full border border-line/20 px-6 py-3 text-[15px] font-medium transition hover:border-accent/60 hover:text-accent">
        ← Back home
      </a>
    </section>
  );
}
