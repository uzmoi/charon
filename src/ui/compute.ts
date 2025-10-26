import {
  inputPorts,
  nearestPort,
  type Charon,
  type Edge,
  type NodePort,
  type Vec2,
} from "../core";
import {
  MAXIMUM_CONNECT_DISTANCE,
  NODE_HEADER_HEIGHT,
  NODE_PORT_HEIGHT,
} from "./constants";
import type { GrabbingSignal } from "./grabbing";
import { inputPortPos, outputPortPos } from "./pos";

export const computeEdgePathWithGrabbingDelta = (
  edge: Edge,
  { value: grabbing }: GrabbingSignal,
) => {
  let p1 = outputPortPos(edge.from, edge.fromPort);
  let p2 = inputPortPos(edge.to, edge.toPort);

  if (grabbing?.delta) {
    const { x, y } = grabbing.delta;
    if (grabbing.id === edge.from.id) {
      p1 = { x: Math.floor(p1.x + x), y: Math.floor(p1.y + y) };
    }
    if (grabbing.id === edge.to.id) {
      p2 = { x: Math.floor(p2.x + x), y: Math.floor(p2.y + y) };
    }
  }

  return edgePath(p1, p2);
};

export const edgePath = (start: Vec2, end: Vec2) => {
  const x = (start.x + end.x) / 2;
  return `M${start.x} ${start.y}C${x} ${start.y} ${x} ${end.y} ${end.x} ${end.y}`;
};

export const computePortToConnect = (
  charon: Charon,
  port: NodePort,
  cursorPos: Vec2,
) => {
  const allInputPorts = charon
    .nodes()
    .flatMap(node => inputPorts(node, NODE_HEADER_HEIGHT, NODE_PORT_HEIGHT));

  return nearestPort(allInputPorts, cursorPos, port, MAXIMUM_CONNECT_DISTANCE);
};
