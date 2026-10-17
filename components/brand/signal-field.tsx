const CENTER = { x: 300, y: 330 }

const NODES = [
  { x: 92, y: 140, tone: 'light' },
  { x: 232, y: 70, tone: 'teal' },
  { x: 438, y: 96, tone: 'light' },
  { x: 536, y: 236, tone: 'teal' },
  { x: 548, y: 428, tone: 'light' },
  { x: 440, y: 540, tone: 'teal' },
  { x: 246, y: 574, tone: 'light' },
  { x: 96, y: 480, tone: 'teal' },
  { x: 58, y: 318, tone: 'light' },
] as const

const LINKS: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [8, 0],
]

const RADII = [78, 150, 224, 296]

/**
 * Composición abstracta: personas (nodos) que se conectan mediante señales
 * hacia un punto de encuentro dorado. No representa datos reales.
 */
export function SignalField({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 660"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {RADII.map((radius, index) => (
        <circle
          key={radius}
          cx={CENTER.x}
          cy={CENTER.y}
          r={radius}
          fill="none"
          stroke="#ffffff"
          strokeOpacity={0.12 + index * 0.02}
          strokeWidth={index === 2 ? 3 : 1.5}
          pathLength={100}
          strokeDasharray={index === 2 ? '90 10' : index === 1 ? '2 3' : undefined}
          strokeLinecap="round"
          transform={index === 2 ? `rotate(38 ${CENTER.x} ${CENTER.y})` : undefined}
        />
      ))}

      {NODES.map((node, index) => (
        <line
          key={`spoke-${index}`}
          x1={node.x}
          y1={node.y}
          x2={CENTER.x}
          y2={CENTER.y}
          stroke="#cfe3e4"
          strokeOpacity={0.16}
          strokeWidth={1.5}
        />
      ))}

      {LINKS.map(([from, to]) => (
        <line
          key={`link-${from}-${to}`}
          x1={NODES[from].x}
          y1={NODES[from].y}
          x2={NODES[to].x}
          y2={NODES[to].y}
          stroke="#ffffff"
          strokeOpacity={0.1}
          strokeWidth={1.5}
        />
      ))}

      <line
        x1={NODES[3].x}
        y1={NODES[3].y}
        x2={CENTER.x}
        y2={CENTER.y}
        stroke="#e3a209"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray="2 9"
      />

      {NODES.map((node, index) => (
        <g key={`node-${index}`}>
          <circle
            cx={node.x}
            cy={node.y}
            r={13}
            fill={node.tone === 'teal' ? '#21666b' : '#ffffff'}
            fillOpacity={0.18}
          />
          <circle
            cx={node.x}
            cy={node.y}
            r={5.5}
            fill={node.tone === 'teal' ? '#cfe3e4' : '#ffffff'}
          />
        </g>
      ))}

      <circle className="ping-node" cx={CENTER.x} cy={CENTER.y} r={16} fill="#e3a209" />
      <circle cx={CENTER.x} cy={CENTER.y} r={34} fill="#e3a209" fillOpacity={0.18} />
      <circle cx={CENTER.x} cy={CENTER.y} r={16} fill="#e3a209" />
      <circle cx={CENTER.x} cy={CENTER.y} r={6} fill="#080b55" />
    </svg>
  )
}
