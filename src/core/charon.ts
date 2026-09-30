import { signal } from "@preact/signals";
import type { Action } from "./action";
import { Node, type NodeId } from "./node";
import type { Port } from "./port";
import type { Edge } from "./types";

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

  getActions(): string[] {
    return this.#actions.keys().toArray();
  }

  #nodes = new Map<NodeId, Node>();

  #$nodes = signal<Node[]>([]);
  node(id: NodeId): Node | undefined {
    return this.#nodes.get(id);
  }
  nodes(): Node[] {
    return this.#$nodes.value;
  }
  edges(): Edge[] {
    return this.#$nodes.value.flatMap(node =>
      Object.entries(node.deps).map(([name, from]): Edge => {
        const to: Port<"in"> = { kind: "in", node, name };
        const key = `${from.node.id}#${from.name}-${to.node.id}#${to.name}`;
        return { key, from, to };
      }),
    );
  }
  #update() {
    this.#$nodes.value = this.#nodes.values().toArray();
  }

  addNode(actionName: string): Node {
    const action = this.#actions.get(actionName);
    if (action == null) {
      throw new TypeError();
    }

    const newNode = new Node(action);

    this.#nodes.set(newNode.id, newNode);
    this.#update();
    return newNode;
  }

  removeNode(id: NodeId) {
    if (!this.#nodes.has(id)) return;

    this.#nodes.delete(id);
    this.#update();
  }

  connectNodes(from: Port<"out">, to: Port<"in">): void {
    to.node.setSource(to.name, from);
  }

  disconnect(port: Port<"in">): Port<"out"> | undefined {
    const outPort = port.node.getSource(port.name);
    port.node.unsetSource(port.name);
    return outPort;
  }
}
