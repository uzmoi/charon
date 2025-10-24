import { useComputed } from "@preact/signals";
import { edgeKey, type Charon } from "../core";
import { CharonEdge } from "./edge";
import type { GrabbingSignal } from "./grabbing";
import { inputPortPos, outputPortPos } from "./pos";

export const EdgeCanvas: preact.FunctionComponent<{
  charon: Charon;
  grabbing: GrabbingSignal;
}> = ({ charon, grabbing }) => {
  const edgeMax = useComputed(() => {
    const edgePoss = charon
      .edges()
      .flatMap(edge => [
        outputPortPos(edge.from, edge.fromPort),
        inputPortPos(edge.to, edge.toPort),
      ]);

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
      {charon.edges().map(edge => (
        <CharonEdge key={edgeKey(edge)} {...{ edge, grabbing }} />
      ))}
    </svg>
  );
};
