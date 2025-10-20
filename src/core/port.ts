import type { Node, Vec2 } from "./types";

export interface NodePort {
  node: number;
  name: string;
  pos: Vec2;
  type: string;
}

const nodePorts = (
  node: Node,
  ports: ReadonlyMap<string, { name: string }>,
): IteratorObject<NodePort, void> => {
  return ports.entries().map(([port, { name: type }]) => {
    return { pos: node.pos, node: node.id, name: port, type };
  });
};

export const inputPorts = (node: Node): NodePort[] =>
  nodePorts(node, node.action.input).toArray();

export const outputPorts = (node: Node): NodePort[] =>
  nodePorts(node, node.action.output).toArray();
