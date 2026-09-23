import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { clamp } from './scene3d';

/**
 * Scroll progress of a section.
 * - Sticky sections (taller than the viewport): 0 → 1 while the section is pinned.
 * - Normal sections: 0 → 1 while the section crosses the viewport.
 * When `steps` > 0, progressRef is remapped so that step i's centre = i / (steps - 1),
 * which lines up with a chain of `steps` nodes. `index` is the active step.
 */
export function useScrollProgress(steps = 0) {
  const sectionRef = useRef(null);
  const progressRef = useRef(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height - vh;
      const raw = total > 0 ? clamp(-r.top / total, 0, 1) : clamp((vh - r.top) / (vh + r.height), 0, 1);
      if (steps > 1) {
        progressRef.current = clamp((raw * steps - 0.5) / (steps - 1), 0, 1);
        const idx = Math.min(steps - 1, Math.floor(raw * steps));
        setIndex((prev) => (prev === idx ? prev : idx));
      } else {
        progressRef.current = raw;
      }
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [steps]);

  return { sectionRef, progressRef, index };
}

/** FLIP: children with data-flip="key" glide to their new position whenever `deps` change. */
export function useFlip(containerRef, deps) {
  const prev = useRef(new Map());
  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const next = new Map();
    root.querySelectorAll('[data-flip]').forEach((n) => {
      const key = n.dataset.flip;
      const pos = { x: n.offsetLeft, y: n.offsetTop };
      next.set(key, pos);
      const old = prev.current.get(key);
      if (old) {
        const dx = old.x - pos.x, dy = old.y - pos.y;
        if (dx || dy) {
          n.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], {
            duration: 500, easing: 'cubic-bezier(.2,.7,.2,1)',
          });
        }
      } else if (prev.current.size) {
        n.animate([{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'ease-out' });
      }
    });
    prev.current = next;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}
