import { type Signal, useComputed } from "@preact/signals";
import type { Edge, ReadonlyVec2 } from "../core";
import { computeEdgePathWithGrabbingDelta } from "./compute";
import styles from "./edge.module.scss";
import type { GrabbingSignal } from "./grabbing";

export const CharonEdge: preact.FunctionComponent<{
  edge: Edge;
  grabbing: GrabbingSignal;
  canvasPos: Signal<ReadonlyVec2>;
}> = ({ edge, grabbing, canvasPos }) => {
  const path = useComputed(() => {
    return computeEdgePathWithGrabbingDelta(edge, grabbing, canvasPos);
  });

  return <path id={edge.key} class={styles.edge_path} d={path} />;
};
