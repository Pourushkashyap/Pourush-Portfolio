import { PROFILE, SOCIALS } from '../data/content';

export default function Footer() {
  return (
    <footer className="border-t border-line/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-[13px] text-muted sm:flex-row">
        <p>
          © {new Date().getFullYear()} {PROFILE.name}. All rights reserved.
        </p>
        <ul className="flex items-center gap-5">
          {SOCIALS.map((s) => (
            <li key={s.id}>
              <a href={s.href} target="_blank" rel="noreferrer" className="transition hover:text-accent">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
