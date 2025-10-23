import { useComputed } from "@preact/signals";
import type { Vec2 } from "../core";
import type { PosEdge } from "./edge-canvas";
import type { GrabbingSignal } from "./grabbing";

export const CharonEdge: preact.FunctionComponent<{
  edge: PosEdge;
  grabbing: GrabbingSignal;
}> = ({ edge, grabbing }) => {
  const path = useComputed(() => {
    let { p1, p2 } = edge;

    if (grabbing.value?.delta) {
      const { id, delta } = grabbing.value;
      if (id === edge.from) {
        p1 = { x: Math.floor(p1.x + delta.x), y: Math.floor(p1.y + delta.y) };
      }
      if (id === edge.to) {
        p2 = { x: Math.floor(p2.x + delta.x), y: Math.floor(p2.y + delta.y) };
      }
    }

    return edgePath(p1, p2);
  });

  return <path d={path} fill="none" stroke="#1e9124" stroke-width="0.25" />;
};

const edgePath = (start: Vec2, end: Vec2) => {
  const x = (start.x + end.x) / 2;
  return `M${start.x} ${start.y}C${x} ${start.y} ${x} ${end.y} ${end.x} ${end.y}`;
};
