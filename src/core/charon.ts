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

  getAction(actionName: string): Action {
    const action = this.#actions.get(actionName);
    if (action == null) {
      throw new TypeError(`Unknown action name: ${actionName}`);
    }
    return action;
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
    const action = this.getAction(actionName);

    const newNode = new Node(Node.randId(), action);

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

  import(json: string) {
    const data = JSON.parse(json) as { nodes: unknown[] };
    const nodes = data.nodes.map(Node.parse);

    // インポートするノードのidのマップ
    // 既存のノードとidが被っていたらランダムに再割当て
    const importingNodeIdMap = new Map(
      nodes.map(node => [
        node.id,
        this.#nodes.has(node.id) ? Node.randId() : node.id,
      ]),
    );

    for (const node_ of nodes) {
      const action = this.getAction(node_.action);
      const id = importingNodeIdMap.get(node_.id)!;
      const node = new Node(id, action);
      node.pos.value = node_.pos;

      this.#nodes.set(id, node);
    }

    for (const node_ of nodes) {
      const id = importingNodeIdMap.get(node_.id)!;
      const node = this.#nodes.get(id)!;
      for (const [portName, [rawSourceNodeId, sourcePort]] of Object.entries(
        node_.deps,
      )) {
        const sourceNodeId = importingNodeIdMap.get(rawSourceNodeId);
        if (sourceNodeId == null) {
          throw new Error("Invalid node id");
        }
        node.setSource(portName, {
          kind: "out",
          node: this.#nodes.get(sourceNodeId)!,
          name: sourcePort,
        });
      }
    }

    this.#update();
  }

  export() {
    const nodes = this.nodes();
    return JSON.stringify({ nodes });
  }
}
