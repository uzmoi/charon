import { signal } from "@preact/signals";
import type { Action, Node } from "./types";

export class Charon {
  readonly #actions: ReadonlyMap<string, Action>;
  constructor({
    actions,
  }: {
    types: readonly { name: string }[];
    actions: readonly Action[];
  }) {
    this.#actions = new Map(actions.map(action => [action.name, action]));
  }

  #nodes = new Map<number, Node>();

  #$nodes = signal<Node[]>([]);
  nodes(): Node[] {
    return this.#$nodes.value;
  }
  #update() {
    this.#$nodes.value = this.#nodes.values().toArray();
  }

  addNode(actionName: string): Node {
    const action = this.#actions.get(actionName);
    if (action == null) {
      throw new TypeError();
    }
    const newNode: Node = {
      // 0x100000000 == 2**32
      id: Math.floor(Math.random() * 0x100000000),
      action,
      pos: { x: 1, y: 1 },
      size: { width: 8, height: 8 },
    };
    this.#nodes.set(newNode.id, newNode);
    this.#update();
    return newNode;
  }

  updateNode(id: number, node: Node) {
    if (!this.#nodes.has(id)) {
      throw new Error();
    }

    this.#nodes.set(id, node);
    this.#update();
  }

  removeNode(id: number) {
    if (!this.#nodes.has(id)) return;

    this.#nodes.delete(id);
    this.#update();
  }
}
