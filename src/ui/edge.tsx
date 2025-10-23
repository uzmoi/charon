import { useComputed } from "@preact/signals";
import type { Charon, Edge, Vec2 } from "../core";
import { useGrabbingDelta, type GrabbingSignal } from "./grabbing";
import { inputPortPos, outputPortPos } from "./pos";

export const CharonEdge: preact.FunctionComponent<{
  charon: Charon;
  edge: Edge;
  grabbing: GrabbingSignal;
}> = ({ charon, edge, grabbing }) => {
  const fromDelta = useGrabbingDelta(grabbing, edge.from);
  const toDelta = useGrabbingDelta(grabbing, edge.to);

  const path = useComputed(() => {
    const nodes = charon.nodes();

    const from = nodes.find(node => node.id === edge.from)!;
    const to = nodes.find(node => node.id === edge.to)!;

    const fromPortPos = outputPortPos(from, edge.fromPort);
    const toPortPos = inputPortPos(to, edge.toPort);

    return edgePath(
      {
        x: fromPortPos.x + fromDelta.value.x,
        y: fromPortPos.y + fromDelta.value.y,
      },
      {
        x: toPortPos.x + toDelta.value.x,
        y: toPortPos.y + toDelta.value.y,
      },
    );
  });

  return <path d={path} fill="none" stroke="#1e9124" stroke-width="0.25" />;
};

const edgePath = (start: Vec2, end: Vec2) => {
  const x = (start.x + end.x) / 2;
  return `M${start.x} ${start.y}C${x} ${start.y} ${x} ${end.y} ${end.x} ${end.y}`;
};
