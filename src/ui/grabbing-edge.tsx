import { useComputed } from "@preact/signals";
import { nearestInputPort, type Charon } from "../core";
import {
  GRID_SIZE_UNIT,
  MAXIMUM_CONNECT_DISTANCE,
  NODE_HEADER_HEIGHT,
  NODE_PORT_HEIGHT,
} from "./constants";
import { CharonEdge } from "./edge";
import type { GrabbingSignal } from "./grabbing";

export const GrabbingEdge: preact.FunctionComponent<{
  charon: Charon;
  grabbing: GrabbingSignal;
}> = ({ charon, grabbing }) => {
  const grabbingEdge = useComputed(() => {
    if (grabbing.value?.port == null) return null;

    const { port, delta } = grabbing.value;
    if (delta == null) return null;

    const cursorPos = {
      x: port.pos.x + delta.x / GRID_SIZE_UNIT,
      y: port.pos.y + delta.y / GRID_SIZE_UNIT,
    };

    const targetPort = nearestInputPort(
      charon.nodes(),
      cursorPos,
      port,
      NODE_HEADER_HEIGHT,
      NODE_PORT_HEIGHT,
      MAXIMUM_CONNECT_DISTANCE,
    );

    return [port.pos, cursorPos, targetPort?.pos] as const;
  });

  if (grabbingEdge.value == null) return null;

  const [p1, p2, p3] = grabbingEdge.value;

  const maxX = Math.ceil(Math.max(p1.x, p2.x, p3?.x ?? 0) + 0.5);
  const maxY = Math.ceil(Math.max(p1.y, p2.y, p3?.y ?? 0) + 0.5);

  return (
    <svg
      width={`${maxX * 1.75}rem`}
      height={`${maxY * 1.75}rem`}
      viewBox={`0 0 ${maxX} ${maxY}`}
      style="position: absolute;"
    >
      <CharonEdge from={p1} to={p2} />
      <circle cx={p2.x} cy={p2.y} r="0.25" />
      {p3 && (
        <line
          x1={p2.x}
          y1={p2.y}
          x2={p3.x}
          y2={p3.y}
          stroke="yellow"
          stroke-width="0.125"
        />
      )}
    </svg>
  );
};
