import { type Signal, useComputed } from "@preact/signals";
import { GripVerticalIcon, MenuIcon, TrashIcon } from "lucide-preact";
import { memo } from "preact/compat";
import {
  inputPorts,
  outputPorts,
  portType,
  type Charon,
  type Node,
  type ReadonlyVec2,
} from "../core";
import { computeGrabbingDelta } from "./compute";
import { GRID_SIZE_UNIT } from "./constants";
import { startGrabPort, startNodeMove, type GrabbingSignal } from "./grabbing";
import styles from "./node.module.scss";
import { css } from "./utils";

const gridSize = (x: number) => `${x * GRID_SIZE_UNIT}px` as const;

export const CharonNode: preact.FunctionComponent<{
  charon: Charon;
  node: Node;
  grabbing: GrabbingSignal;
  canvasPos: Signal<ReadonlyVec2>;
}> = memo(({ charon, node, grabbing, canvasPos }) => {
  const onRemove = () => {
    charon.removeNode(node.id);
  };

  const style = useComputed(() => {
    const pos = node.pos.value;
    const delta = computeGrabbingDelta(grabbing, node.id);

    return css({
      left: gridSize(canvasPos.value.x + pos.x),
      top: gridSize(canvasPos.value.y + pos.y),
      translate: `${gridSize(delta.x)} ${gridSize(delta.y)}`,
      width: gridSize(node.size.width),
      height: gridSize(node.size.height),
    });
  });

  return (
    <div class={styles.node} style={style}>
      <div class={styles.header}>
        <p class={styles.action_name}>{node.action.name}</p>
        <div>
          <button
            popoverTarget={`${node.id}-popover`}
            class={styles.menu_popover_button}
          >
            <MenuIcon size="1.5rem" />
          </button>
          <div
            popover
            id={`${node.id}-popover`}
            class={styles.menu_popover_contents}
          >
            <button onClick={onRemove}>
              <TrashIcon /> Remove Node
            </button>
          </div>
        </div>
        <div
          class={styles.handle}
          onPointerDown={startNodeMove.bind(grabbing, node.id)}
        >
          <GripVerticalIcon size="1.5rem" />
        </div>
      </div>
      <div class={styles.body}>
        <div class={styles.input}>
          {inputPorts(node).map(port => (
            <div key={port.name} class={styles.port}>
              <div
                class={styles.port_circle}
                onPointerDown={startGrabPort.bind(grabbing, charon, port)}
              />
              <p class={styles.port_type}>{portType(port)}</p>
              <p class={styles.port_name}>{port.name}</p>
            </div>
          ))}
        </div>
        <div class={styles.output}>
          {outputPorts(node).map(port => (
            <div key={port.name} class={styles.port}>
              <div
                class={styles.port_circle}
                onPointerDown={startGrabPort.bind(grabbing, charon, port)}
              />
              <p class={styles.port_type}>{portType(port)}</p>
              <p class={styles.port_name}>{port.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

CharonNode.displayName = "CharonNode";
