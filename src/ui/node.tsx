import { memo } from "preact/compat";
import type { Node, Vec2 } from "./types";
import styles from "./node.module.scss";
import { GripVerticalIcon } from "lucide-preact";
import { useMove } from "./use-move";

const REM = 16;

export const CharonNode: preact.FunctionComponent<{
  node: Node;
  onMoved: (pos: Vec2) => void;
}> = memo(({ node, onMoved }) => {
  const [delta, onPointerDown] = useMove(delta => {
    onMoved({ x: Math.floor(delta.x / REM), y: Math.floor(delta.y / REM) });
  });

  // TODO: +viewBoxPos
  const x = node.pos.x + Math.floor(delta.value.x / REM);
  const y = node.pos.y + Math.floor(delta.value.y / REM);

  return (
    <div
      class={styles.node}
      style={{
        translate: `${x}rem ${y}rem`,
        width: `${node.size.width}rem`,
        height: `${node.size.height}rem`,
      }}
    >
      <div class={styles.header}>
        <p class={styles.title}>{node.title}</p>
        <div
          class={styles.handle}
          data-id={node.id}
          onPointerDown={onPointerDown}
        >
          <GripVerticalIcon size="1.75rem" class={styles.handle_icon} />
        </div>
      </div>
      <div class={styles.body}></div>
    </div>
  );
});

CharonNode.displayName = "CharonNode";
