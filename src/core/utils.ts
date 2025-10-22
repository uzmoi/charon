import type { Vec2 } from "./types";

export const distance = (v1: Vec2, v2: Vec2): number => {
  const dx = v1.x - v2.x;
  const dy = v1.y - v2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const nearest = <T extends { pos: Vec2 }>(
  ports: Iterable<T>,
  pos: Vec2,
  maximumDistance = Infinity,
): T | null => {
  let nearestDistance = maximumDistance;
  let nearestPort = null;

  for (const port of ports) {
    const d = distance(port.pos, pos);
    if (d < nearestDistance) {
      nearestDistance = d;
      nearestPort = port;
    }
  }

  return nearestPort;
};
