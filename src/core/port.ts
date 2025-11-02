import type { Node } from "./node";

export interface InputPort {
  node: Node;
  kind: "in";
  name: string;
}

export interface OutputPort {
  node: Node;
  kind: "out";
  name: string;
}

export type Port = InputPort | OutputPort;

const nodePorts = <T extends Port>(
  node: Node,
  ports: ReadonlyMap<string, { name: string }>,
  kind: T["kind"],
): T[] =>
  ports
    .keys()
    .map(name => ({ node, kind, name }) as T)
    .toArray();

export const inputPorts = (node: Node): InputPort[] => {
  return nodePorts(node, node.action.input, "in");
};

export const outputPorts = (node: Node): OutputPort[] => {
  return nodePorts(node, node.action.output, "out");
};

export const portType = (port: Port): string => {
  return port.node.action[`${port.kind}put`].get(port.name)!.name;
};
