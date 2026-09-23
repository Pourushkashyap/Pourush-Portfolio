import { SNAPSHOT } from '../data/content';
import Reveal from './Reveal';
import CountUp from './CountUp';
import SectionHeading from './SectionHeading';

export default function EngineeringSnapshot() {
  return (
    <section id="snapshot" className="mx-auto max-w-6xl px-5 py-24">
      <SectionHeading eyebrow="Engineering snapshot" title="The short version." />
      <Reveal>
        <dl className="grid gap-px overflow-hidden rounded-2xl border border-line/12 bg-line/12 sm:grid-cols-2 lg:grid-cols-4">
          {SNAPSHOT.map((s) => (
            <div key={s.label} className="bg-surface p-7">
              <dd className="text-3xl font-semibold tracking-tight sm:text-[2rem]">
                {s.value ? <CountUp to={s.value} suffix={s.suffix} /> : s.text}
              </dd>
              <dt className="mt-3 font-mono text-[12px] uppercase tracking-[0.14em] text-accent">{s.label}</dt>
              <p className="mt-1.5 text-[13.5px] text-muted">{s.sub}</p>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
