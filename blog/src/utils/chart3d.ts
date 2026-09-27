export interface ChartPoint {
  name: string;
  tokens: number;
  cost: number;
  score: number;
}

export interface ChartConfig {
  points: ChartPoint[];
  color?: string | { light: string; dark: string };
}

export type Vector3 = [number, number, number];
export interface Camera {
  yaw: number;
  pitch: number;
  zoom: number;
}

export const initialCamera: Camera = { yaw: -0.45, pitch: 0.26, zoom: 1 };
export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

// An orthographic camera keeps distances comparable while the reader rotates.
export function project([x, y, z]: Vector3, camera: Camera) {
  const horizontal = x * Math.cos(camera.yaw) + z * Math.sin(camera.yaw);
  const depth = -x * Math.sin(camera.yaw) + z * Math.cos(camera.yaw);
  return {
    x: horizontal * camera.zoom,
    y:
      (-y * Math.cos(camera.pitch) - depth * Math.sin(camera.pitch)) *
      camera.zoom,
    depth: depth * Math.cos(camera.pitch) - y * Math.sin(camera.pitch)
  };
}

const isHexColor = (value: unknown): value is string =>
  typeof value === 'string' && /^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(value);

export function parseChartConfig(source: string): ChartConfig | null {
  try {
    const data = JSON.parse(source);
    // Keep the original array syntax working alongside configurable charts.
    const points: unknown = Array.isArray(data) ? data : data?.points;
    if (!Array.isArray(points) || points.length < 2 || points.length > 50)
      return null;
    if (
      !points.every(
        (point) =>
          point &&
          typeof point.name === 'string' &&
          point.name.trim().length > 0 &&
          ['tokens', 'cost', 'score'].every(
            (key) =>
              typeof point[key] === 'number' &&
              Number.isFinite(point[key]) &&
              point[key] >= 0
          ) &&
          point.score <= 100
      )
    )
      return null;
    const color = data?.color;
    if (isHexColor(color)) return { points, color };
    if (color && isHexColor(color.light) && isHexColor(color.dark)) {
      return { points, color: { light: color.light, dark: color.dark } };
    }
    // A mistyped colour should not prevent otherwise valid data from rendering.
    return { points };
  } catch {
    return null;
  }
}

export const axisMaximum = (value: number, step: number) =>
  Math.max(step, Math.ceil(value / step) * step);
