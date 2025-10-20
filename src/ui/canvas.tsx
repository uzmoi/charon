import { useState } from "preact/hooks";
import { Charon, type Action } from "../core";
import styles from "./canvas.module.scss";
import { useGrabbingSignal } from "./grabbing";
import { CharonNode } from "./node";
import { NodeTypeSelector } from "./node-type-selector";

export const CharonCanvas: preact.FunctionComponent<{
  actions: readonly Action[];
}> = ({ actions }) => {
  const [charon] = useState(() => new Charon({ types: [], actions }));
  const grabbing = useGrabbingSignal(charon);

  const addNode = (type: string): void => {
    charon.addNode(type);
  };

  return (
    <div class={styles.canvas}>
      <NodeTypeSelector
        types={actions.map(action => action.name)}
        selectType={addNode}
      />
      <div class={styles.nodes}>
        {charon.nodes().map(node => (
          <CharonNode key={node.id} {...{ charon, node, grabbing }} />
        ))}
      </div>
    </div>
  );
};
