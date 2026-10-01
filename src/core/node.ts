import { type Signal, signal } from "@preact/signals";
import { mapValues, omit } from "es-toolkit";
import * as v from "valibot";
import type { Action } from "./action";
import type { Port } from "./port";
import type { BoxSize } from "./types";
import type { ReadonlyVec2 } from "./vec2";

export type NodeId = number & v.Brand<"Charon.NodeId">;

export class Node {
  // 0x100000000 == 2**32
  static randId(): NodeId {
    return Math.floor(Math.random() * 0x100000000) as NodeId;
  }

  readonly pos: Signal<ReadonlyVec2> = signal({ x: 1, y: 1 });
  readonly size: BoxSize = { width: 8, height: 8 };

  constructor(
    readonly id: NodeId,
    readonly action: Action,
  ) {}

  readonly #deps: Signal<Record<string, Port<"out">>> = signal({});
  get deps() {
    return this.#deps.value;
  }

  getSource(name: string): Port<"out"> | undefined {
    return this.#deps.value[name];
  }

  setSource(name: string, source: Port<"out">): void {
    this.#deps.value = { ...this.#deps.peek(), [name]: source };
  }

  unsetSource(name: string): void {
    this.#deps.value = omit(this.#deps.peek(), [name]);
  }

  move(delta: ReadonlyVec2) {
    const { x, y } = this.pos.value;
    this.pos.value = {
      x: x + Math.floor(delta.x),
      y: y + Math.floor(delta.y),
    };
  }

  *inputs(): Generator<Port<"in">, void> {
    for (const name of this.action.input.keys()) {
      yield { node: this, kind: "in", name };
    }
  }

  *outputs(): Generator<Port<"out">, void> {
    for (const name of this.action.output.keys()) {
      yield { node: this, kind: "out", name };
    }
  }

  toJSON(): v.InferOutput<typeof Node.Schema> {
    return {
      id: this.id,
      action: this.action.name,
      deps: mapValues(
        this.#deps.peek(),
        source => [source.node.id, source.name] as const,
      ),
      pos: this.pos.value,
      size: this.size,
    };
  }

  static parse(value: unknown) {
    return v.parse(Node.Schema, value);
  }

  static IdSchema = v.pipe(v.number(), v.brand("Charon.NodeId"));
  static Schema = v.object({
    id: Node.IdSchema,
    action: v.string(),
    deps: v.record(
      v.string(),
      v.pipe(v.tuple([Node.IdSchema, v.string()]), v.readonly()),
    ),
    pos: v.object({ x: v.number(), y: v.number() }),
    size: v.object({ width: v.number(), height: v.number() }),
  });
}
