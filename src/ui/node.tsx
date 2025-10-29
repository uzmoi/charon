import { useComputed } from "@preact/signals";
import { GripVerticalIcon, MenuIcon, TrashIcon } from "lucide-preact";
import { memo } from "preact/compat";
import { inputPorts, outputPorts, type Charon, type Node } from "../core";
import { GRID_SIZE_UNIT } from "./constants";
import {
  startGrabOutputPort,
  startGrabInputPort,
  startMove,
  type GrabbingSignal,
} from "./grabbing";
import styles from "./node.module.scss";
import { css } from "./utils";

const gridSize = (x: number) => `${x * GRID_SIZE_UNIT}px` as const;

export const CharonNode: preact.FunctionComponent<{
  charon: Charon;
  node: Node;
  grabbing: GrabbingSignal;
}> = memo(({ charon, node, grabbing }) => {
  const onRemove = () => {
    charon.removeNode(node.id);
  };

  const style = useComputed(() => {
    const pos = node.pos.value;
    let delta = { x: 0, y: 0 };

    if (grabbing.value?.current != null && grabbing.value.id === node.id) {
      const { start, current } = grabbing.value;
      delta = {
        x: Math.round(current.x - start.x),
        y: Math.round(current.y - start.y),
      };
    }

    // TODO: +viewBoxPos
    return css({
      left: gridSize(pos.x),
      top: gridSize(pos.y),
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
          onPointerDown={startMove.bind(grabbing, node.id)}
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
                onPointerDown={startGrabInputPort.bind(grabbing, charon, port)}
              />
              <p class={styles.port_type}>{port.type}</p>
              <p class={styles.port_name}>{port.name}</p>
            </div>
          ))}
        </div>
        <div class={styles.output}>
          {outputPorts(node).map(port => (
            <div key={port.name} class={styles.port}>
              <div
                class={styles.port_circle}
                onPointerDown={startGrabOutputPort.bind(grabbing, charon, port)}
              />
              <p class={styles.port_type}>{port.type}</p>
              <p class={styles.port_name}>{port.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

CharonNode.displayName = "CharonNode";
