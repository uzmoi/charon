import type { Charon } from "../core";
import { computePortToConnect, edgePath } from "./compute";
import type { GrabbingSignal } from "./grabbing";
import { inputPortPos } from "./pos";

export const GrabbingEdge: preact.FunctionComponent<{
  charon: Charon;
  grabbing: GrabbingSignal;
}> = ({ charon, grabbing }) => {
  if (grabbing.value?.port == null) return null;

  const { port, start: p1, delta } = grabbing.value;
  if (delta == null) return null;

  // Cursor Position
  const p2 = {
    x: p1.x + delta.x,
    y: p1.y + delta.y,
  };

  const portToConnect = computePortToConnect(charon, port, p2);
  const p3 =
    portToConnect && inputPortPos(portToConnect.node, portToConnect.name);

  const maxX = Math.ceil(Math.max(p1.x, p2.x, p3?.x ?? 0) + 0.5);
  const maxY = Math.ceil(Math.max(p1.y, p2.y, p3?.y ?? 0) + 0.5);

  return (
    <svg
      width={`${maxX * 1.75}rem`}
      height={`${maxY * 1.75}rem`}
      viewBox={`0 0 ${maxX} ${maxY}`}
      style="position: absolute;"
    >
      <path
        d={edgePath(p1, p2)}
        fill="none"
        stroke="#1e9124"
        stroke-width="0.25"
      />
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
