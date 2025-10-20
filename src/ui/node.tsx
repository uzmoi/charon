import type { Signal } from "@preact/signals";
import { GripVerticalIcon, MenuIcon, TrashIcon } from "lucide-preact";
import { memo } from "preact/compat";
import { inputPorts, outputPorts, type Charon, type Node } from "../core";
import {
  GRID_SIZE_UNIT,
  NODE_HEADER_HEIGHT,
  NODE_PORT_HEIGHT,
} from "./constants";
import {
  startGrabPort,
  startMove,
  useGrabbingDelta,
  type GrabbingState,
} from "./grabbing";
import styles from "./node.module.scss";

const gridSize = (x: number) => `${x * GRID_SIZE_UNIT}px` as const;

export const CharonNode: preact.FunctionComponent<{
  charon: Charon;
  node: Node;
  grabbing: Signal<GrabbingState | undefined>;
}> = memo(({ charon, node, grabbing }) => {
  const delta = useGrabbingDelta(grabbing, node.id);

  const onRemove = () => {
    charon.removeNode(node.id);
  };

  return (
    <div
      class={styles.node}
      style={{
        // TODO: +viewBoxPos
        left: gridSize(node.pos.x),
        top: gridSize(node.pos.y),
        translate: `${gridSize(Math.floor(delta.value.x / GRID_SIZE_UNIT))} ${gridSize(Math.floor(delta.value.y / GRID_SIZE_UNIT))}`,
        width: gridSize(node.size.width),
        height: gridSize(node.size.height),
      }}
    >
      <div class={styles.header}>
        <p class={styles.action_name}>{node.action.name}</p>
        <div>
          <button
            popoverTarget={`${node.id}-popover`}
            class={styles.menu_popover_button}
          >
            <MenuIcon />
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
          onPointerDown={startMove.bind(grabbing, node.id)}
        >
          <GripVerticalIcon size="1.75rem" class={styles.handle_icon} />
        </div>
      </div>
      <div class={styles.body}>
        <div class={styles.input}>
          {inputPorts(node, NODE_HEADER_HEIGHT, NODE_PORT_HEIGHT).map(port => (
            <div key={port.name} class={styles.input_item}>
              <div class={styles.input_item_port} />
              <p class={styles.item_type}>{port.type}</p>
              <p class={styles.item_name}>{port.name}</p>
            </div>
          ))}
        </div>
        <div class={styles.output}>
          {outputPorts(node, NODE_HEADER_HEIGHT, NODE_PORT_HEIGHT).map(port => (
            <div key={port.name} class={styles.output_item}>
              <div
                class={styles.output_item_port}
                onPointerDown={startGrabPort.bind(grabbing, port)}
              />
              <p class={styles.item_type}>{port.type}</p>
              <p class={styles.item_name}>{port.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

CharonNode.displayName = "CharonNode";
