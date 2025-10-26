import type { Node } from "./node";
import type { Vec2 } from "./types";
import { nearest } from "./utils";

export interface NodePort {
  node: Node;
  name: string;
  pos: Vec2;
  type: string;
}

const nodePorts = (
  node: Node,
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
  node: Node,
  offset: number,
  portHeight: number,
): NodePort[] => {
  const { x, y } = node.pos.value;
  return nodePorts(node, node.action.input, index => ({
    x,
    y: y + offset + index * portHeight,
  }));
};

export const outputPorts = (
  node: Node,
  offset: number,
  portHeight: number,
): NodePort[] => {
  const { x, y } = node.pos.value;
  return nodePorts(node, node.action.output, index => ({
    x: x + node.size.width,
    y: y + offset + index * portHeight,
  }));
};

const isSameTypePort = (a: NodePort, b: NodePort) =>
  a.node !== b.node && a.type === b.type;

export const nearestPort = (
  allPorts: readonly NodePort[],
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

  return nearest(sameTypePort, pos, maximumDistance);
};
