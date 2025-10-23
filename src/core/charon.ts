import { signal } from "@preact/signals";
import type { NodePort } from "./port";
import type { Action, Edge, Node, NodeId } from "./types";

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

  #nodes = new Map<NodeId, Node>();

  #$nodes = signal<Node[]>([]);
  #$edges = signal<Edge[]>([]);
  nodes(): Node[] {
    return this.#$nodes.value;
  }
  edges(): Edge[] {
    return this.#$edges.value;
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
      id: Math.floor(Math.random() * 0x100000000) as NodeId,
      action,
      pos: { x: 1, y: 1 },
      size: { width: 8, height: 8 },
    };
    this.#nodes.set(newNode.id, newNode);
    this.#update();
    return newNode;
  }

  updateNode(id: NodeId, update: (node: Node) => Node) {
    const node = this.#nodes.get(id);
    if (node == null) {
      throw new Error();
    }

    this.#nodes.set(id, update(node));
    this.#update();
  }

  removeNode(id: NodeId) {
    if (!this.#nodes.has(id)) return;

    this.#nodes.delete(id);
    this.#$edges.value = this.#$edges.value.filter(
      edge => edge.from === id || edge.to === id,
    );
    this.#update();
  }

  connectNodes(from: NodePort, to: NodePort): Edge {
    const newEdge: Edge = {
      id: Math.floor(Math.random() * 0x100000000),
      from: from.node,
      fromPort: from.name,
      to: to.node,
      toPort: to.name,
    };
    this.#$edges.value = [...this.#$edges.value, newEdge];
    return newEdge;
  }
}
