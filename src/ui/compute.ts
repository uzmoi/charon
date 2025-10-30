import type { Edge, Vec2 } from "../core";
import type { GrabbingSignal } from "./grabbing";
import { inputPortPos, outputPortPos } from "./pos";

export const computeEdgePathWithGrabbingDelta = (
  edge: Edge,
  { value: grabbing }: GrabbingSignal,
) => {
  let p1 = outputPortPos(edge.from, edge.fromPort);
  let p2 = inputPortPos(edge.to, edge.toPort);

  if (grabbing?.delta) {
    const { id, delta } = grabbing;
    if (id === edge.from.id) {
      p1 = {
        x: p1.x + Math.round(delta.x),
        y: p1.y + Math.round(delta.y),
      };
    }
    if (id === edge.to.id) {
      p2 = {
        x: p2.x + Math.round(delta.x),
        y: p2.y + Math.round(delta.y),
      };
    }
  }

  return edgePath(p1, p2);
};

export const edgePath = (start: Vec2, end: Vec2) => {
  const x = (start.x + end.x) / 2;
  return `M${start.x} ${start.y}C${x} ${start.y} ${x} ${end.y} ${end.x} ${end.y}`;
};
