import { useComputed } from "@preact/signals";
import { useState } from "preact/hooks";
import { Charon, type Action } from "../core";
import styles from "./canvas.module.scss";
import { CharonEdge } from "./edge";
import { GrabbingEdge } from "./grabbing-edge";
import { useGrabbingSignal } from "./grabbing";
import { CharonNode } from "./node";
import { NodeTypeSelector } from "./node-type-selector";
import { inputPortPos, outputPortPos } from "./pos";

export const CharonCanvas: preact.FunctionComponent<{
  actions: readonly Action[];
}> = ({ actions }) => {
  const [charon] = useState(() => new Charon({ types: [], actions }));
  const grabbing = useGrabbingSignal(charon);

  const addNode = (type: string): void => {
    charon.addNode(type);
  };

  const edgeMax = useComputed(() => {
    const nodes = new Map(charon.nodes().map(node => [node.id, node]));
    const edgePoss = charon.edges().flatMap(edge => {
      const from = nodes.get(edge.from)!;
      const to = nodes.get(edge.to)!;

      return [
        outputPortPos(from, edge.fromPort),
        inputPortPos(to, edge.toPort),
      ];
    });

    const maxX = Math.ceil(Math.max(0, ...edgePoss.map(pos => pos.x)) + 0.5);
    const maxY = Math.ceil(Math.max(0, ...edgePoss.map(pos => pos.y)) + 0.5);
    return { maxX, maxY };
  });

  const width = useComputed(() => `${edgeMax.value.maxX * 1.75}rem`);
  const height = useComputed(() => `${edgeMax.value.maxY * 1.75}rem`);
  const viewBox = useComputed(
    () => `0 0 ${edgeMax.value.maxX} ${edgeMax.value.maxY}`,
  );

  return (
    <div class={styles.canvas}>
      <div class={styles.header}>
        <NodeTypeSelector
          types={actions.map(action => action.name)}
          selectType={addNode}
        />
      </div>
      <div class={styles.edges}>
        <svg width={width} height={height} viewBox={viewBox}>
          {charon.edges().map(edge => (
            <CharonEdge key={edge.id} {...{ charon, edge, grabbing }} />
          ))}
        </svg>
      </div>
      <GrabbingEdge {...{ charon, grabbing }} />
      <div class={styles.nodes}>
        {charon.nodes().map(node => (
          <CharonNode key={node.id} {...{ charon, node, grabbing }} />
        ))}
      </div>
    </div>
  );
};
