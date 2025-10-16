import { useSignal } from "@preact/signals";
import module from "./canvas.module.scss";
import type { Action } from "../actions";
import { CharonNode } from "./node";
import { NodeTypeSelector } from "./node-type-selector";
import type { Node } from "./types";

export const CharonCanvas: preact.FunctionComponent<{
  actions: readonly Action[];
}> = ({ actions }) => {
  const nodes = useSignal<readonly Node[]>([]);

  const addNode = (type: string): void => {
    const newNode: Node = {
      id: Math.floor(Math.random() * 0x1000000),
      action: actions.find(action => action.name === type)!,
      pos: { x: 1, y: 1 },
      size: { width: 8, height: 8 },
    };
    nodes.value = [...nodes.value, newNode];
  };

  const onUpdate = (id: number, newNode: Node) => {
    nodes.value = nodes.value.map(node => (node.id === id ? newNode : node));
  };

  const onRemove = (id: number) => {
    nodes.value = nodes.value.filter(node => node.id !== id);
  };

  return (
    <div class={module.canvas}>
      <NodeTypeSelector
        types={actions.map(action => action.name)}
        selectType={addNode}
      />
      <div class={module.nodes}>
        {nodes.value.map(node => (
          <CharonNode
            key={node.id}
            node={node}
            onUpdate={onUpdate.bind(null, node.id)}
            onRemove={onRemove.bind(null, node.id)}
          />
        ))}
      </div>
    </div>
  );
};
