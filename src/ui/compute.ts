import type { Edge, Vec2 } from "../core";
import type { GrabbingSignal } from "./grabbing";
import { inputPortPos, outputPortPos } from "./pos";

export const computeEdgePathWithGrabbingDelta = (
  { from, to }: Edge,
  { value: grabbing }: GrabbingSignal,
) => {
  let p1 = outputPortPos(from.node, from.name);
  let p2 = inputPortPos(to.node, to.name);

  if (grabbing?.delta) {
    const { id, delta } = grabbing;
    if (id === from.node.id) {
      p1 = {
        x: p1.x + Math.round(delta.x),
        y: p1.y + Math.round(delta.y),
      };
    }
    if (id === to.node.id) {
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
