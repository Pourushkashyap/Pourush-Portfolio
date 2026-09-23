import { useEffect, useRef, useState } from 'react';

export default function CountUp({ to, suffix = '' }) {
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
