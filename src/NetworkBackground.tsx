export function NetworkBackground() {
  const nodes = [
    { x: 8, y: 12, delay: 0, size: 4 },
    { x: 22, y: 8, delay: 0.3, size: 3 },
    { x: 38, y: 15, delay: 0.6, size: 5 },
    { x: 55, y: 6, delay: 0.2, size: 3 },
    { x: 72, y: 10, delay: 0.5, size: 4 },
    { x: 88, y: 14, delay: 0.8, size: 3 },
    { x: 15, y: 30, delay: 0.4, size: 3 },
    { x: 32, y: 25, delay: 0.7, size: 5 },
    { x: 50, y: 28, delay: 0.1, size: 4 },
    { x: 68, y: 24, delay: 0.5, size: 3 },
    { x: 85, y: 30, delay: 0.3, size: 4 },
    { x: 10, y: 48, delay: 0.6, size: 3 },
    { x: 28, y: 45, delay: 0.2, size: 4 },
    { x: 45, y: 50, delay: 0.5, size: 3 },
    { x: 62, y: 44, delay: 0.8, size: 5 },
    { x: 80, y: 48, delay: 0.3, size: 3 },
    { x: 92, y: 42, delay: 0.6, size: 4 },
    { x: 20, y: 65, delay: 0.4, size: 3 },
    { x: 40, y: 68, delay: 0.7, size: 4 },
    { x: 58, y: 62, delay: 0.2, size: 3 },
    { x: 75, y: 66, delay: 0.5, size: 5 },
    { x: 90, y: 60, delay: 0.9, size: 3 },
    { x: 12, y: 82, delay: 0.3, size: 4 },
    { x: 30, y: 85, delay: 0.6, size: 3 },
    { x: 50, y: 80, delay: 0.1, size: 3 },
    { x: 70, y: 84, delay: 0.4, size: 4 },
    { x: 85, y: 78, delay: 0.7, size: 3 },
  ];

  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
    [6, 7], [7, 8], [8, 9], [9, 10], [2, 7], [4, 9],
    [12, 13], [13, 14], [14, 15], [15, 16], [8, 13], [10, 15],
    [18, 19], [19, 20], [20, 21], [14, 19], [16, 21],
    [22, 23], [23, 24], [24, 25], [25, 26], [19, 24], [21, 25],
    [0, 6], [6, 12], [12, 18], [18, 22],
    [5, 11], [11, 17], [17, 23],
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.18]"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 100 100"
      >
        <g stroke="#10b981" strokeWidth="0.08" fill="none">
          {connections.map(([a, b], i) => (
            <line
              key={i}
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
              strokeOpacity="0.6"
            />
          ))}
        </g>
        {nodes.map((node, i) => (
          <circle
            key={i}
            cx={node.x}
            cy={node.y}
            r={node.size * 0.15}
            fill="#34d399"
            fillOpacity="0.5"
          >
            <animate
              attributeName="fill-opacity"
              values="0.3;0.7;0.3"
              dur={`${3 + (i % 4)}s`}
              begin={`${node.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-gan-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-[28rem] h-[28rem] bg-gan-700/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-emerald-400/5 rounded-full blur-3xl" />
    </div>
  );
}
