import type { Node, Vec2 } from "./types";

export interface NodePort {
  node: number;
  name: string;
  pos: Vec2;
  type: string;
}

const nodePorts = (
  node: number,
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
