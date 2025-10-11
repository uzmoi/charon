import module from "./canvas.module.scss";
import { CharonNode } from "./node";
import type { Node } from "./types";

export const CharonCanvas: preact.FunctionComponent = () => {
  const nodes: readonly Node[] = [];

  return (
    <div class={module.canvas}>
      <div class={module.nodes}>
        {nodes.map(node => (
          <CharonNode key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
};
