import type { Node } from "./node";

export interface Vec2 {
  x: number;
  y: number;
}

export interface BoxSize {
  width: number;
  height: number;
}

export interface Action {
  name: string;
  input: ReadonlyMap<string, { name: string }>;
  output: ReadonlyMap<string, { name: string }>;
  action: (this: void, input: {}) => Promise<{}>;
}

export interface Edge {
  from: Node;
  fromPort: string;
  to: Node;
  toPort: string;
}
