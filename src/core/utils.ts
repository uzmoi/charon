import type { Vec2 } from "./types";

export const distance = (v1: Vec2, v2: Vec2): number => {
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
