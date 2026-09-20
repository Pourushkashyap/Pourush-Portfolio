import { useEffect, useRef, useState } from 'react';
import { SNAPSHOT } from '../data/content';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

function CountUp({ to, suffix = '' }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let raf = 0;
    const run = () => {
      const start = performance.now();
      const dur = 1400;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        setVal(Math.round(to * (1 - Math.pow(1 - t, 3))));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { run(); io.disconnect(); }
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

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
