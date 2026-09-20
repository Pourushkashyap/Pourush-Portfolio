import { useCallback, useEffect, useRef, useState } from 'react';
import { CORE_NODE, ORBIT_NODES } from '../data/content';

/* -----------------------------------------------------------------------------
   Agent network — a dependency-free 3D scene drawn on <canvas>.

   • Faceted "glass" core (the agent) with six orbiting nodes
   • Data particles hop from node to node along the graph edges
   • Slow auto-rotation, mouse parallax, hover-to-inspect labels
   • Reads its colours from the CSS variables, so it follows the theme toggle

   It is plain 3D maths (rotate -> perspective project -> painter's algorithm),
   so there is no three.js bundle to ship. If you later want react-three-fiber,
   this component is the only thing to swap out.
----------------------------------------------------------------------------- */

const LABELS = [CORE_NODE, ...ORBIT_NODES]; // index 0 = core, 1..n = orbit nodes
const CAM = 4.0; // camera distance in world units
const ORBIT_R = 1.2; // radius of the node orbit
const LIGHT = normalize([-0.45, 0.6, 0.66]);

function normalize(v) {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}

function rotate(p, yaw, pitch) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const x = p[0] * cy + p[2] * sy;
  const z1 = -p[0] * sy + p[2] * cy;
  const cx = Math.cos(pitch), sx = Math.sin(pitch);
  return [x, p[1] * cx - z1 * sx, p[1] * sx + z1 * cx];
}

function icosphere(detail) {
  const t = (1 + Math.sqrt(5)) / 2;
  const verts = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ].map(normalize);
  let faces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];
  for (let d = 0; d < detail; d++) {
    const cache = new Map();
    const next = [];
    const mid = (a, b) => {
      const key = a < b ? `${a}_${b}` : `${b}_${a}`;
      if (cache.has(key)) return cache.get(key);
      verts.push(normalize([
        (verts[a][0] + verts[b][0]) / 2,
        (verts[a][1] + verts[b][1]) / 2,
        (verts[a][2] + verts[b][2]) / 2,
      ]));
      cache.set(key, verts.length - 1);
      return verts.length - 1;
    };
    faces.forEach(([a, b, c]) => {
      const ab = mid(a, b), bc = mid(b, c), ca = mid(c, a);
      next.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
    });
    faces = next;
  }
  return { verts, faces };
}

function readColors() {
  const s = getComputedStyle(document.documentElement);
  const get = (name) => s.getPropertyValue(name).trim().split(/\s+/).map(Number);
  return { accent: get('--accent'), fg: get('--fg'), bg: get('--bg') };
}
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

function makeGlow(c) {
  const size = 128;
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const g = cv.getContext('2d');
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, rgba(c, 1));
  grad.addColorStop(0.35, rgba(c, 0.32));
  grad.addColorStop(1, rgba(c, 0));
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return cv;
}

export default function HeroScene() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const labelRefs = useRef([]);
  const activeRef = useRef(null);
  const [active, setActive] = useState(null);

  const hover = useCallback((i) => {
    if (activeRef.current === i) return;
    activeRef.current = i;
    setActive(i);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const n = ORBIT_NODES.length;

    // Static geometry ------------------------------------------------------
    const core = icosphere(1);
    const small = icosphere(0);
    const base = ORBIT_NODES.map((_, i) => {
      const y = n > 1 ? (i / (n - 1)) * 1.4 - 0.7 : 0;
      const r = Math.sqrt(1 - y * y);
      const th = i * 2.4 + 0.6;
      return [Math.cos(th) * r * ORBIT_R, y * ORBIT_R, Math.sin(th) * r * ORBIT_R];
    });
    const edges = [];
    for (let i = 1; i <= n; i++) edges.push([0, i]); // spokes to the core
    for (let i = 1; i <= n; i++) edges.push([i, (i % n) + 1]); // ring between neighbours
    const incident = Array.from({ length: n + 1 }, () => []);
    edges.forEach((e, idx) => { incident[e[0]].push(idx); incident[e[1]].push(idx); });

    const particles = Array.from({ length: 34 }, () => {
      const e = Math.floor(Math.random() * edges.length);
      return { e, from: edges[e][Math.random() < 0.5 ? 0 : 1], t: Math.random(), v: 0.16 + Math.random() * 0.24 };
    });

    // State ----------------------------------------------------------------
    let W = 0, H = 0, S = 1, cx = 0, cy = 0;
    let colors = readColors();
    let glowAccent = makeGlow(colors.accent);
    let glowFg = makeGlow(colors.fg);
    let yaw = 0.4, time = 0, speed = 1;
    const pitch = 0.32;
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const grow = new Array(n + 1).fill(0);
    let proj = [];
    let visible = true;
    let raf = 0;
    let last = performance.now();

    const project = (p) => {
      const k = CAM / (CAM - p[2]);
      return { x: cx + p[0] * S * k, y: cy - p[1] * S * k, k, z: p[2] };
    };

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2; cy = H / 2;
      S = Math.min(W, H) * 0.27;
    };

    // Drawing helpers ------------------------------------------------------
    const drawMesh = (mesh, radius, center, spinY, spinX, fill, stroke, bright) => {
      const pv = mesh.verts.map((v) => {
        const q = rotate([v[0] * radius, v[1] * radius, v[2] * radius], spinY, spinX);
        return [q[0] + center[0], q[1] + center[1], q[2] + center[2]];
      });
      const list = mesh.faces.map((f) => {
        const A = pv[f[0]], B = pv[f[1]], C = pv[f[2]];
        const nx = (A[0] + B[0] + C[0]) / 3 - center[0];
        const ny = (A[1] + B[1] + C[1]) / 3 - center[1];
        const nz = (A[2] + B[2] + C[2]) / 3 - center[2];
        const l = Math.hypot(nx, ny, nz) || 1;
        const lam = Math.max(0, (nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]) / l);
        return { f, z: (A[2] + B[2] + C[2]) / 3, lam, front: nz / l > -0.05 };
      }).sort((a, b) => a.z - b.z);

      list.forEach((it) => {
        const a = project(pv[it.f[0]]), b = project(pv[it.f[1]]), c = project(pv[it.f[2]]);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.closePath();
        ctx.fillStyle = rgba(fill, (it.front ? 0.1 + 0.36 * it.lam : 0.04) * bright);
        ctx.fill();
        ctx.strokeStyle = rgba(stroke, it.front ? 0.5 : 0.14);
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    };

    const glow = (sprite, p, radius, alpha) => {
      ctx.globalAlpha = alpha;
      ctx.drawImage(sprite, p.x - radius, p.y - radius, radius * 2, radius * 2);
      ctx.globalAlpha = 1;
    };

    // Main frame -----------------------------------------------------------
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden || !W) { last = now; return; }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const hov = activeRef.current;

      speed += ((hov == null ? 1 : 0.1) - speed) * Math.min(1, dt * 4);
      if (!reduced) { time += dt; yaw += dt * 0.28 * speed; }
      mx += (tmx - mx) * Math.min(1, dt * 3);
      my += (tmy - my) * Math.min(1, dt * 3);
      for (let i = 0; i <= n; i++) grow[i] += ((hov === i ? 1 : 0) - grow[i]) * Math.min(1, dt * 8);

      const ry = yaw + mx * 0.55;
      const rx = pitch + my * 0.28;
      const floatY = Math.sin(time * 0.8) * 0.04;

      const P = [[0, floatY, 0], ...base.map((b) => {
        const q = rotate(b, ry, rx);
        return [q[0], q[1] + floatY, q[2]];
      })];
      proj = P.map(project);

      // particles
      if (!reduced) {
        particles.forEach((pt) => {
          pt.t += dt * pt.v;
          if (pt.t >= 1) {
            const e = edges[pt.e];
            const at = e[0] === pt.from ? e[1] : e[0];
            const opts = incident[at].filter((x) => x !== pt.e);
            pt.e = opts[Math.floor(Math.random() * opts.length)];
            pt.from = at;
            pt.t = 0;
          }
        });
      }

      ctx.clearRect(0, 0, W, H);
      const items = [];

      // orbit rings (back halves first, front halves last)
      [[0.0, 0.0], [1.15, 0.5]].forEach(([tiltX, tiltZ]) => {
        const back = new Path2D();
        const front = new Path2D();
        let pb = null;
        for (let s = 0; s <= 72; s++) {
          const a = (s / 72) * Math.PI * 2;
          let p = rotate([Math.cos(a) * ORBIT_R, 0, Math.sin(a) * ORBIT_R], tiltZ, tiltX);
          p = rotate(p, ry, rx);
          p[1] += floatY;
          const q = project(p);
          const path = p[2] < 0 ? back : front;
          if (pb && (pb.z < 0) === (p[2] < 0)) path.lineTo(q.x, q.y); else path.moveTo(q.x, q.y);
          pb = { z: p[2] };
        }
        items.push({ z: -5, fn: () => { ctx.strokeStyle = rgba(colors.fg, 0.07); ctx.lineWidth = 1; ctx.stroke(back); } });
        items.push({ z: 5, fn: () => { ctx.strokeStyle = rgba(colors.fg, 0.14); ctx.lineWidth = 1; ctx.stroke(front); } });
      });

      // edges
      edges.forEach(([a, b]) => {
        const pa = proj[a], pbb = proj[b];
        const z = (pa.z + pbb.z) / 2;
        const hot = hov != null && (a === hov || b === hov);
        items.push({ z: z - 0.01, fn: () => {
          const depth = Math.min(1, Math.max(0, (z + 1.1) / 2.2));
          ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pbb.x, pbb.y);
          ctx.strokeStyle = hot ? rgba(colors.accent, 0.85) : rgba(colors.fg, 0.1 + 0.24 * depth);
          ctx.lineWidth = hot ? 1.6 : 1;
          ctx.stroke();
        } });
      });

      // core
      const coreR = 0.5 * (1 + 0.03 * Math.sin(time * 1.5) + grow[0] * 0.12);
      items.push({ z: proj[0].z, fn: () => {
        glow(glowAccent, proj[0], coreR * S * proj[0].k * 3.4, 0.55 + grow[0] * 0.3);
        drawMesh(core, coreR, P[0], time * 0.25, 0.35 + Math.sin(time * 0.3) * 0.1, colors.accent, colors.accent, 1.15);
      } });

      // orbit nodes
      for (let i = 1; i <= n; i++) {
        const rad = 0.13 * (1 + grow[i] * 0.35);
        items.push({ z: proj[i].z, fn: () => {
          const fill = grow[i] > 0.5 ? colors.accent : colors.fg;
          glow(grow[i] > 0.5 ? glowAccent : glowFg, proj[i], rad * S * proj[i].k * 3.6, 0.22 + grow[i] * 0.5);
          drawMesh(small, rad, P[i], time * 0.6 + i, time * 0.35 + i * 0.7, fill, colors.fg, 1.1);
        } });
      }

      // particles
      particles.forEach((pt) => {
        const e = edges[pt.e];
        const to = e[0] === pt.from ? e[1] : e[0];
        const A = P[pt.from], B = P[to];
        const p = [A[0] + (B[0] - A[0]) * pt.t, A[1] + (B[1] - A[1]) * pt.t, A[2] + (B[2] - A[2]) * pt.t];
        const q = project(p);
        items.push({ z: p[2] + 0.02, fn: () => {
          glow(glowAccent, q, 9 * q.k, 0.9);
          ctx.beginPath(); ctx.arc(q.x, q.y, 1.9 * q.k, 0, Math.PI * 2);
          ctx.fillStyle = rgba(colors.accent, 1); ctx.fill();
        } });
      });

      items.sort((a, b) => a.z - b.z).forEach((it) => it.fn());

      // HTML labels follow the projected nodes
      for (let i = 0; i <= n; i++) {
        const el = labelRefs.current[i];
        if (!el) continue;
        const p = proj[i];
        const r = (i === 0 ? coreR : 0.13) * S * p.k;
        const x = Math.min(Math.max(p.x, 80), W - 80);
        const y = p.y + r + 10;
        el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) translateX(-50%)`;
        el.style.opacity = hov === i || i === 0 ? '1' : String(Math.min(1, Math.max(0.42, 0.5 + 0.5 * ((p.z + 1) / 2))));
        el.style.zIndex = hov === i ? '40' : i === 0 ? '25' : String(Math.round((p.z + 2) * 5));
      }
    };

    // Events ---------------------------------------------------------------
    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      tmx = (x / r.width) * 2 - 1;
      tmy = (y / r.height) * 2 - 1;
      if (e.target.closest && e.target.closest('[data-label]')) return;
      let best = null, bestD = 1e9;
      proj.forEach((p, i) => {
        const rad = (i === 0 ? 0.52 : 0.17) * S * p.k + 12;
        const d = Math.hypot(p.x - x, p.y - y);
        if (d < rad && d < bestD) { best = i; bestD = d; }
      });
      hover(best);
    };
    const onLeave = () => { tmx = 0; tmy = 0; hover(null); };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0 });
    io.observe(wrap);
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);

    // theme changes -> recolour
    const mo = new MutationObserver(() => {
      colors = readColors();
      glowAccent = makeGlow(colors.accent);
      glowFg = makeGlow(colors.fg);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect(); mo.disconnect();
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
    };
  }, [hover]);

  return (
    <div
      ref={wrapRef}
      className="relative h-[420px] w-full select-none sm:h-[520px] lg:h-[620px]"
      role="img"
      aria-label="Animated 3D network: an AI agent connected to LangGraph, RAG, MCP, AI Agents, LLMs and Python"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0">
        {LABELS.map((l, i) => (
          <div
            key={l.name}
            ref={(el) => (labelRefs.current[i] = el)}
            data-label
            className="pointer-events-auto absolute left-0 top-0"
            style={{ opacity: 0 }}
            onMouseEnter={() => hover(i)}
            onMouseLeave={() => hover(null)}
          >
            <button
              type="button"
              onFocus={() => hover(i)}
              onBlur={() => hover(null)}
              className={`whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[11px] backdrop-blur transition-colors ${
                i === 0
                  ? 'border-accent/50 bg-accent/15 text-accent'
                  : active === i
                    ? 'border-accent bg-bg/90 text-accent'
                    : 'border-line/15 bg-bg/65 text-fg'
              }`}
            >
              {l.name}
            </button>
            <div
              className={`absolute left-1/2 top-full z-10 mt-2 w-52 -translate-x-1/2 rounded-xl border border-line/15 bg-surface/95 p-3 text-center text-[12px] leading-snug text-muted shadow-xl backdrop-blur transition duration-200 ${
                active === i ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
              }`}
            >
              <span className="mb-1 block font-mono text-[11px] text-fg">{l.name}</span>
              {l.desc}
            </div>
          </div>
        ))}
      </div>
      <p className="pointer-events-none absolute bottom-1 right-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted/70">
        Hover a node
      </p>
    </div>
  );
}
