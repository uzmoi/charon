import type { Node } from "./node";
import type { Vec2 } from "./types";

export interface NodePort {
  node: Node;
  name: string;
  type: string;
}

const nodePorts = (
  node: Node,
  ports: ReadonlyMap<string, { name: string }>,
): NodePort[] =>
  ports
    .entries()
    .map(([name, { name: type }]) => ({ node, name, type }))
    .toArray();

export const inputPorts = (node: Node): NodePort[] => {
  return nodePorts(node, node.action.input);
};

export const outputPorts = (node: Node): NodePort[] => {
  return nodePorts(node, node.action.output);
};
