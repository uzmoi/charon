import type { Node } from "./node";
import type { Vec2 } from "./types";

export type NodePort<T extends "in" | "out"> =
  T extends T ?
    {
      node: Node;
      kind: T;
      name: string;
    }
  : never;

const nodePorts = <T extends "in" | "out">(
  node: Node,
  ports: ReadonlyMap<string, { name: string }>,
  kind: T,
): NodePort<T>[] =>
  ports
    .keys()
    .map(name => ({ node, kind, name }) as NodePort<T>)
    .toArray();

export const inputPorts = (node: Node): NodePort<"in">[] => {
  return nodePorts(node, node.action.input, "in");
};

export const outputPorts = (node: Node): NodePort<"out">[] => {
  return nodePorts(node, node.action.output, "out");
};

export const portType = (port: NodePort<"in" | "out">): string => {
  return port.node.action[`${port.kind}put`].get(port.name)!.name;
};
