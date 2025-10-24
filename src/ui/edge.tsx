import { useComputed } from "@preact/signals";
import { edgeKey, type Edge, type Vec2 } from "../core";
import type { GrabbingSignal } from "./grabbing";
import { inputPortPos, outputPortPos } from "./pos";

export const CharonEdge: preact.FunctionComponent<{
  edge: Edge;
  grabbing: GrabbingSignal;
}> = ({ edge, grabbing }) => {
  const path = useComputed(() => {
    let p1 = outputPortPos(edge.from, edge.fromPort);
    let p2 = inputPortPos(edge.to, edge.toPort);

    if (grabbing.value?.delta) {
      const { id, delta } = grabbing.value;
      if (id === edge.from.id) {
        p1 = { x: Math.floor(p1.x + delta.x), y: Math.floor(p1.y + delta.y) };
      }
      if (id === edge.to.id) {
        p2 = { x: Math.floor(p2.x + delta.x), y: Math.floor(p2.y + delta.y) };
      }
    }

    return edgePath(p1, p2);
  });

  return (
    <path
      id={edgeKey(edge)}
      d={path}
      fill="none"
      stroke="#1e9124"
      stroke-width="0.25"
    />
  );
};

const edgePath = (start: Vec2, end: Vec2) => {
  const x = (start.x + end.x) / 2;
  return `M${start.x} ${start.y}C${x} ${start.y} ${x} ${end.y} ${end.x} ${end.y}`;
};
