import type { Brand } from "@uzmoi/ut/types";

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

export type NodeId = number & Brand<"Charon.NodeId">;

export interface Node {
  id: NodeId;
  action: Action;
  pos: Vec2;
  size: BoxSize;
}
