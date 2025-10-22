import type { Node, NodeId, Vec2 } from "./types";
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
): NodePort[] =>
  nodePorts(id, action.input, index => ({
    x: pos.x,
    y: pos.y + offset + index * portHeight,
  }));

export const outputPorts = (
  { id, action, pos, size }: Node,
  offset: number,
  portHeight: number,
): NodePort[] =>
  nodePorts(id, action.output, index => ({
    x: pos.x + size.width,
    y: pos.y + offset + index * portHeight,
  }));

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
