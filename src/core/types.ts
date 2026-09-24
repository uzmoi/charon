import type { Port } from "./port";

export interface BoxSize {
  width: number;
  height: number;
}

export interface Edge {
  key: string;
  from: Port<"out">;
  to: Port<"in">;
}
