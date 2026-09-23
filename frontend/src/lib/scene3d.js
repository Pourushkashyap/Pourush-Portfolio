// Small 3D toolkit shared by every canvas scene (no dependencies).

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;

export function normalize(v) {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}

// yaw (around Y) then pitch (around X)
export function rotate(p, yaw, pitch) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const x = p[0] * cy + p[2] * sy;
  const z1 = -p[0] * sy + p[2] * cy;
  const cx = Math.cos(pitch), sx = Math.sin(pitch);
  return [x, p[1] * cx - z1 * sx, p[1] * sx + z1 * cx];
}

export const LIGHT = normalize([-0.45, 0.6, 0.66]);

export function icosphere(detail) {
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

export function readColors() {
  const s = getComputedStyle(document.documentElement);
  const get = (name) => s.getPropertyValue(name).trim().split(/\s+/).map(Number);
  return { accent: get('--accent'), fg: get('--fg'), bg: get('--bg') };
}

export const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

export function makeGlow(c) {
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
