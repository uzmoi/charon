import type { NodeId } from "./node";

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
  from: NodeId;
  fromPort: string;
  to: NodeId;
  toPort: string;
}
