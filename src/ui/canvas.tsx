import { useSignal } from "@preact/signals";
import module from "./canvas.module.scss";
import { CharonNode } from "./node";
import type { Node, Vec2 } from "./types";

export const CharonCanvas: preact.FunctionComponent = () => {
  const nodes = useSignal<readonly Node[]>([]);

  const onUpdate = (id: number, newNode: Node) => {
    nodes.value = nodes.value.map(node => (node.id === id ? newNode : node));
  };

  const onRemove = (id: number) => {
    nodes.value = nodes.value.filter(node => node.id !== id);
  };

  return (
    <div class={module.canvas}>
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
