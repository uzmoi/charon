import type { Edge, Vec2 } from "../core";
import type { GrabbingSignal } from "./grabbing";
import { inputPortPos, outputPortPos } from "./pos";

export const computeEdgePathWithGrabbingDelta = (
  edge: Edge,
  { value: grabbing }: GrabbingSignal,
) => {
  let p1 = outputPortPos(edge.from, edge.fromPort);
  let p2 = inputPortPos(edge.to, edge.toPort);

  if (grabbing?.current) {
    const { x, y } = grabbing.current;
    if (grabbing.id === edge.from.id) {
      p1 = { x: Math.floor(x), y: Math.floor(y) };
    }
    if (grabbing.id === edge.to.id) {
      p2 = { x: Math.floor(x), y: Math.floor(y) };
    }
  }

  return edgePath(p1, p2);
};

export const edgePath = (start: Vec2, end: Vec2) => {
  const x = (start.x + end.x) / 2;
  return `M${start.x} ${start.y}C${x} ${start.y} ${x} ${end.y} ${end.x} ${end.y}`;
};
