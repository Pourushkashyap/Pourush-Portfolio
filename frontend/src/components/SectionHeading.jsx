import Reveal from './Reveal';

export default function SectionHeading({ eyebrow, title, children }) {
  return (
    <Reveal className="mb-12 max-w-2xl">
      <p className="mb-3 font-mono text-[12px] uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.6rem] md:leading-[1.08]">{title}</h2>
      {children && <p className="mt-4 text-[16px] leading-relaxed text-muted">{children}</p>}
    </Reveal>
  );
}
