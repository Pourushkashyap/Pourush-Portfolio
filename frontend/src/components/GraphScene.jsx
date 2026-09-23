import { useCallback, useEffect, useRef, useState } from 'react';
import { clamp, icosphere, LIGHT, makeGlow, readColors, rgba, rotate } from '../lib/scene3d';

const ICO_SMALL = icosphere(0);
const ICO_LARGE = icosphere(1);

/* -----------------------------------------------------------------------------
   GraphScene — the one 3D engine behind every diagram on the site.

   nodes   [{ label, desc?, pos:[x,y,z], size?, kind?: 'node'|'core'|'gem' }]
   edges   [[from, to], …]   (directed: particles flow from → to)

   • Change `nodes` / `edges` and the graph MORPHS to the new layout.
   • progressRef (0..1) lets scroll drive a travelling particle, node "lit" states
     and — with `follow` — the camera itself.
   • Hover a node: it lights up along with its neighbours (or its whole lineage).
----------------------------------------------------------------------------- */
export default function GraphScene(props) {
  const {
    nodes, edges, className = 'h-[420px]', labels = true, hint,
    ariaLabel = 'Animated 3D diagram', onSelect,
  } = props;

  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const labelRefs = useRef([]);
  const hoverRef = useRef(null);
  const propsRef = useRef(props);
  propsRef.current = props;
  const [hover, setHoverState] = useState(null);

  const setHover = useCallback((i) => {
    if (hoverRef.current === i) return;
    hoverRef.current = i;
    setHoverState(i);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    let W = 0, H = 0, cx = 0, cy = 0, S = 60;
    let colors = readColors();
    let glowA = makeGlow(colors.accent);
    let glowF = makeGlow(colors.fg);
    const st = []; // per-node state: p (current pos), s (scale), e (energy), b (brightness)
    let particles = [];
    let info = null; // edge bookkeeping
    let lastEdges = null;
    let edgeFade = 1;
    let time = 0, speed = 1, mx = 0, my = 0, tmx = 0, tmy = 0, sp = 0;
    let proj = [];
    let visible = true, raf = 0, last = performance.now();

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
    };

    const buildInfo = (pr) => {
      const out = pr.nodes.map(() => []);
      const hasIn = new Set();
      pr.edges.forEach(([a, b], idx) => { if (out[a]) out[a].push(idx); hasIn.add(b); });
      let starts = [];
      pr.edges.forEach(([a], idx) => { if (!hasIn.has(a)) starts.push(idx); });
      if (!starts.length) starts = pr.edges.map((_, i) => i);
      return { out, starts };
    };

    const spawn = (pt, pr) => {
      if (!pr.edges.length) return;
      pt.e = info.starts[Math.floor(Math.random() * info.starts.length)];
      pt.from = pr.edges[pt.e][0];
      pt.t = Math.random() * 0.4;
      pt.v = 0.14 + Math.random() * 0.2;
    };

    const hiSetFor = (h, pr) => {
      if (h == null) return null;
      const set = new Set([h]);
      if (pr.lineage) {
        const walk = (fwd) => {
          const stack = [h];
          while (stack.length) {
            const v = stack.pop();
            pr.edges.forEach(([a, b]) => {
              const from = fwd ? a : b, to = fwd ? b : a;
              if (from === v && !set.has(to)) { set.add(to); stack.push(to); }
            });
          }
        };
        walk(true); walk(false);
      } else {
        pr.edges.forEach(([a, b]) => { if (a === h) set.add(b); if (b === h) set.add(a); });
      }
      return set;
    };

    const project = (p, cam) => {
      const d = cam - p[2];
      if (d < 0.5) return null;
      const k = cam / d;
      return { x: cx + p[0] * S * k, y: cy - p[1] * S * k, k, z: p[2] };
    };

    const drawMesh = (mesh, radius, center, spinY, spinX, fill, stroke, bright, cam) => {
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
        const a = project(pv[it.f[0]], cam), b = project(pv[it.f[1]], cam), c = project(pv[it.f[2]], cam);
        if (!a || !b || !c) return;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.closePath();
        ctx.fillStyle = rgba(fill, (it.front ? 0.1 + 0.36 * it.lam : 0.04) * bright);
        ctx.fill();
        ctx.strokeStyle = rgba(stroke, (it.front ? 0.5 : 0.14) * bright);
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    };

    const glow = (sprite, p, radius, alpha) => {
      ctx.globalAlpha = clamp(alpha, 0, 1);
      ctx.drawImage(sprite, p.x - radius, p.y - radius, radius * 2, radius * 2);
      ctx.globalAlpha = 1;
    };

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const pr = propsRef.current;
      if (!visible || document.hidden || !W || !pr.nodes.length) { last = now; return; }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { nodes, edges } = pr;
      const n = nodes.length;
      const cam = pr.cam ?? 5;
      const hov = hoverRef.current;

      if (edges !== lastEdges) { lastEdges = edges; info = buildInfo(pr); edgeFade = 0; particles.forEach((p) => spawn(p, pr)); }
      edgeFade = Math.min(1, edgeFade + dt * 1.8);
      while (particles.length < (pr.particles ?? 26)) { const p = { e: 0, from: 0, t: 0, v: 0.2 }; spawn(p, pr); particles.push(p); }
      particles.length = Math.min(particles.length, pr.particles ?? 26);

      // ---- node state -----------------------------------------------------
      for (let i = 0; i < Math.max(n, st.length); i++) {
        if (!st[i]) st[i] = { p: [...(nodes[i]?.pos ?? [0, 0, 0])], s: 0, e: 0, b: 1 };
        const s = st[i];
        if (i < n) {
          const tp = nodes[i].pos;
          const k = Math.min(1, dt * 4);
          s.p[0] += (tp[0] - s.p[0]) * k; s.p[1] += (tp[1] - s.p[1]) * k; s.p[2] += (tp[2] - s.p[2]) * k;
        }
        s.s += ((i < n ? 1 : 0) - s.s) * Math.min(1, dt * 5);
        s.e = Math.max(0, s.e - dt * 1.4);
      }

      // ---- progress / camera ---------------------------------------------
      let prog = null;
      if (pr.progressRef) prog = pr.progressRef.current;
      else if (pr.autoLoop) prog = 0.5 - 0.5 * Math.cos((time / pr.autoLoop) * Math.PI * 2);
      if (prog != null) sp += (prog - sp) * Math.min(1, dt * 5);
      const pIdx = prog != null && n > 1 ? sp * (n - 1) : null;

      speed += ((hov == null ? 1 : 0.12) - speed) * Math.min(1, dt * 4);
      if (!reduced) time += dt;
      mx += (tmx - mx) * Math.min(1, dt * 3);
      my += (tmy - my) * Math.min(1, dt * 3);

      let focus = [0, 0, 0];
      if (pr.follow && pIdx != null) {
        const i0 = Math.floor(clamp(pIdx, 0, n - 1)), i1 = Math.min(n - 1, i0 + 1), f = clamp(pIdx, 0, n - 1) - i0;
        for (let k = 0; k < 3; k++) focus[k] = st[i0].p[k] + (st[i1].p[k] - st[i0].p[k]) * f;
      }
      const yaw = (pr.yaw ?? 0.3) + (pr.spin ?? 0) * time * speed + (pr.sway ?? 0.35) * Math.sin(time * 0.3 * (0.4 + speed * 0.6)) + mx * 0.45;
      const pitch = (pr.pitch ?? 0.25) + my * 0.22;

      // ---- scale (fit to layout unless a fixed scale is given) ---------------
      let target;
      if (pr.scale) target = Math.min(W, H) * pr.scale;
      else {
        let rH = 0.5, rV = 0.5;
        nodes.forEach((nd) => { rH = Math.max(rH, Math.hypot(nd.pos[0], nd.pos[2] * 0.6)); rV = Math.max(rV, Math.abs(nd.pos[1])); });
        target = Math.min((W * (pr.fit ?? 0.4)) / rH, (H * (pr.fit ?? 0.4)) / rV);
      }
      S += (target - S) * Math.min(1, dt * 3);

      // ---- world positions ------------------------------------------------
      const P = st.map((s) => rotate([s.p[0] - focus[0], s.p[1] - focus[1], s.p[2] - focus[2]], yaw, pitch));
      proj = P.map((p) => project(p, cam));
      const hi = hiSetFor(hov, pr);

      // brightness targets
      for (let i = 0; i < n; i++) {
        let tb = 1;
        if (pIdx != null && pr.litMode === 'passed') tb = i <= pIdx + 0.35 ? 1 : 0.28;
        else if (pIdx != null && pr.litMode === 'near') tb = clamp(1 - Math.abs(i - pIdx) * 0.42, 0.22, 1);
        if (hi) tb *= hi.has(i) ? 1 : 0.22;
        st[i].b += (tb - st[i].b) * Math.min(1, dt * 6);
      }
      const fadeOf = (i) => {
        if (!pr.follow) return 1;
        const d = Math.hypot(st[i].p[0] - focus[0], st[i].p[1] - focus[1], st[i].p[2] - focus[2]);
        return clamp(1.15 - d / (pr.fadeDist ?? 7), 0.05, 1);
      };

      // ---- particles ------------------------------------------------------
      const dirPts = [];
      if (!reduced && edges.length) {
        particles.forEach((pt) => {
          pt.t += dt * pt.v * (pr.flow ?? 1);
          if (pt.t >= 1) {
            const e = edges[pt.e];
            const at = e[0] === pt.from ? e[1] : e[0];
            if (st[at]) st[at].e = 1;
            const opts = pr.directed === false ? edges.map((_, k) => k).filter((k) => k !== pt.e && (edges[k][0] === at || edges[k][1] === at)) : info.out[at] || [];
            if (opts.length) { pt.e = opts[Math.floor(Math.random() * opts.length)]; pt.from = at; pt.t = 0; pt.v = 0.14 + Math.random() * 0.2; }
            else spawn(pt, pr);
          }
        });
      }
      particles.forEach((pt) => {
        const e = edges[pt.e]; if (!e) return;
        const to = e[0] === pt.from ? e[1] : e[0];
        if (!P[pt.from] || !P[to]) return;
        dirPts.push({ A: P[pt.from], B: P[to], t: pt.t, ia: pt.from, ib: to });
      });

      ctx.clearRect(0, 0, W, H);
      const items = [];

      // edges
      edges.forEach(([a, b]) => {
        const pa = proj[a], pb = proj[b];
        if (!pa || !pb || !st[a] || !st[b]) return;
        const z = (pa.z + pb.z) / 2;
        const hot = hi && hi.has(a) && hi.has(b) && (pr.lineage || a === hov || b === hov);
        const passed = pr.litMode === 'passed' && pIdx != null && a <= pIdx + 0.3 && b <= pIdx + 0.3;
        items.push({ z: z - 0.01, fn: () => {
          const depth = clamp((z + 3) / 6, 0, 1);
          const vis = Math.min(st[a].b, st[b].b) * Math.min(fadeOf(a), fadeOf(b)) * edgeFade;
          ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y);
          ctx.strokeStyle = hot ? rgba(colors.accent, 0.85 * vis) : passed ? rgba(colors.accent, 0.6 * vis) : rgba(colors.fg, (0.12 + 0.24 * depth) * vis);
          ctx.lineWidth = hot || passed ? 1.6 : 1;
          ctx.stroke();
        } });
      });

      // nodes
      for (let i = 0; i < st.length; i++) {
        const s = st[i]; const p = proj[i]; const nd = nodes[i];
        if (!p || !nd || s.s < 0.02) continue;
        const kind = nd.kind || 'node';
        const near = pIdx != null && Math.abs(i - pIdx) < 0.6;
        const grow = 1 + (hov === i ? 0.35 : 0) + (pr.follow && near ? 0.35 : 0) + s.e * 0.25;
        const base = kind === 'core' ? 0.5 : 0.2;
        const rad = base * (nd.size ?? 1) * s.s * grow;
        const fade = fadeOf(i) * s.b;
        const accent = kind === 'gem' || kind === 'core' || hov === i || s.e > 0.35 || (pr.litMode === 'near' && near) || (pr.litMode === 'passed' && pIdx != null && i <= pIdx + 0.35 && s.b > 0.8);
        items.push({ z: p.z, fn: () => {
          glow(accent ? glowA : glowF, p, rad * S * p.k * (kind === 'core' ? 3.4 : 3.5), (0.16 + s.e * 0.5 + (hov === i ? 0.3 : 0) + (kind === 'core' ? 0.35 : 0)) * fade);
          drawMesh(kind === 'core' ? ICO_LARGE : ICO_SMALL, rad, P[i], time * 0.5 + i, time * 0.32 + i * 0.7, accent ? colors.accent : colors.fg, accent ? colors.accent : colors.fg, 1.1 * fade, cam);
        } });
      }

      // particles
      dirPts.forEach((d) => {
        const p = [d.A[0] + (d.B[0] - d.A[0]) * d.t, d.A[1] + (d.B[1] - d.A[1]) * d.t, d.A[2] + (d.B[2] - d.A[2]) * d.t];
        const q = project(p, cam); if (!q) return;
        const fade = Math.min(fadeOf(d.ia), fadeOf(d.ib)) * edgeFade;
        items.push({ z: p[2] + 0.02, fn: () => {
          glow(glowA, q, 9 * q.k, 0.9 * fade);
          ctx.beginPath(); ctx.arc(q.x, q.y, 1.9 * q.k, 0, Math.PI * 2);
          ctx.fillStyle = rgba(colors.accent, fade); ctx.fill();
        } });
      });

      // scroll-driven traveller along the node chain
      if (pr.traveler && pIdx != null) {
        const trail = [0, 0.18, 0.36, 0.55, 0.75];
        trail.forEach((off, ti) => {
          const idx = clamp(pIdx - off, 0, n - 1);
          const i0 = Math.floor(idx), i1 = Math.min(n - 1, i0 + 1), f = idx - i0;
          const A = P[i0], B = P[i1]; if (!A || !B) return;
          const p = [A[0] + (B[0] - A[0]) * f, A[1] + (B[1] - A[1]) * f, A[2] + (B[2] - A[2]) * f];
          const q = project(p, cam); if (!q) return;
          items.push({ z: p[2] + 0.05, fn: () => {
            glow(glowA, q, (ti === 0 ? 26 : 14 - ti * 2) * q.k, 1 - ti * 0.17);
            ctx.beginPath(); ctx.arc(q.x, q.y, (ti === 0 ? 4.2 : 2.4) * q.k, 0, Math.PI * 2);
            ctx.fillStyle = rgba(colors.accent, 1 - ti * 0.15); ctx.fill();
          } });
        });
      }

      items.sort((a, b) => a.z - b.z).forEach((it) => it.fn());

      // ---- HTML labels ------------------------------------------------------
      for (let i = 0; i < n; i++) {
        const el = labelRefs.current[i];
        if (!el) continue;
        const p = proj[i], s = st[i];
        if (!p || !s) { el.style.opacity = '0'; continue; }
        const kind = nodes[i].kind || 'node';
        const r = (kind === 'core' ? 0.5 : 0.2) * (nodes[i].size ?? 1) * S * p.k;
        const x = clamp(p.x, 60, W - 60);
        const y = clamp(p.y + r + 8, 6, H - 28);
        el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) translateX(-50%)`;
        const depthOp = clamp(0.55 + 0.45 * ((p.z + 2) / 4), 0.5, 1);
        const op = hov === i ? 1 : depthOp * s.b * fadeOf(i) * clamp(s.s, 0, 1);
        el.style.opacity = String(op < 0.06 ? 0 : op);
        el.style.pointerEvents = op < 0.3 ? 'none' : 'auto';
        el.style.zIndex = hov === i ? '40' : String(Math.round((p.z + 4) * 4));
      }
    };

    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      tmx = (x / r.width) * 2 - 1; tmy = (y / r.height) * 2 - 1;
      if (e.target.closest && e.target.closest('[data-label]')) return;
      const pr = propsRef.current;
      let best = null, bestD = 1e9;
      proj.forEach((p, i) => {
        if (!p || !pr.nodes[i] || st[i].s < 0.5) return;
        const rad = (pr.nodes[i].kind === 'core' ? 0.5 : 0.2) * (pr.nodes[i].size ?? 1) * S * p.k + 12;
        const d = Math.hypot(p.x - x, p.y - y);
        if (d < rad && d < bestD) { best = i; bestD = d; }
      });
      setHover(best);
    };
    const onLeave = () => { tmx = 0; tmy = 0; setHover(null); };
    const onClick = () => { const h = hoverRef.current; if (h != null && propsRef.current.onSelect) propsRef.current.onSelect(h); };

    const ro = new ResizeObserver(resize); ro.observe(wrap); resize();
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0 }); io.observe(wrap);
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);
    wrap.addEventListener('click', onClick);
    const mo = new MutationObserver(() => { colors = readColors(); glowA = makeGlow(colors.accent); glowF = makeGlow(colors.fg); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect(); mo.disconnect();
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      wrap.removeEventListener('click', onClick);
    };
  }, [setHover]);

  return (
    <div ref={wrapRef} className={`relative w-full select-none ${className}`} role="img" aria-label={ariaLabel}>
      <canvas ref={canvasRef} className="absolute inset-0" />
      {labels && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {nodes.map((nd, i) => (
            <div
              key={i}
              ref={(el) => (labelRefs.current[i] = el)}
              data-label
              className="pointer-events-auto absolute left-0 top-0"
              style={{ opacity: 0 }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <button
                type="button"
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                onClick={() => onSelect && onSelect(i)}
                className={`whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[11px] backdrop-blur transition-colors ${
                  nd.kind === 'core'
                    ? 'border-accent/50 bg-accent/15 text-accent'
                    : hover === i ? 'border-accent bg-bg/90 text-accent' : 'border-line/15 bg-bg/70 text-fg'
                }`}
              >
                {nd.label}
              </button>
            </div>
          ))}
        </div>
      )}
      {labels && hover != null && nodes[hover]?.desc && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 z-50 w-[min(92%,26rem)] -translate-x-1/2 rounded-xl border border-line/15 bg-surface/95 px-4 py-3 text-center text-[12.5px] leading-snug text-muted shadow-xl backdrop-blur">
          <span className="mb-0.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-accent">{nodes[hover].label}</span>
          {nodes[hover].desc}
        </div>
      )}
      {hint && (
        <p className="pointer-events-none absolute right-2 top-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted/70">{hint}</p>
      )}
    </div>
  );
}
