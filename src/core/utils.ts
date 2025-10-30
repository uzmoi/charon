import type { ReadonlyVec2 } from "./vec2";

export const distance = (v1: ReadonlyVec2, v2: ReadonlyVec2): number => {
  const dx = v1.x - v2.x;
  const dy = v1.y - v2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const nearest = <T>(
  values: Iterable<T>,
  distance: (value: T) => number,
  maximumDistance = Infinity,
): T | null => {
  let nearestDistance = maximumDistance;
  let nearestValue = null;

  for (const value of values) {
    const d = distance(value);
    if (d < nearestDistance) {
      nearestDistance = d;
      nearestValue = value;
    }
  }

  return nearestValue;
};
