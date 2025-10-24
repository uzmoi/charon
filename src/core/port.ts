import type { Node, NodeId } from "./node";
import type { Vec2 } from "./types";
import { nearest } from "./utils";

export interface NodePort {
  node: NodeId;
  name: string;
  pos: Vec2;
  type: string;
}

const nodePorts = (
  node: NodeId,
  ports: ReadonlyMap<string, { name: string }>,
  f: (index: number) => Vec2,
): NodePort[] =>
  ports
    .entries()
    .map(([name, { name: type }], index) => ({
      pos: f(index),
      node,
      name,
      type,
    }))
    .toArray();

export const inputPorts = (
  { id, action, pos }: Node,
  offset: number,
  portHeight: number,
): NodePort[] => {
  const { x, y } = pos.value;
  return nodePorts(id, action.input, index => ({
    x,
    y: y + offset + index * portHeight,
  }));
};

export const outputPorts = (
  { id, action, pos, size }: Node,
  offset: number,
  portHeight: number,
): NodePort[] => {
  const { x, y } = pos.value;
  return nodePorts(id, action.output, index => ({
    x: x + size.width,
    y: y + offset + index * portHeight,
  }));
};

export const nearestInputPort = (
  nodes: readonly Node[],
  pos: Vec2,
  outputPort: NodePort,
  offset: number,
  portHeight: number,
  maximumDistance: number,
): NodePort | null => {
  const allInputPorts = nodes.flatMap(node =>
    inputPorts(node, offset, portHeight),
  );

  const ports = allInputPorts.filter(
    inputPort =>
      inputPort.node !== outputPort.node && inputPort.type === outputPort.type,
  );

  return nearest(ports, pos, maximumDistance);
};
