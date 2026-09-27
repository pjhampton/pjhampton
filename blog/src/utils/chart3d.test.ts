import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  axisMaximum,
  initialCamera,
  parseChartConfig,
  project
} from './chart3d';

describe('3D chart data', () => {
  const points = [
    { name: 'Deep', tokens: 120000, cost: 7.6, score: 88 },
    { name: 'Brief', tokens: 12000, cost: 1.2, score: 49 }
  ];

  it('accepts the original array and an object without a colour', () => {
    expect(parseChartConfig(JSON.stringify(points))).toEqual({ points });
    expect(parseChartConfig(JSON.stringify({ points }))).toEqual({ points });
  });

  it.each(['#b84f35', '#F86', '#ABCDEF'])(
    'accepts a hex colour: %s',
    (color) => {
      expect(parseChartConfig(JSON.stringify({ points, color }))).toEqual({
        points,
        color
      });
    }
  );

  it('accepts separate colours for light and dark mode', () => {
    const color = { light: '#b84f35', dark: '#ff8668' };
    expect(parseChartConfig(JSON.stringify({ points, color }))).toEqual({
      points,
      color
    });
  });

  it.each(['red', '#12345', 'url(example.svg)', null, 42, { light: '#fff' }])(
    'keeps the data and falls back to default colours for %j',
    (color) => {
      expect(parseChartConfig(JSON.stringify({ points, color }))).toEqual({
        points
      });
    }
  );

  it('reads the chart example documented in the README', () => {
    const readme = readFileSync(
      new URL('../../README.md', import.meta.url),
      'utf8'
    );
    const source = readme.match(/```chart3d\n([\s\S]*?)\n```/)?.[1] ?? '';
    expect(parseChartConfig(source)).toEqual({
      color: '#b84f35',
      points
    });
  });

  it.each([
    'invalid JSON',
    'null',
    '{}',
    '[]',
    '[null, null]',
    '[{"name":"A","tokens":-1,"cost":1,"score":50},{"name":"B","tokens":2,"cost":2,"score":60}]',
    '[{"name":"A","tokens":1,"cost":1,"score":101},{"name":"B","tokens":2,"cost":2,"score":60}]',
    '[{"name":"A","tokens":1,"cost":1e999,"score":50},{"name":"B","tokens":2,"cost":2,"score":60}]'
  ])('rejects malformed or out of range values: %s', (source) => {
    expect(parseChartConfig(source)).toBeNull();
  });

  it('keeps axis ranges nonzero and rounds up without hiding points', () => {
    expect(axisMaximum(0, 25000)).toBe(25000);
    expect(axisMaximum(120000, 25000)).toBe(125000);
    expect(axisMaximum(7.6, 2)).toBe(8);
  });
});

describe('3D projection', () => {
  it('rotates depth into the horizontal axis', () => {
    expect(project([0, 0, 1], { yaw: 0, pitch: 0, zoom: 1 }).x).toBe(0);
    expect(
      project([0, 0, 1], { yaw: Math.PI / 2, pitch: 0, zoom: 1 }).x
    ).toBeCloseTo(1);
  });

  it('preserves distance when rotating before zoom', () => {
    const result = project([1, 2, 3], initialCamera);
    expect(result.x ** 2 + result.y ** 2 + result.depth ** 2).toBeCloseTo(14);
  });

  it('returns to the same coordinates after a full turn', () => {
    const result = project([1, 0.5, -0.9], initialCamera);
    const rotated = project([1, 0.5, -0.9], {
      ...initialCamera,
      yaw: initialCamera.yaw + Math.PI * 2
    });
    expect(rotated.x).toBeCloseTo(result.x);
    expect(rotated.y).toBeCloseTo(result.y);
  });

  it('scales both screen coordinates evenly when zooming', () => {
    const result = project([1, 0.5, -0.9], initialCamera);
    const zoomed = project([1, 0.5, -0.9], { ...initialCamera, zoom: 1.5 });
    expect(zoomed.x).toBeCloseTo(result.x * 1.5);
    expect(zoomed.y).toBeCloseTo(result.y * 1.5);
  });
});
