import { type Signal, useComputed } from "@preact/signals";
import type { BoxSize, Charon } from "../core";
import { GRID_SIZE_UNIT } from "./constants";
import { CharonEdge } from "./edge";
import type { GrabbingSignal } from "./grabbing";

export const EdgeCanvas: preact.FunctionComponent<{
  charon: Charon;
  grabbing: GrabbingSignal;
  canvasSize: Signal<BoxSize>;
}> = ({ charon, canvasSize, grabbing }) => {
  const viewBox = useComputed(() => {
    const { width, height } = canvasSize.value;
    return `0 0 ${width / GRID_SIZE_UNIT} ${height / GRID_SIZE_UNIT}`;
  });

  return (
    <svg width="100%" height="100%" viewBox={viewBox}>
      {charon.edges().map(edge => (
        <CharonEdge key={edge.key} {...{ edge, grabbing }} />
      ))}
    </svg>
  );
};
