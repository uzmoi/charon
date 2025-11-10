import { useComputed, useSignal } from "@preact/signals";
import { useState } from "preact/hooks";
import { Charon, type Action, type BoxSize, type ReadonlyVec2 } from "../core";
import styles from "./canvas.module.scss";
import { GRID_SIZE_UNIT } from "./constants";
import { EdgeCanvas } from "./edge-canvas";
import { GrabbingEdge } from "./grabbing-edge";
import { startCanvasMove, useGrabbingSignal } from "./grabbing";
import { CharonNode } from "./node";
import { NodeTypeSelector } from "./node-type-selector";
import { css } from "./utils";

export const CharonCanvas: preact.FunctionComponent<{
  actions: readonly Action[];
}> = ({ actions }) => {
  const [charon] = useState(() => new Charon({ types: [], actions }));
  const canvasSize = useSignal<BoxSize>({ width: 0, height: 0 });
  const canvasPos = useSignal<ReadonlyVec2>({ x: 0, y: 0 });
  const grabbing = useGrabbingSignal(charon, canvasPos);

  const addNode = (type: string): void => {
    charon.addNode(type);
  };

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

  const style = useComputed(() => {
    let { x, y } = canvasPos.value;
    if (grabbing.value?.delta && grabbing.value.type === "canvas") {
      x += grabbing.value.delta.x;
      y += grabbing.value.delta.y;
    }
    return css({
      "--bg-pos-x": `${x * GRID_SIZE_UNIT}px`,
      "--bg-pos-y": `${y * GRID_SIZE_UNIT}px`,
      // "background-position": `${x * GRID_SIZE_UNIT}px ${y * GRID_SIZE_UNIT}px`,
    });
  });

  return (
    <div class={styles.canvas} ref={canvasRef} style={style}>
      <div class={styles.header}>
        <NodeTypeSelector
          types={actions.map(action => action.name)}
          selectType={addNode}
        />
      </div>
      <div class={styles.edges}>
        <EdgeCanvas {...{ charon, canvasSize, grabbing, canvasPos }} />
      </div>
      <GrabbingEdge {...{ charon, grabbing, canvasPos }} />
      <div class={styles.nodes} onPointerDown={startCanvasMove.bind(grabbing)}>
        {charon.nodes().map(node => (
          <CharonNode
            key={node.id}
            {...{ charon, node, grabbing, canvasPos }}
          />
        ))}
      </div>
    </div>
  );
};
