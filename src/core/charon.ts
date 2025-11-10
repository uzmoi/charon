import { signal } from "@preact/signals";
import { Node, type NodeId } from "./node";
import type { Port } from "./port";
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

  getActions(): string[] {
    return this.#actions.keys().toArray();
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
      ({ from, to }) => from.node.id === id || to.node.id === id,
    );
    this.#update();
  }

  connectNodes(from: Port<"out">, to: Port<"in">): void {
    const idToString = (node: Node) => node.id.toString(16).padStart(8, "0");
    const key = `${idToString(from.node)}#${from.name}-${idToString(to.node)}#${to.name}`;
    this.#$edges.value = [...this.#$edges.value, { key, from, to }];
  }

  disconnect(port: Port): Port | undefined {
    const edges = this.#$edges.value;
    const index = edges.findIndex(
      {
        out: ({ from: edgePort }: Edge) =>
          edgePort.node === port.node && edgePort.name === port.name,
        in: ({ to: edgePort }: Edge) =>
          edgePort.node === port.node && edgePort.name === port.name,
      }[port.kind],
    );

    if (index === -1) return;

    this.#$edges.value = edges.toSpliced(index, 1);

    const { from, to } = edges[index]!;

    return { in: from, out: to }[port.kind];
  }
}
