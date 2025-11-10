import type { Node } from "./node";

export interface Port<out TKind extends "in" | "out" = "in" | "out"> {
  node: Node;
  kind: TKind;
  name: string;
}

export const portType = (port: Port): string => {
  return port.node.action[`${port.kind}put`].get(port.name)!.name;
};
