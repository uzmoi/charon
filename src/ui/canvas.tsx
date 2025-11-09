import { useSignal } from "@preact/signals";
import { useState } from "preact/hooks";
import { Charon, type Action, type BoxSize } from "../core";
import styles from "./canvas.module.scss";
import { EdgeCanvas } from "./edge-canvas";
import { GrabbingEdge } from "./grabbing-edge";
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

  const canvasSize = useSignal<BoxSize>({ width: 0, height: 0 });

  const canvasRef = (canvasEl: HTMLDivElement | null) => {
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        canvasSize.value = entry.contentRect;
      }
    });

    if (canvasEl != null) {
      observer.observe(canvasEl);
    }

    return () => {
      observer.disconnect();
    };
  };

  return (
    <div class={styles.canvas} ref={canvasRef}>
      <div class={styles.header}>
        <NodeTypeSelector
          types={actions.map(action => action.name)}
          selectType={addNode}
        />
      </div>
      <div class={styles.edges}>
        <EdgeCanvas {...{ charon, canvasSize, grabbing }} />
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
