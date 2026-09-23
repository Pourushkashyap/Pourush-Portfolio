import { useEffect, useRef } from 'react';
import { readColors, rgba } from '../lib/scene3d';

// Subtle drifting particle / network field for backgrounds (CTA sections, hero washes).
export default function ParticleField({ count = 46, link = 120, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, raf = 0, visible = true;
    let colors = readColors();
    const pts = Array.from({ length: count }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.02, vy: (Math.random() - 0.5) * 0.02, r: Math.random() * 1.4 + 0.6 }));
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    let last = performance.now();
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) { last = now; return; }
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p) => {
        if (!reduced) { p.x += p.vx * dt * 6; p.y += p.vy * dt * 6; }
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
      });
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const d = Math.hypot((a.x - b.x) * W, (a.y - b.y) * H);
          if (d < link) {
            ctx.strokeStyle = rgba(colors.accent, (1 - d / link) * 0.25);
            ctx.beginPath(); ctx.moveTo(a.x * W, a.y * H); ctx.lineTo(b.x * W, b.y * H); ctx.stroke();
          }
        }
        ctx.fillStyle = rgba(colors.fg, 0.35);
        ctx.beginPath(); ctx.arc(a.x * W, a.y * H, a.r, 0, Math.PI * 2); ctx.fill();
      }
    };
    const ro = new ResizeObserver(resize); ro.observe(canvas); resize();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(canvas);
    const mo = new MutationObserver(() => { colors = readColors(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); mo.disconnect(); };
  }, [count, link]);
  return <canvas ref={ref} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden />;
}
