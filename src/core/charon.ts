import { signal } from "@preact/signals";
import { Node, type NodeId } from "./node";
import type { NodePort } from "./port";
import type { Action, Edge } from "./types";

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
  node(id: NodeId): Node | undefined {
    return this.#nodes.get(id);
  }
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

    const newNode = new Node(action);

    this.#nodes.set(newNode.id, newNode);
    this.#update();
    return newNode;
  }

  removeNode(id: NodeId) {
    if (!this.#nodes.has(id)) return;

    this.#nodes.delete(id);
    this.#$edges.value = this.#$edges.value.filter(
      edge => edge.from === id || edge.to === id,
    );
    this.#update();
  }

  connectNodes(from: NodePort, to: NodePort): void {
    const newEdge: Edge = {
      from: from.node,
      fromPort: from.name,
      to: to.node,
      toPort: to.name,
    };
    this.#$edges.value = [...this.#$edges.value, newEdge];
  }
}
