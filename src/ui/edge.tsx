import { useComputed } from "@preact/signals";
import type { Edge } from "../core";
import { computeEdgePathWithGrabbingDelta } from "./compute";
import styles from "./edge.module.scss";
import type { GrabbingSignal } from "./grabbing";

export const CharonEdge: preact.FunctionComponent<{
  edge: Edge;
  grabbing: GrabbingSignal;
}> = ({ edge, grabbing }) => {
  const path = useComputed(() => {
    return computeEdgePathWithGrabbingDelta(edge, grabbing);
  });

  return <path id={edge.key} class={styles.edge_path} d={path} />;
};
