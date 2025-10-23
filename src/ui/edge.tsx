import { useComputed } from "@preact/signals";
import type { Vec2 } from "../core";
import type { PosEdge } from "./edge-canvas";
import { useGrabbingDelta, type GrabbingSignal } from "./grabbing";

export const CharonEdge: preact.FunctionComponent<{
  edge: PosEdge;
  grabbing: GrabbingSignal;
}> = ({ edge, grabbing }) => {
  const fromDelta = useGrabbingDelta(grabbing, edge.from);
  const toDelta = useGrabbingDelta(grabbing, edge.to);

  const path = useComputed(() => {
    return edgePath(
      { x: edge.p1.x + fromDelta.value.x, y: edge.p1.y + fromDelta.value.y },
      { x: edge.p2.x + toDelta.value.x, y: edge.p2.y + toDelta.value.y },
    );
  });

  return <path d={path} fill="none" stroke="#1e9124" stroke-width="0.25" />;
};

const edgePath = (start: Vec2, end: Vec2) => {
  const x = (start.x + end.x) / 2;
  return `M${start.x} ${start.y}C${x} ${start.y} ${x} ${end.y} ${end.x} ${end.y}`;
};
