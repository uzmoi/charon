import { memo } from "preact/compat";
import type { Node } from "../core";
import styles from "./node.module.scss";
import { GripVerticalIcon, MenuIcon, TrashIcon } from "lucide-preact";
import { useMove } from "./use-move";

const GRID_SIZE_UNIT = 24; // 16 (1rem) * 1.5

const gridSize = (x: number) => `${x * GRID_SIZE_UNIT}px` as const;

export const CharonNode: preact.FunctionComponent<{
  node: Node;
  onUpdate: (node: Node) => void;
  onRemove: () => void;
}> = memo(({ node, onUpdate, onRemove }) => {
  const [delta, onPointerDown] = useMove(delta => {
    const pos = {
      x: node.pos.x + Math.floor(delta.x / GRID_SIZE_UNIT),
      y: node.pos.y + Math.floor(delta.y / GRID_SIZE_UNIT),
    };
    onUpdate({ ...node, pos });
  });

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
        <div class={styles.handle} onPointerDown={onPointerDown}>
          <GripVerticalIcon size="1.75rem" class={styles.handle_icon} />
        </div>
      </div>
      <div class={styles.body}>
        <div class={styles.input}>
          {Object.entries(node.action.input).map(([name, { name: type }]) => (
            <div key={name} class={styles.input_item}>
              <p class={styles.item_type}>{type}</p>
              <p class={styles.item_name}>{name}</p>
            </div>
          ))}
        </div>
        <div class={styles.output}>
          {Object.entries(node.action.output).map(([name, { name: type }]) => (
            <div key={name} class={styles.output_item}>
              <p class={styles.item_type}>{type}</p>
              <p class={styles.item_name}>{name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

CharonNode.displayName = "CharonNode";
