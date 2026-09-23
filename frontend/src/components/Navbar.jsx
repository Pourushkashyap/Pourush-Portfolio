import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { NAV_LINKS, PROFILE } from '../data/content';
import { DownloadIcon, MenuIcon, CloseIcon, MoonIcon, SparkIcon, SunIcon } from './Icons';

export default function Navbar({ route, theme, onToggleTheme, onOpenChat }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [pill, setPill] = useState({ x: 0, w: 0 });
  const linkRefs = useRef({});
  const progressRef = useRef(null);

  // Sliding highlight follows hover, otherwise rests on the active route.
  const target = hovered ?? route;
  useLayoutEffect(() => {
    const measure = () => {
      const el = linkRefs.current[target];
      if (el) setPill({ x: el.offsetLeft, w: el.offsetWidth });
      else setPill((p) => ({ ...p, w: 0 }));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [target]);

  // Scroll state + reading-progress bar.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [route]);

  const onLogoClick = (e) => {
    if (route === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const step = (i) => ({ animationDelay: `${0.85 + i * 0.09}s` });

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <div
        ref={progressRef}
        className="fixed left-0 top-0 h-[2px] w-full origin-left bg-accent"
        style={{ transform: 'scaleX(0)' }}
        aria-hidden
      />

      <div
        className={`nav-shell relative mx-auto max-w-7xl rounded-2xl backdrop-blur-xl transition-[background-color,box-shadow] duration-500 ${
          menuOpen ? 'bg-bg/95 shadow-xl' : scrolled ? 'bg-bg/80 shadow-[0_10px_40px_-12px_rgb(0_0_0/0.45)]' : 'bg-bg/35'
        }`}
      >
        {/* The navbar "draws" its own outline on load */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          <rect
            className="nav-outline"
            x="0.5"
            y="0.5"
            rx="16"
            pathLength="1"
            style={{ width: 'calc(100% - 1px)', height: 'calc(100% - 1px)' }}
          />
        </svg>

        <div className="relative flex h-14 items-center justify-between gap-3 px-3 sm:px-4">
          {/* ---------- Left: brand ---------- */}
          <a href="#/" onClick={onLogoClick} className="nav-in flex items-center gap-3" style={step(0)} aria-label="Pourush Kashyap — home">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent font-mono text-[13px] font-semibold tracking-tight text-accent-ink">
              {PROFILE.initials}
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-[14px] font-semibold tracking-tight">{PROFILE.name}</span>
              <span className="hidden text-[11px] text-muted xl:block">{PROFILE.navTagline}</span>
            </span>
          </a>

          {/* ---------- Center: navigation ---------- */}
          <nav
            aria-label="Primary"
            className="relative hidden items-center rounded-full border border-line/10 bg-surface/50 p-1 xl:flex"
            onMouseLeave={() => setHovered(null)}
          >
            <span
              aria-hidden
              className="nav-pill absolute bottom-1 top-1 rounded-full bg-fg/[0.09]"
              style={{ transform: `translateX(${pill.x}px)`, width: pill.w, opacity: pill.w ? 1 : 0 }}
            />
            {NAV_LINKS.map((l, i) => {
              const active = route === l.to;
              return (
                <a
                  key={l.to}
                  ref={(el) => (linkRefs.current[l.to] = el)}
                  href={`#${l.to}`}
                  onMouseEnter={() => setHovered(l.to)}
                  onFocus={() => setHovered(l.to)}
                  onBlur={() => setHovered(null)}
                  aria-current={active ? 'page' : undefined}
                  className={`nav-in relative z-10 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                    active ? 'text-fg' : 'text-muted hover:text-fg'
                  }`}
                  style={step(i + 1)}
                >
                  {l.label}
                  {active && (
                    <span className="absolute bottom-[3px] left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-accent" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* ---------- Right: actions ---------- */}
          <div className="flex items-center gap-2">
            <a
              href={PROFILE.resumeUrl}
              download
              className="nav-in hidden items-center gap-1.5 rounded-full border border-line/15 px-3.5 py-2 text-[13px] font-medium transition hover:border-accent/60 hover:text-accent md:inline-flex"
              style={step(7)}
            >
              Resume <DownloadIcon width={14} height={14} />
            </a>

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              className="nav-in grid h-9 w-9 place-items-center rounded-full border border-line/15 text-muted transition hover:border-accent/60 hover:text-accent"
              style={step(8)}
            >
              {theme === 'dark' ? <SunIcon width={16} height={16} /> : <MoonIcon width={16} height={16} />}
            </button>

            <button
              type="button"
              onClick={onOpenChat}
              className="nav-in shine inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-2 text-[13px] font-semibold text-accent-ink transition hover:brightness-110"
              style={step(9)}
            >
              <span className="hidden sm:inline">AI Assistant</span>
              <span className="sm:hidden">AI</span>
              <SparkIcon width={13} height={13} />
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
              className="grid h-9 w-9 place-items-center rounded-full border border-line/15 xl:hidden"
            >
              {menuOpen ? <CloseIcon width={16} height={16} /> : <MenuIcon width={16} height={16} />}
            </button>
          </div>
        </div>

        {/* ---------- Mobile menu ---------- */}
        <div
          className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 xl:hidden ${
            menuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="min-h-0">
            <nav aria-label="Mobile" className="flex flex-col gap-1 border-t border-line/10 p-3">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.to}
                  href={`#${l.to}`}
                  className={`rounded-xl px-3 py-2.5 text-[15px] font-medium ${
                    route === l.to ? 'bg-fg/[0.08] text-fg' : 'text-muted'
                  }`}
                >
                  {l.label}
                </a>
              ))}
              <a href={PROFILE.resumeUrl} download className="mt-1 inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-[15px] font-medium text-accent">
                Resume <DownloadIcon width={15} height={15} />
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
