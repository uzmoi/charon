import { useComputed } from "@preact/signals";
import type { Edge } from "../core";
import { computeEdgePathWithGrabbingDelta } from "./compute";
import type { GrabbingSignal } from "./grabbing";

export const CharonEdge: preact.FunctionComponent<{
  edge: Edge;
  grabbing: GrabbingSignal;
}> = ({ edge, grabbing }) => {
  const path = useComputed(() => {
    return computeEdgePathWithGrabbingDelta(edge, grabbing);
  });

  return (
    <path
      id={edge.key}
      d={path}
      fill="none"
      stroke="#1e9124"
      stroke-width="0.25"
    />
  );
};
