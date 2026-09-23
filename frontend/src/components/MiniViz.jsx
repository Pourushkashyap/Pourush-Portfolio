// Tiny looping SVG visualisations for project cards (pure SVG animation, no JS loop).
const VIZ = {
  agents: { nodes: [[28, 50], [84, 50], [84, 18], [84, 82], [150, 50]], edges: [[0, 1], [1, 2], [1, 3], [2, 4], [3, 4], [1, 4]] },
  loop: {
    nodes: [[100, 14], [158, 32], [166, 70], [120, 88], [64, 82], [34, 46]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
  },
  finance: { nodes: [[22, 50], [70, 50], [118, 50], [172, 30], [172, 70]], edges: [[0, 1], [1, 2], [2, 3], [2, 4]] },
  pipeline: { nodes: [[20, 50], [65, 50], [110, 50], [155, 50], [188, 50]], edges: [[0, 1], [1, 2], [2, 3], [3, 4]] },
  genai: { nodes: [[100, 10], [46, 38], [154, 38], [46, 68], [154, 68], [100, 92]], edges: [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5]] },
  app: { nodes: [[30, 30], [100, 30], [170, 30], [30, 72], [100, 72], [170, 72]], edges: [[0, 1], [1, 2], [3, 4], [4, 5], [1, 4]] },
};

export default function MiniViz({ kind = 'agents' }) {
  if (kind === 'audio') {
    return (
      <svg viewBox="0 0 200 100" className="h-full w-full" aria-hidden>
        {Array.from({ length: 21 }).map((_, i) => (
          <rect key={i} x={12 + i * 8.6} width="4" rx="2" style={{ fill: 'rgb(var(--accent))' }} y="30" height="40">
            <animate attributeName="height" values="8;56;14;44;8" dur={`${1.6 + (i % 5) * 0.25}s`} repeatCount="indefinite" begin={`${(i % 7) * 0.1}s`} />
            <animate attributeName="y" values="46;22;43;28;46" dur={`${1.6 + (i % 5) * 0.25}s`} repeatCount="indefinite" begin={`${(i % 7) * 0.1}s`} />
          </rect>
        ))}
      </svg>
    );
  }
  if (kind === 'vision') {
    return (
      <svg viewBox="0 0 200 100" className="h-full w-full" aria-hidden>
        <rect x="14" y="10" width="172" height="80" rx="6" fill="none" style={{ stroke: 'rgb(var(--line) / .3)' }} />
        <rect x="46" y="30" width="46" height="46" rx="3" fill="none" style={{ stroke: 'rgb(var(--accent))' }} strokeWidth="1.5" />
        <rect x="110" y="24" width="52" height="34" rx="3" fill="none" style={{ stroke: 'rgb(var(--accent))' }} strokeWidth="1.5" strokeDasharray="4 3" />
        <line x1="14" x2="186" y1="10" y2="10" strokeWidth="1.5" style={{ stroke: 'rgb(var(--accent))' }}>
          <animate attributeName="y1" values="10;90;10" dur="4s" repeatCount="indefinite" />
          <animate attributeName="y2" values="10;90;10" dur="4s" repeatCount="indefinite" />
        </line>
      </svg>
    );
  }
  const v = VIZ[kind] || VIZ.agents;
  return (
    <svg viewBox="0 0 200 100" className="h-full w-full" aria-hidden>
      {v.edges.map(([a, b], i) => (
        <g key={i}>
          <line x1={v.nodes[a][0]} y1={v.nodes[a][1]} x2={v.nodes[b][0]} y2={v.nodes[b][1]} style={{ stroke: 'rgb(var(--line) / .28)' }} />
          <circle r="2.6" style={{ fill: 'rgb(var(--accent))' }}>
            <animateMotion dur={`${2.6 + (i % 3) * 0.5}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" path={`M${v.nodes[a][0]} ${v.nodes[a][1]} L${v.nodes[b][0]} ${v.nodes[b][1]}`} />
          </circle>
        </g>
      ))}
      {v.nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 0 ? 6 : 5} style={{ fill: 'rgb(var(--bg))', stroke: i === 0 ? 'rgb(var(--accent))' : 'rgb(var(--fg) / .7)' }} strokeWidth="1.4" />
      ))}
    </svg>
  );
}
