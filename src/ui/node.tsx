import { memo } from "preact/compat";
import type { Node, Vec2 } from "./types";
import styles from "./node.module.scss";
import { GripVerticalIcon, MenuIcon, TrashIcon } from "lucide-preact";
import { useMove } from "./use-move";

const REM = 16;

export const CharonNode: preact.FunctionComponent<{
  node: Node;
  onMoved: (pos: Vec2) => void;
  onRemove: () => void;
}> = memo(({ node, onMoved, onRemove }) => {
  const [delta, onPointerDown] = useMove(delta => {
    onMoved({ x: Math.floor(delta.x / REM), y: Math.floor(delta.y / REM) });
  });

  return (
    <div
      class={styles.node}
      style={{
        // TODO: +viewBoxPos
        left: `${node.pos.x}rem`,
        top: `${node.pos.y}rem`,
        translate: `${Math.floor(delta.value.x / REM)}rem ${Math.floor(delta.value.y / REM)}rem`,
        width: `${node.size.width}rem`,
        height: `${node.size.height}rem`,
      }}
    >
      <div class={styles.header}>
        <p class={styles.type}>{node.type}</p>
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
      <div class={styles.body}></div>
    </div>
  );
});

CharonNode.displayName = "CharonNode";
