import type { Action } from "../actions";

export interface Vec2 {
  x: number;
  y: number;
}

export interface Node {
  id: number;
  action: Action;
  pos: Vec2;
  size: BoxSize;
}
