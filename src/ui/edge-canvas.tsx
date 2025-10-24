import { useComputed } from "@preact/signals";
import type { Charon, NodeId, Vec2 } from "../core";
import { CharonEdge } from "./edge";
import type { GrabbingSignal } from "./grabbing";
import { inputPortPos, outputPortPos } from "./pos";

export interface PosEdge {
  key: string;
  from: NodeId;
  p1: Vec2;
  to: NodeId;
  p2: Vec2;
}

export const EdgeCanvas: preact.FunctionComponent<{
  charon: Charon;
  grabbing: GrabbingSignal;
}> = ({ charon, grabbing }) => {
  const edges = useComputed<PosEdge[]>(() => {
    return charon.edges().map(({ from, fromPort, to, toPort }) => ({
      key: `${from}#${fromPort}-${to}#${toPort}`,
      from: from.id,
      p1: outputPortPos(from, fromPort),
      to: to.id,
      p2: inputPortPos(to, toPort),
    }));
  });

  const edgeMax = useComputed(() => {
    const edgePoss = edges.value.flatMap(edge => [edge.p1, edge.p2]);

    const maxX = Math.ceil(Math.max(0, ...edgePoss.map(pos => pos.x)) + 0.5);
    const maxY = Math.ceil(Math.max(0, ...edgePoss.map(pos => pos.y)) + 0.5);
    return { maxX, maxY };
  });

  const width = useComputed(() => `${edgeMax.value.maxX * 1.75}rem`);
  const height = useComputed(() => `${edgeMax.value.maxY * 1.75}rem`);
  const viewBox = useComputed(
    () => `0 0 ${edgeMax.value.maxX} ${edgeMax.value.maxY}`,
  );

  return (
    <svg width={width} height={height} viewBox={viewBox}>
      {edges.value.map(edge => (
        <CharonEdge key={edge.key} {...{ edge, grabbing }} />
      ))}
    </svg>
  );
};
