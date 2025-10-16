import { useSignal } from "@preact/signals";
import module from "./canvas.module.scss";
import { CharonNode } from "./node";
import type { Node, Vec2 } from "./types";

export const CharonCanvas: preact.FunctionComponent = () => {
  const nodes = useSignal<readonly Node[]>([]);

  const onMoved = (id: number, delta: Vec2) => {
    nodes.value = nodes.value.map(node =>
      node.id === id ?
        { ...node, pos: { x: node.pos.x + delta.x, y: node.pos.y + delta.y } }
      : node,
    );
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
            onMoved={onMoved.bind(null, node.id)}
            onRemove={onRemove.bind(null, node.id)}
          />
        ))}
      </div>
    </div>
  );
};
