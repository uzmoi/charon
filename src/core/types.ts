import type { NodePort } from "./port";

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
  from: NodePort<"out">;
  to: NodePort<"in">;
}
