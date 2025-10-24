import { type Signal, signal } from "@preact/signals";
import type { Brand } from "@uzmoi/ut/types";
import type { Action } from "./action";
import type { BoxSize, Vec2 } from "./types";

export type NodeId = number & Brand<"Charon.NodeId">;

export class Node {
  // 0x100000000 == 2**32
  readonly id: NodeId = Math.floor(Math.random() * 0x100000000) as NodeId;

  readonly pos: Signal<Vec2> = signal({ x: 1, y: 1 });
  readonly size: BoxSize = { width: 8, height: 8 };

  constructor(readonly action: Action) {}

  move(delta: Vec2) {
    const { x, y } = this.pos.value;
    this.pos.value = {
      x: x + Math.floor(delta.x),
      y: y + Math.floor(delta.y),
    };
  }
}
