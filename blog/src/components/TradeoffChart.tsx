import { useEffect, useId, useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import {
  axisMaximum,
  clamp,
  initialCamera,
  parseChartConfig,
  project
} from '../utils/chart3d';
import type { ChartConfig, ChartPoint, Vector3 } from '../utils/chart3d';
import '../styles/chart3d.css';

export default function TradeoffChart({ source }: { source: string }) {
  const config = parseChartConfig(source);
  if (!config) {
    return (
      <div role="status">
        <p>The chart data could not be displayed.</p>
        <pre>{source}</pre>
      </div>
    );
  }
  return <Chart {...config} />;
}

function Chart({ points, color }: ChartConfig) {
  const id = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const [size, setSize] = useState({ width: 720, height: 480 });
  const [camera, setCamera] = useState(initialCamera);
  const [selected, setSelected] = useState(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height
      });
    });
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  const tokenMax = axisMaximum(
    Math.max(...points.map((point) => point.tokens)),
    25000
  );
  const costMax = axisMaximum(
    Math.max(...points.map((point) => point.cost)),
    2
  );
  // The former 132% view is the baseline for the displayed zoom percentage.
  const scale =
    1.32 * Math.min((size.width - 80) / 4.4, (size.height - 112) / 3.2);
  const position = (vector: Vector3) => {
    const result = project(vector, camera);
    return {
      x: size.width / 2 + result.x * scale,
      y: size.height / 2 + result.y * scale,
      depth: result.depth
    };
  };
  const pointPosition = (point: ChartPoint): Vector3 => [
    1.5 - (point.tokens / tokenMax) * 3,
    -1 + (point.score / 100) * 2,
    -0.9 + (point.cost / costMax) * 1.8
  ];
  const projected = points.map((point, index) => ({
    ...position(pointPosition(point)),
    point,
    index
  }));
  const line = (
    from: Vector3,
    to: Vector3,
    key: string,
    className = 'chart-grid'
  ) => {
    const a = position(from);
    const b = position(to);
    return (
      <line
        key={key}
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        className={className}
      />
    );
  };
  const label = (
    at: Vector3,
    text: string,
    dx = 0,
    dy = 0,
    className = 'chart-tick'
  ) => {
    const p = position(at);
    return (
      <text
        key={text}
        x={p.x + dx}
        y={p.y + dy}
        textAnchor="middle"
        className={className}
      >
        {text}
      </text>
    );
  };
  const grid = [];
  for (let step = 0; step <= 5; step++) {
    const x = 1.5 - step * 0.6;
    const y = -1 + step * 0.4;
    grid.push(line([x, -1, -0.9], [x, -1, 0.9], `floor-x-${step}`));
    grid.push(line([x, -1, 0.9], [x, 1, 0.9], `back-x-${step}`));
    grid.push(line([-1.5, y, 0.9], [1.5, y, 0.9], `back-y-${step}`));
    grid.push(line([1.5, y, -0.9], [1.5, y, 0.9], `side-y-${step}`));
  }
  for (let step = 0; step <= 4; step++) {
    const z = -0.9 + step * 0.45;
    grid.push(line([-1.5, -1, z], [1.5, -1, z], `floor-z-${step}`));
    grid.push(line([1.5, -1, z], [1.5, 1, z], `side-z-${step}`));
  }

  const zoom = (factor: number) =>
    setCamera((current) => ({
      ...current,
      zoom: clamp(current.zoom * factor, 0.6, 1.6)
    }));
  const rotate = (yaw: number, pitch: number) =>
    setCamera((current) => ({
      ...current,
      yaw: current.yaw + yaw,
      pitch: clamp(current.pitch + pitch, -1.2, 1.2)
    }));
  const reset = () => setCamera({ ...initialCamera });
  const onKeyDown = (event: JSX.TargetedKeyboardEvent<SVGSVGElement>) => {
    // Point buttons have their own keyboard interaction.
    if (event.target !== event.currentTarget) return;
    const actions: Record<string, () => void> = {
      ArrowLeft: () => rotate(-0.12, 0),
      ArrowRight: () => rotate(0.12, 0),
      ArrowUp: () => rotate(0, 0.12),
      ArrowDown: () => rotate(0, -0.12),
      '+': () => zoom(1.1),
      '=': () => zoom(1.1),
      '-': () => zoom(1 / 1.1),
      Home: reset
    };
    if (actions[event.key]) {
      event.preventDefault();
      actions[event.key]();
    }
  };
  const onPointerMove = (event: JSX.TargetedPointerEvent<SVGSVGElement>) => {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;
    const other = [...pointers.current.entries()].find(
      ([key]) => key !== event.pointerId
    )?.[1];
    if (other) {
      const before = Math.hypot(previous.x - other.x, previous.y - other.y);
      const after = Math.hypot(
        event.clientX - other.x,
        event.clientY - other.y
      );
      if (before > 0 && after > 0) zoom(after / before);
    } else {
      rotate(
        (event.clientX - previous.x) * 0.008,
        (event.clientY - previous.y) * 0.008
      );
    }
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    });
  };
  const endPointer = (event: JSX.TargetedPointerEvent<SVGSVGElement>) => {
    pointers.current.delete(event.pointerId);
    setDragging(pointers.current.size > 0);
  };
  const active = points[selected];

  return (
    <figure
      className="tradeoff-chart"
      aria-labelledby={`${id}-title`}
      style={
        color
          ? {
              '--chart-custom-light':
                typeof color === 'string' ? color : color.light,
              '--chart-custom-dark':
                typeof color === 'string' ? color : color.dark
            }
          : undefined
      }
    >
      <figcaption className="chart-heading">
        <div>
          <span className="chart-eyebrow">Interactive · illustrative data</span>
          <h2 id={`${id}-title`}>The cost of a better answer</h2>
        </div>
        <button type="button" onClick={reset}>
          Reset view
        </button>
      </figcaption>
      <p className="chart-instructions" id={`${id}-instructions`}>
        Drag to rotate · Pinch or use + / − to zoom · Select a point
      </p>
      <svg
        ref={svgRef}
        className={`chart-scene${dragging ? ' is-dragging' : ''}`}
        viewBox={`0 0 ${size.width} ${size.height}`}
        tabIndex={0}
        role="group"
        aria-roledescription="interactive 3D chart"
        aria-label="Output tokens, cost per task, and intelligence score"
        aria-describedby={`${id}-instructions ${id}-keyboard`}
        onKeyDown={onKeyDown}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.currentTarget.focus();
          pointers.current.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY
          });
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onLostPointerCapture={endPointer}
      >
        <title>Three dimensions of an answer</title>
        <desc>
          Five fictional configurations. More output tokens and higher cost
          accompany higher scores. Exact values are available in the data table
          below.
        </desc>
        {grid}
        {line([-1.5, -1, -0.9], [1.5, -1, -0.9], 'tokens', 'chart-axis')}
        {line([1.5, -1, -0.9], [1.5, -1, 0.9], 'cost', 'chart-axis')}
        {line([1.5, -1, -0.9], [1.5, 1, -0.9], 'score', 'chart-axis')}
        {[0, 1, 2, 3, 4, 5].map((step) =>
          label(
            [1.5 - step * 0.6, -1, -0.9],
            `${Math.round((tokenMax * step) / 5000)}k`,
            0,
            20
          )
        )}
        {[1, 2, 3, 4].map((step) =>
          label(
            [1.5, -1, -0.9 + step * 0.45],
            `$${(costMax * step) / 4}`,
            24,
            8
          )
        )}
        {[20, 40, 60, 80, 100].map((score) =>
          label([1.5, -1 + score / 50, -0.9], String(score), 24, 4)
        )}
        {label(
          [0, -1, -0.9],
          'Output tokens / task',
          0,
          44,
          'chart-axis-label'
        )}
        {label(
          [1.5, -1, 0.9],
          'Cost / task (USD)',
          -32,
          -20,
          'chart-axis-label'
        )}
        {label(
          [1.5, 1, -0.9],
          'Intelligence index',
          -32,
          -24,
          'chart-axis-label'
        )}
        <polyline
          className="chart-series"
          points={projected.map((p) => `${p.x},${p.y}`).join(' ')}
        />
        {line(
          pointPosition(active),
          [pointPosition(active)[0], -1, pointPosition(active)[2]],
          'guide',
          'chart-guide'
        )}
        {[...projected]
          .sort((a, b) => b.depth - a.depth)
          .map(({ x, y, point, index }) => (
            <g
              key={point.name}
              className="chart-point"
              tabIndex={0}
              role="button"
              aria-label={`${point.name}: ${point.tokens.toLocaleString('en-US')} tokens, $${point.cost.toFixed(2)}, score ${point.score}`}
              aria-pressed={selected === index}
              onPointerDown={(event) => {
                event.stopPropagation();
                event.currentTarget.focus();
                setSelected(index);
              }}
              onMouseEnter={() => {
                if (!dragging) setSelected(index);
              }}
              onFocus={() => setSelected(index)}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelected(index);
                }
              }}
            >
              <circle cx={x} cy={y} r={16} className="chart-point-target" />
              <circle
                cx={x}
                cy={y}
                r={selected === index ? 8 : 5}
                className="chart-point-dot"
              />
              {selected === index ? (
                <text
                  x={x}
                  y={y - 20}
                  textAnchor="middle"
                  className="chart-point-label"
                >
                  {point.name}
                </text>
              ) : null}
            </g>
          ))}
      </svg>
      <div className="chart-toolbar">
        <span className="chart-legend">
          <span aria-hidden="true">●</span> Example configurations
        </span>
        <div className="chart-zoom">
          <button
            type="button"
            aria-label="Zoom out"
            disabled={camera.zoom <= 0.6}
            onClick={() => zoom(1 / 1.15)}
          >
            −
          </button>
          <span>{Math.round(camera.zoom * 100)}%</span>
          <button
            type="button"
            aria-label="Zoom in"
            disabled={camera.zoom >= 1.6}
            onClick={() => zoom(1.15)}
          >
            +
          </button>
        </div>
      </div>
      <div className="chart-readout" aria-live="polite" aria-atomic="true">
        <strong>{active.name}</strong>
        <dl>
          <div>
            <dt>Output tokens</dt>
            <dd>{active.tokens.toLocaleString('en-US')}</dd>
          </div>
          <div>
            <dt>Cost / task</dt>
            <dd>${active.cost.toFixed(2)}</dd>
          </div>
          <div>
            <dt>Intelligence index</dt>
            <dd>
              {active.score}
              <span> / 100</span>
            </dd>
          </div>
        </dl>
      </div>
      <details className="chart-data">
        <summary>View data and keyboard controls</summary>
        <p id={`${id}-keyboard`}>
          Focus the chart and use the arrow keys to rotate, + and − to zoom, and
          Home to reset. Tab through the points to inspect each configuration.
        </p>
        <div className="chart-table-scroll">
          <table>
            <caption>
              Illustrative values, not measured model benchmarks.
            </caption>
            <thead>
              <tr>
                <th scope="col">Configuration</th>
                <th scope="col">Tokens / task</th>
                <th scope="col">USD / task</th>
                <th scope="col">Index / 100</th>
              </tr>
            </thead>
            <tbody>
              {points.map((point) => (
                <tr key={point.name}>
                  <th scope="row">{point.name}</th>
                  <td>{point.tokens.toLocaleString('en-US')}</td>
                  <td>${point.cost.toFixed(2)}</td>
                  <td>{point.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
