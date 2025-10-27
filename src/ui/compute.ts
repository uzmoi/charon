import {
  distance,
  inputPorts,
  nearest,
  type Charon,
  type Edge,
  type NodePort,
  type Vec2,
} from "../core";
import { MAXIMUM_CONNECT_DISTANCE } from "./constants";
import type { GrabbingSignal } from "./grabbing";
import { inputPortPos, outputPortPos } from "./pos";

export const computeEdgePathWithGrabbingDelta = (
  edge: Edge,
  { value: grabbing }: GrabbingSignal,
) => {
  let p1 = outputPortPos(edge.from, edge.fromPort);
  let p2 = inputPortPos(edge.to, edge.toPort);

  if (grabbing?.current) {
    const { x, y } = grabbing.current;
    if (grabbing.id === edge.from.id) {
      p1 = { x: Math.floor(x), y: Math.floor(y) };
    }
    if (grabbing.id === edge.to.id) {
      p2 = { x: Math.floor(x), y: Math.floor(y) };
    }
  }

  return edgePath(p1, p2);
};

export const edgePath = (start: Vec2, end: Vec2) => {
  const x = (start.x + end.x) / 2;
  return `M${start.x} ${start.y}C${x} ${start.y} ${x} ${end.y} ${end.x} ${end.y}`;
};

const isSameTypePort = (a: NodePort, b: NodePort) =>
  a.node !== b.node && a.type === b.type;

export const computePortToConnect = (
  charon: Charon,
  outputPort: NodePort,
  cursorPos: Vec2,
) => {
  const allInputPorts = charon
    .nodes()
    .flatMap(inputPorts)
    .filter(port => isSameTypePort(outputPort, port));

  const inputPortDistance = (port: NodePort) => {
    const portPos = inputPortPos(port.node, port.name);
    return distance(portPos, cursorPos);
  };

  return nearest(allInputPorts, inputPortDistance, MAXIMUM_CONNECT_DISTANCE);
};
